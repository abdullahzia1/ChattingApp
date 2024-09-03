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
// socket.emit("join_room", alertInput);

async function getRoomID(dialNum) {
  try {
    const data = await fetch("http://localhost:5000/getRoom", {
      method: "POST",
      data: dialNum,
    });
    if (data.status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

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

  socket.on("get-message", async function (messageObj) {
    console.log("got message : ", messageObj);

    receiveMessage(messageObj);
  });
}

function destroyConnection() {
  socket.disconnect();
}

async function privateConnection() {
  socket = io("", { query: { roomId: alertInput } });
  socket.on("get-private-message", async (messageObj) => {
    console.log("got a private message : ", messageObj);
    if (alertInput === messageObj.id) receiveMessage(messageObj);
  });
}

function sendMessage() {
  if (msgBox.value && alertInput === 1) {
    socket.emit("send-message", {
      username: username.value,
      message: msgBox.value,
    });
    msgBox.value = ""; //to clear the message box
  } else if (alertInput >= 2) {
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
  let boldElement = document.createElement("b"); //for name
  boldElement.innerHTML =
    alertInput > 2 ? messageObj.id : messageObj.username + " : ";

  let spanElement = document.createElement("span"); // for message text
  spanElement.innerHTML = messageObj.message;
  pElement.appendChild(boldElement);
  pElement.appendChild(spanElement);
  charArea.appendChild(pElement);
}

// OLD CODE

// let loginForm = document.getElementById("loginForm");
// let loggedIn = false;

// let username = document.getElementById("username");
// let loginButton = document.getElementById("setNameBtn");

// let disconnectBtn = document.getElementById("disconnectBtn");

// let charArea = document.getElementById("charArea");

// let msgBox = document.getElementById("msgBox");
// let sendBtn = document.getElementById("sendBtn");

// function login() {
//   if (!username.value || loggedIn) return;
//   loggedIn = true;
//   loginForm.setAttribute("hidden", true);
//   disconnectBtn.removeAttribute("hidden");
//   charArea.removeAttribute("hidden");
//   msgBox.removeAttribute("hidden");
//   sendBtn.removeAttribute("hidden");
//   createConnection();
// }
// loginButton.onclick = login;

// function logout() {
//   if (!loggedIn) return;

//   loginForm.removeAttribute("hidden");
//   charArea.setAttribute("hidden", true);
//   charArea.innerHTML = "";
//   disconnectBtn.setAttribute("hidden", true);
//   msgBox.setAttribute("hidden", true);
//   sendBtn.setAttribute("hidden", true);
//   loggedIn = false;
//   destroyConnection();
// }
// disconnectBtn.onclick = logout;

// async function createConnection() {
//   socket = io("", { query: { name: username.value } });

//   socket.on("get-message", async function (messageObj) {
//     console.log("got message : ", messageObj);
//     receiveMessage(messageObj);
//   });
// }

// function destroyConnection() {
//   socket.disconnect();
// }

// function sendMessage() {
//   if (msgBox.value) {
//     socket.emit("send-message", {
//       username: username.value,
//       message: msgBox.value,
//     });
//     msgBox.value = ""; //to clear the message box
//   }
// }
// sendBtn.onclick = sendMessage;

// function receiveMessage(messageObj) {
//   let pElement = document.createElement("p");
//   let boldElement = document.createElement("b"); //for name
//   boldElement.innerHTML = messageObj.username + " : ";

//   let spanElement = document.createElement("span"); // for message text
//   spanElement.innerHTML = messageObj.message;
//   pElement.appendChild(boldElement);
//   pElement.appendChild(spanElement);
//   charArea.appendChild(pElement);
// }
