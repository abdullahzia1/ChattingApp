import React, { useContext, useEffect, useState } from "react";
import "./Todo.css";
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
const Todo = () => {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const getAllTodos = async () => {
    try {
      const email = user.email;
      const response = await api.get("/api/todos/all/" + email);
      if (response.status === 200) {
        setTimeout(() => {
          console.log(response.data.todos);
        }, 4000);
        setTodos(response.data.todos);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  //
  useEffect(() => {
    getAllTodos();
  }, []);

  //

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    try {
      if (newTodo.trim() !== "") {
        const response = await api.post("/api/todos/add", {
          description: newTodo,
          email: user.email,
        });
        console.log(response.data.newTodo);
        // const newTodoItem = {
        //   todo_description: newTodo,
        //   todo_done: false,
        // };
        setTodos([...todos, response.data.newTodo]);
        setNewTodo("");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.todo_id === id);

      if (todoToUpdate) {
        const response = await api.post("/api/todos/update", {
          todoId: id,
          email: user.email,
          status: !todoToUpdate.todo_done,
        });

        if (response.status === 200) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.todo_id === id
                ? { ...todo, todo_done: !todo.todo_done }
                : todo
            )
          );
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await api.post("/api/todos/delete", {
        todoId: id,
        email: user.email,
      });
      if (response.status === 200) {
        const updatedTodos = todos.filter((todo) => todo.todo_id !== id);
        setTodos(updatedTodos);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  };

  return (
    <div className="todo-box">
      <h2 className="todo-h2">Todo List</h2>

      <div className="todo-container">
        <div>
          <input
            type="text"
            placeholder="Add a new todo"
            className="input-todo"
            value={newTodo}
            onChange={handleInputChange}
          />
          <button className="add-todo" onClick={handleAddTodo}>
            Add Todo
          </button>
        </div>

        <h3>Pending Todos</h3>
        <ul className="todo-ul">
          {todos
            .filter((todo) => !todo.todo_done) // Filter pending todos
            .map((todo) => (
              <li className="todo-li" key={todo.todo_id}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.todo_done}
                  onChange={() => handleToggleComplete(todo.todo_id)}
                />
                <span className="todo-display-text">
                  {todo.todo_description}
                </span>
                <button
                  className="delete-todo"
                  onClick={() => handleDeleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>

        <h3>Completed Todos</h3>
        <ul className="todo-ul">
          {todos
            .filter((todo) => todo.todo_done)
            .map((todo) => (
              <li className="todo-li" key={todo.todo_id}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.todo_done}
                  onChange={() => handleToggleComplete(todo.todo_id)}
                />
                <span className="todo-display-text completed">
                  {todo.todo_description}
                </span>
                <button
                  className="delete-todo"
                  onClick={() => handleDeleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
