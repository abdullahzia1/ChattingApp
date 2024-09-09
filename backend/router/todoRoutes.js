import express from "express";
import {
  getAlltodo,
  postDeleteTodo,
  postAddTodo,
  postTodoStatus,
} from "../controller/todoController.js";

const todoRoutes = express.Router();

todoRoutes.get("/all/:email", getAlltodo);
todoRoutes.post("/delete", postDeleteTodo);
todoRoutes.post("/add", postAddTodo);
todoRoutes.post("/update", postTodoStatus);

export default todoRoutes;
