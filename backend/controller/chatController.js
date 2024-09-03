import pool from "../db/db.js";
import fs from "fs/promises";
import { constantPath } from "../utils/constant.js";

const postRoomId = async (req, res) => {
  try {
    // const { dialNum } = req.body;
    const users = JSON.parse(
      await fs.readFile(constantPath("..", "data", "user.json"), {
        encoding: "utf8", // to get data, instead of buffer.
      })
    );
    // data.map((data) => console.log(data.RoomNum));
    // console.log(data);
    users.forEach((user) => {
      // console.log(user.dialingNum);
      if (user.dialingNum === dialNum) {
        req.io.on("connection", async (socket) => {
          console.log(`Client Connected: ${socket.id}`);
          socket.on("disconnect", async () => {
            console.log("Socket Disconnected: ", socket.id);
          });
          socket.on("send-private-message", async function (data) {
            const { message, roomId } = data;
            console.log(data);

            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
            req.io
              .to(roomId)
              .emit("get-private-message", { message, id: roomId });
            // io.emit("get-private-message", messageObj);
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
      }
    });
  } catch (error) {}
};

// function RoomID() {
//   return console.log(constantPath("..", "data"));
// }

export { postRoomId };
