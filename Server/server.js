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

let activeRooms = [];

io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("user_connected", (username) => {
    socket.broadcast.emit("new-user-connected", username);
    console.log(username);
  });

  socket.on("new_message", (messageFromClient) => {
    io.emit("new-message-sent", messageFromClient);
  });

  socket.on("join_room", (room) => {
    const existingRoom = activeRooms.find((a) => a === room);

    if (existingRoom) {
      socket.join(room);
      console.log(io.sockets.adapter.rooms);
      io.emit("active_rooms", activeRooms);
    } else {
      socket.join(room);
      activeRooms.push(room);
      console.log(io.sockets.adapter.rooms);
      io.emit("active_rooms", activeRooms);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => console.log("Server is up an running"));