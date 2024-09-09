import pool from "../db/db.js";

export default (io, socket) => {
  let room_Id;

  try {
    socket.on("join-private-room", async (room) => {
      room_Id = room;
      socket.join(room);
      console.log(`User ${socket.id} joined Private room: ${room}`);
      const response = await pool.query(
        "SELECT * FROM private_messages WHERE room_id = $1",
        [room]
      );
      // console.log(response.rows);
      socket.emit("previous-messages", response.rows);
      // io.to(room_Id).emit("previous-messages", response.rows);
    });
    // console.log(room_Id);

    //

    socket.on("send-private-message", async (data) => {
      const { roomId, message, username } = data;

      await pool.query(
        "INSERT INTO private_messages (room_id, username, message) VALUES ($1, $2, $3)",
        [roomId, username, message]
      );

      console.log("New private message stored");

      io.to(roomId).emit("get-private-message", {
        message,
        username,
        id: roomId,
      });
    });
    // UPDATING MESSAGES
    socket.on("update-message", async (data) => {
      const { id, roomId, updatedMessage } = data;

      await pool.query(
        "UPDATE private_messages SET message = $1 WHERE id = $2",
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

      await pool.query("DELETE FROM private_messages WHERE id = $1", [id]);
      console.log("DELETING MESSAGE");
      io.to(roomId).emit("deleted-message", id);
    });
  } catch (error) {
    console.log(error);
  }
};
