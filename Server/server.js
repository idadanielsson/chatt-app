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

let activeRoom = "";

io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("user_connected", (username) => {
    socket.broadcast.emit("new-user-connected", username);
    console.log(username);
  });

  socket.on("new_message", (messageFromClient) => {
    io.to(activeRoom).emit("new-message-sent", messageFromClient);
  });

  socket.on("join_room", (room, roomToLeave) => {
    socket.join(room);
    socket.leave(roomToLeave);

    if (socket.rooms.has(socket.id)) {
      socket.leave(socket.id);
    }

    let mapData = Object.fromEntries(
      Array.from(io.sockets.adapter.rooms, ([key, value]) => {
        return [key, value];
      })
    );

    io.emit("active_rooms", mapData);
    socket.emit("set_current_room", room);
    activeRoom = room;
    console.log(activeRoom);
  });

  socket.on("disconnect", (username) => {
    console.log("A user disconnected", username);
  });
});

server.listen(3000, () => console.log("Server is up an running"));
