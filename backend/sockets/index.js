import { Server } from "socket.io";
import publicRoom from "./publicRoom.js";
import privateRoom from "./privateRoom.js";

export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    publicRoom(io, socket);

    privateRoom(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
