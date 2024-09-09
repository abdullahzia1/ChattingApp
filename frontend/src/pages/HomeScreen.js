import React from "react";
import Todo from "../components/Todo";
import "./styles/HomeScreen.css";
import ChatApp from "./ChatApp";

const HomeScreen = () => {
  return (
    <>
      <div className="homescreen-box">
        Welcome to Home Screen
        <div className="component-box">
          <div className="homescreen-todo-box">
            <Todo />
          </div>

          <div className="homescreen-chat-box">
            <ChatApp />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
