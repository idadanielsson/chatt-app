const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
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

  socket.on("new_message", (messageFromClient) => {
    io.emit("new-message-sent", messageFromClient);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => console.log("Server is up an running"));
