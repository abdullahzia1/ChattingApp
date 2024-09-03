import express from "express";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
configDotenv();

import pool from "./db/db.js";
import { constantPath } from "./utils/constant.js";
import { postRoomId } from "./controller/chatController.js";

const app = express();
const port = process.env.PORT || 5002;
let io;

app.use("/", (req, res, next) => {
  req.io = io;
  next();
});

app.use("/", express.static(constantPath("..", "client")));

// app.use("/", (req, res, next) => {
//   res.sendFile(constantPath("..", "index.html"));
// });
postRoomId();

pool
  .connect()
  .then((data) => {
    const server = app.listen(port, () => {
      console.log(`Server is runnng on port ${port}`);
    });
    // console.log(server);
    io = new Server(server, { cors: { origin: "*" } });
    io.on("connection", async (socket) => {
      console.log(`Client Connected: ${socket.id}`);
      socket.on("disconnect", async () => {
        console.log("Socket Disconnected: ", socket.id);
      });
      socket.on("send-public-message", async function (messageObj) {
        io.emit("get-public-message", messageObj);
        console.log(messageObj);
      });

      socket.on("send-private-message", async function (data) {
        const { message, roomId } = data;
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        io.to(roomId).emit("get-private-message", { message, id: roomId });
        // io.emit("get-private-message", messageObj);
        console.log(data);
      });

      // socket.on("send-public-message", async function (data) {
      //   const { message } = data;
      //   socket.join(roomId);
      //   console.log(`User ${socket.id} joined room: ${roomId}`);
      //   io.to(roomId).emit("get-public-message", { message, id: roomId });
      //   // io.emit("get-private-message", messageObj);
      //   console.log(data);
      // });
    });
  })
  .catch((error) => {
    console.log(error);
  });
