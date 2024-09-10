import pool from "../db/db.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { todoValidation } from "../utils/validation.js";

const getAlltodo = asyncHandler(async (req, res) => {
  const email = req.params.email;
  let userId;
  if (!email) return res.status(400).json({ message: "No email in request" });

  if (email) {
    const emailRows = await pool.query(
      "SELECT user_id from users WHERE email = $1",
      [email]
    );
    // console.log("Email Rows", emailRows.rows[0]);
    userId = emailRows.rows[0].user_id;
  }

  if (!userId) return res.status(404).json({ message: "No user Id" });
  const resRows = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
    userId,
  ]);
  // console.log(resRows.rows[0]);
  if (resRows?.rows?.length === 0) {
    // console.log("IF CHECK");
    return res.status(200).json({ todos: [], message: "No todos Found" });
  }
  // console.log("IF CHECK PASSED");
  // console.log(resRows.rows);
  if (resRows.rows) {
    const todos = resRows.rows;

    return res.status(200).json({ todos });
  }
  return res.status(500).json({ message: "Internal Server Error" });
});

const postEditTodo = asyncHandler(async (req, res) => {
  const { todoId, userId, todo } = req.body;
});

const postAddTodo = asyncHandler(async (req, res) => {
  const { email, description } = req.body;
  const result = todoValidation.validate({ description });
  if (result.error) {
    res.status(400);
    throw new Error(result.error.message);
  }
  const userRows = await pool.query(
    "SELECT user_id FROM users WHERE email = $1",
    [email]
  );
  const userId = userRows.rows[0].user_id;
  if (userId) {
    const addTodoRows = await pool.query(
      "INSERT INTO todos(user_id , todo_description) VALUES($1, $2) RETURNING todo_id,todo_description,todo_done",
      [userId, description]
    );
    const newTodo = addTodoRows.rows[0];
    return res.status(201).json({ newTodo });
  }
  return res.status(500).json({ message: "Internal Server Error" });
});

const postTodoStatus = asyncHandler(async (req, res) => {
  const { todoId, email, status } = req.body;

  const userRows = await pool.query(
    "SELECT user_id FROM users WHERE email = $1",
    [email]
  );
  const userId = userRows.rows[0].user_id;
  if (!userId) return res.status(404).json({ message: "No user Id" });
  const resData = await pool.query(
    "UPDATE todos SET todo_done=$1 WHERE user_id=$2 AND todo_id=$3 RETURNING todo_done",
    [status, userId, todoId]
  );
  const newStatus = resData.rows[0].todo_done;
  if (newStatus === undefined) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res
    .status(200)
    .json({ newStatus, message: "Status Updated Succesfully" });
});

const postDeleteTodo = async (req, res) => {
  const { todoId, email } = req.body;

  const userRows = await pool.query(
    "SELECT user_id FROM users WHERE email = $1",
    [email]
  );

  const userId = userRows.rows[0].user_id;

  const resData = await pool.query(
    "DELETE FROM todos WHERE user_id = $1 AND todo_id =$2 RETURNING todo_id",
    [userId, todoId]
  );
  const todo_Id = resData.rows[0].todo_id;
  if (todo_Id === undefined) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!todo_Id) {
    return res
      .status(404)
      .json({ message: "The requested action cannot be completed" });
  }
  if (todo_Id) {
    return res
      .status(200)
      .json({ deletedTodo: todo_Id, message: "Todo Deleted Successfully" });
  }
};

export {
  getAlltodo,
  postAddTodo,
  postEditTodo,
  postTodoStatus,
  postDeleteTodo,
};
