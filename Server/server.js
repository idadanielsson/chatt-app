const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
const { SocketAddress } = require("net");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("user_connected", (username) => {
    socket.broadcast.emit("new-user-connected", username);
    console.log(username);
  });

  socket.on("isTyping", ({ username, isTyping, room }) => {
    socket.to(room).emit("user_typing", { username, isTyping });
  });

  socket.on("new_message", (messageFromClient, room) => {
    io.to(room).emit("new-message-sent", messageFromClient);
  });

  socket.on("join_room", (room, roomToLeave) => {
    socket.join(room);

    if (room !== roomToLeave) {
      socket.leave(roomToLeave);
    }

    if (socket.rooms.has(socket.id)) {
      socket.leave(socket.id);
    }

    let mapData = Object.fromEntries(
      Array.from(io.sockets.adapter.rooms, ([room, user]) => {
        return [room, user];
      })
    );

    let roomsList = Object.keys(mapData);

    if (!roomsList.includes("lobby")) {
      roomsList.push("lobby");
    }

    io.emit("active_rooms", roomsList);
    socket.emit("set_current_room", room);
  });

  socket.on("disconnect", (username) => {
    console.log("A user disconnected", username);
  });
});

server.listen(3000, () => console.log("Server is up an running"));
