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
let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("user_connected", (username) => {
    socket.broadcast.emit("new-user-connected", username);
    console.log(username);
    io.emit("active_rooms", activeRooms);
    connectedUsers.push(username);

    console.log(connectedUsers);
  });

  socket.on("new_message", (messageFromClient) => {
    io.emit("new-message-sent", messageFromClient);
  });

  socket.on("join_room", (room, roomToLeave) => {
    socket.join(room);
    socket.leave(roomToLeave);

    // updateRooms();

    const mapData = new Map(io.sockets.adapter.rooms);
    console.log("mapdata:", mapData);

    const mapList = Array.from(mapData);
    console.log(mapList);

    socket.emit("active_rooms", mapList);

    // console.log(io.sockets.adapter.rooms);
    // io.emit("set_current_room", room);
  });

  // socket.on("join_room", (room, roomToLeave) => {
  //   socket.join(room);

  //   socket.leave(roomToLeave);
  //   const existingRoom = activeRooms.find((a) => a === room);

  //   let foundRoomToLeave = io.sockets.adapter.rooms.has(roomToLeave);
  //   console.log("foundRoomToLeave", foundRoomToLeave);

  //   console.log(io.sockets.adapter.rooms);

  //   if (!existingRoom) {
  //     activeRooms.push(room);
  //   }

  //   // console.log(foundRoomToLeave);

  //   if (!foundRoomToLeave) {
  //     // console.log("hej");

  //     activeRooms = activeRooms.filter((room) => room !== roomToLeave);

  //     // const index = activeRooms.findIndex((room) => room === roomToLeave);

  //     // if (index != -1) {
  //     //   activeRooms.splice(index, 1);
  //     // }
  //     // console.log(index);
  //   }

  //   // console.log(roomToLeave);
  //   // console.log(io.sockets.adapter.rooms);
  //   io.emit("active_rooms", activeRooms);
  //   io.emit("set_current_room", room);

  //   console.log(activeRooms);
  // });

  socket.on("disconnect", (username) => {
    console.log("A user disconnected", socket.id);
    console.log(username);
  });
});

updateRooms = () => {};

server.listen(3000, () => console.log("Server is up an running"));
