import express from "express";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
configDotenv();

import pool from "./db/db.js";
import { constantPath } from "./utils/constant.js";

const app = express();
let io;

app.set("view engine", "ejs");
app.set("views", constantPath("..", "views"));
app.use(express.static(constantPath("..", "public")));

app.use("/", (req, res, next) => {
  res.render("index");
});

//routes setup or etc

const port = process.env.PORT || 5002;
pool
  .connect()
  .then((data) => {
    const server = app.listen(port, () => {
      console.log(`Server is runnng on port ${port}`);
    });
    console.log(server);
    io = new Server(server, {});
    io.on("connection", (socket) => {
      console.log("Client Connected!");
      console.log(`Client id: ${socket.id}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
