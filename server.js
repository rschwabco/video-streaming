// Import the necessary libraries
var express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const sharp = require("sharp");
// Create an Express app
var app = express();

const server = http.createServer(app);

const io = socketIo(server);

let interval;

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("video", async (...args) => {
    sharp(args[0])
      .resize(512, 512, { fit: "contain" })
      .toFile("file.png", (err, info) => {});
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});
const port = 8080;
// Start the HTTP server
server.listen(port, () => console.log(`Listening on port ${port}`));
