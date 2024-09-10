import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();

import pool from "./db/db.js";

import { initSocket } from "./sockets/index.js";
import appRoutes from "./router/indexRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { constantPath } from "./utils/constant.js";

const app = express();
const port = process.env.SERVER_PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(cookieParser());

// app.use("/", express.static(constantPath("..", "client")));

app.use("/api", appRoutes);

if (process.env.NODE_ENV === "production") {
  console.log(constantPath("..", "..", "/frontend/build"));

  app.use(express.static(constantPath("..", "..", "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(constantPath("..", "..", "/frontend/build/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);

app.use(errorHandler);

pool
  .connect()
  .then((data) => {
    const server = app.listen(port, () => {
      console.log(`Server is runnng on port ${port}`);
    });
    initSocket(server);
  })
  .catch((error) => {
    console.log(error);
  });
