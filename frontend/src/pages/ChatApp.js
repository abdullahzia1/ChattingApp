import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../context/AuthContext";
import { io } from "socket.io-client";
import "./styles/ChatApp.css";

const ChatApp = () => {
  const { user } = useContext(AuthContext); // Add socket to context
  const [msgBox, setMsgBox] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  //   let [socket, setSocket] = useState(null);
  let [messages, setMessages] = useState([]);
  const alertInput = parseInt(localStorage.getItem("alertInput")) || 1;

  const newSocket = useMemo(
    () =>
      io("http://localhost:5000", {
        query: { name: user?.name },
      }),
    []
  );
  useEffect(() => {
    if (alertInput === 1) {
      newSocket
        .emit("join-public-room", "public-room")
        .on("previous-messages", (data) => {
          const fetchedMessages = data.map((dataMsg) => ({
            username: dataMsg.username,
            message: dataMsg.message,
            id: dataMsg.id,
          }));
          setMessages(fetchedMessages);
        });

      //   newSocket.on("previous-messages", (data) => {
      //     const fetchedMessages = data.map((dataMsg) => ({
      //       username: dataMsg.username,
      //       message: dataMsg.message,
      //       id: dataMsg.id,
      //     }));
      //     setMessages(fetchedMessages);
      //   });

      newSocket.on("get-public-message", (messageObj) => {
        setMessages((prev) => [...prev, messageObj]);
      });
    } else if (alertInput > 1) {
      newSocket
        .emit("join-private-room", alertInput)
        .on("previous-messages", (data) => {
          const fetchedMessages = data.map((dataMsg) => ({
            username: dataMsg.username,
            message: dataMsg.message,
            id: dataMsg.id,
          }));
          setMessages(fetchedMessages);
        });
      //   newSocket.on("previous-messages", (data) => {
      //     const fetchedMessages = data.map((dataMsg) => ({
      //       username: dataMsg.username,
      //       message: dataMsg.message,
      //       id: dataMsg.id,
      //     }));
      //     setMessages(fetchedMessages);
      //   });
      newSocket.on("get-private-message", (messageObj) => {
        if (alertInput === messageObj.id) {
          setMessages((prev) => [...prev, messageObj]);
        }
      });
    }

    return () => {
      newSocket?.disconnect();
    };
  }, []);

  //   const createConnection = async () => {
  // setSocket(newSocket);

  //     if (alertInput === 1) {
  //       newSocket.emit("join-public-room", "public-room");

  //       newSocket.on("previous-messages", (data) => {
  //         const fetchedMessages = data.map((dataMsg) => ({
  //           username: dataMsg.username,
  //           message: dataMsg.message,
  //           id: dataMsg.id,
  //         }));
  //         setMessages(fetchedMessages);
  //       });

  //       newSocket.on("get-public-message", (messageObj) => {
  //         setMessages((prev) => [...prev, messageObj]);
  //       });
  //     } else if (alertInput > 1) {
  //       newSocket.emit("join-private-room", alertInput);
  //       newSocket.on("previous-messages", (data) => {
  //         const fetchedMessages = data.map((dataMsg) => ({
  //           username: dataMsg.username,
  //           message: dataMsg.message,
  //           id: dataMsg.id,
  //         }));
  //         setMessages(fetchedMessages);
  //       });
  //       newSocket.on("get-private-message", (messageObj) => {
  //         if (alertInput === messageObj.id) {
  //           setMessages((prev) => [...prev, messageObj]);
  //         }
  //       });
  //     }
  //   };

  //   const destroyConnection = () => {
  //     newSocket?.disconnect();
  //     // setSocket(null);
  //   };

  const sendMessage = (message) => {
    if (message && alertInput === 1) {
      newSocket.emit("send-public-message", {
        roomId: "public-room",
        username: user?.name,
        message,
      });
      //   setMessages((prev) => [...prev, message]);
    } else if (message && alertInput >= 2) {
      newSocket.emit("send-private-message", {
        roomId: alertInput,
        username: user?.name,
        message,
      });
      //   setMessages((prev) => [...prev, message]);
    }
  };

  const handleSendMessage = () => {
    if (editingMessage) {
      // If editing, send an update message event
      newSocket.emit("update-message", {
        id: editingMessage.id,
        message: editedMessage,
      });
      setEditingMessage(null);
      setEditedMessage("");
    } else {
      sendMessage(msgBox);
    }
    setMsgBox("");
  };

  const handleDeleteMessage = (messageId) => {
    newSocket.emit("delete-message", { id: messageId });
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setEditedMessage(message.message);
  };

  return (
    <div className="chatContainer">
      <h3 className="welcomeText">Welcome, {user?.name}</h3>

      <div id="chatArea" className="chatArea">
        {messages.map((msg) => (
          <div key={msg.id} className="messageContainer">
            <b>{msg.username}:</b> {msg.message}
            {msg.username === user.name && (
              <div className="messageActions">
                <button
                  className="editButton"
                  onClick={() => handleEditMessage(msg)}
                >
                  Edit
                </button>
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteMessage(msg.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        className="messageInput"
        value={editingMessage ? editedMessage : msgBox}
        onChange={(e) => {
          editingMessage
            ? setEditedMessage(e.target.value)
            : setMsgBox(e.target.value);
        }}
        placeholder={editingMessage ? "Edit message..." : "Type a message"}
      />
      <button className="sendButton" onClick={handleSendMessage}>
        {editingMessage ? "Update Message" : "Send"}
      </button>
    </div>
  );
};

export default ChatApp;