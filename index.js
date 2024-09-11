const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));

io.on("connection", (socket) => {
  //   console.log("a user connected", socket.id);
  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

server.listen(8080, () => console.log("Server Running in port:8080"));
