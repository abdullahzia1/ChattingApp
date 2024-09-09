import pool from "../db/db.js";

export default (io, socket) => {
  socket.on("join-public-room", async (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined public room: ${room}`);
    try {
      const response = await pool.query("SELECT * FROM public_messages");
      socket.emit("previous-messages", response.rows);

      socket.on("send-public-message", async (data) => {
        const { roomId, message, username } = data;

        await pool.query(
          "INSERT INTO public_messages (room_name, user_name, message) VALUES ($1, $2, $3)",
          [roomId, username, message]
        );

        console.log("New public message stored");

        io.to(roomId).emit("get-public-message", { message, username });
      });
      // UPDATING MESSAGES
      socket.on("update-message", async (data) => {
        const { id, roomId, updatedMessage } = data;

        await pool.query(
          "UPDATE public_messages SET message = $1 WHERE id = $2",
          [updatedMessage, id]
        );
        console.log("UPDATING MESSAGE");
        io.to(roomId).emit("updated-message", {
          id: id,
          message: updatedMessage,
        });
      });
      // DELETEING PUBLIC MESSAGE
      socket.on("delete-message", async (data) => {
        const { id, roomId } = data;

        await pool.query("DELETE FROM public_messages WHERE id = $1", [id]);
        console.log("DELETING MESSAGE");
        io.to(roomId).emit("deleted-message", id);
      });
    } catch (error) {
      console.log(error);
    }
  });
};
