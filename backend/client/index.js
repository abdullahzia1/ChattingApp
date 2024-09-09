let loginForm = document.getElementById("loginForm");
let loggedIn = false;

let username = document.getElementById("username");
let loginButton = document.getElementById("setNameBtn");
let disconnectBtn = document.getElementById("disconnectBtn");
let charArea = document.getElementById("charArea");
let msgBox = document.getElementById("msgBox");
let sendBtn = document.getElementById("sendBtn");

const alertInput = +prompt(
  "Enter '1' for Public Chat or Enter your friends number "
);

if (alertInput === 1) {
  function login() {
    if (!username.value || loggedIn) return;
    loggedIn = true;
    loginForm.setAttribute("hidden", true);
    disconnectBtn.removeAttribute("hidden");
    charArea.removeAttribute("hidden");
    msgBox.removeAttribute("hidden");
    sendBtn.removeAttribute("hidden");
    createConnection();
  }
  loginButton.onclick = login;

  function logout() {
    if (!loggedIn) return;

    loginForm.removeAttribute("hidden");
    charArea.setAttribute("hidden", true);
    charArea.innerHTML = "";
    disconnectBtn.setAttribute("hidden", true);
    msgBox.setAttribute("hidden", true);
    sendBtn.setAttribute("hidden", true);
    loggedIn = false;
    destroyConnection();
  }
  disconnectBtn.onclick = logout;
} else if (alertInput >= 2) {
  loggedIn = true;
  loginForm.setAttribute("hidden", true);
  disconnectBtn.removeAttribute("hidden");
  charArea.removeAttribute("hidden");
  msgBox.removeAttribute("hidden");
  sendBtn.removeAttribute("hidden");
  privateConnection();
}

async function createConnection() {
  socket = io("", { query: { name: username.value } });
  try {
    socket.emit("join-public-room", "public-room");
    //fetching previous messages from Database
    socket.on("previous-messages", async function (data) {
      console.log("This is a message from Public Room and DB", data);
      let messages = [];
      messages = data.map((dataMsg) => {
        return [dataMsg.user_name, dataMsg.message, dataMsg.id];
      });
      console.log(messages);
      messages.forEach((message) => {
        const messageObject = {
          username: message[0],
          message: message[1],
          id: message[2],
        };
        receiveMessage(messageObject);
      });
    });
    // fetching new messages
    socket.on("get-public-message", async function (messageObj) {
      console.log("got message : ", messageObj);

      receiveMessage(messageObj);
    });
  } catch (error) {
    console.log;
  }
}

function destroyConnection() {
  socket.disconnect();
}

async function privateConnection() {
  socket = io("", { query: { roomId: alertInput } });

  socket.emit("join-private-room", alertInput);

  socket.on("get-private-message", async (messageObj) => {
    console.log("got a private message : ", messageObj);
    if (alertInput === messageObj.id) receiveMessage(messageObj);
  });
}

function sendMessage() {
  if (msgBox.value && alertInput === 1) {
    socket.emit("send-public-message", {
      roomId: "public-room",
      username: username.value,
      message: msgBox.value,
    });
    msgBox.value = "";
  } else if (msgBox.value && alertInput >= 2) {
    socket.emit("send-private-message", {
      roomId: alertInput,
      message: msgBox.value,
    });
    msgBox.value = "";
  }
}
sendBtn.onclick = sendMessage;

function receiveMessage(messageObj) {
  let pElement = document.createElement("p");
  let deleteButton;
  let editButton;
  pElement.id = messageObj.id;
  pElement.style.padding = "5px";
  let boldElement = document.createElement("b");
  let bold2Element = document.createElement("b");
  bold2Element.innerHTML = messageObj.id;
  // console.log(username.value, " |||  ", messageObj.username);
  if (username.value == messageObj.username) {
    // console.log(username, messageObj.username);
    //delete button for msg
    deleteButton = document.createElement("button");
    deleteButton.style.color = "red";
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => {
      socket.emit("delete-message", {
        roomId: alertInput > 2 ? alertInput : "public-room",
        id: pElement.id,
      });

      socket.on("deleted-message", async function (id) {
        console.log("Recieved Data", id);
        const elementToRemove = document.getElementById(id);
        if (elementToRemove) {
          elementToRemove.remove();
        }
      });
    });

    //EDIT CODE

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      const editSpan = document.createElement("span");
      editSpan.style.display = "inline-block";

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = messageObj.message;

      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";

      updateButton.addEventListener("click", () => {
        const updatedMessage = editInput.value;

        socket.emit("update-message", {
          roomId: alertInput > 2 ? alertInput : "public-room",
          id: pElement.id,
          message: updatedMessage,
        });

        socket.on("updated-message", function async(data) {});

        spanElement.textContent = updatedMessage;

        editSpan.remove();
      });

      editSpan.appendChild(editInput);
      editSpan.appendChild(updateButton);

      pElement.replaceChild(editSpan, spanElement);
    });

    pElement.appendChild(editButton);
    //
  }

  boldElement.innerHTML =
    alertInput > 2 ? messageObj.id + " : " : messageObj.username + " : ";

  let spanElement = document.createElement("span");
  spanElement.innerHTML = messageObj.message;
  // pElement.appendChild(bold2Element);
  pElement.appendChild(boldElement);
  pElement.appendChild(spanElement);
  if (username.value == messageObj.username) {
    pElement.appendChild(deleteButton);
  }

  charArea.appendChild(pElement);
}
