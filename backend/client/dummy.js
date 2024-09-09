// socket.emit("join_room", alertInput);
// let alertInput = getRoomID(
//   +prompt("Enter '1' for Public Chat or Enter your friends number ")
// );
// async function getRoomID(dialNum) {
//   try {
//     const response = await fetch("/getRoom", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ dialNum }), // Assuming dialNum needs to be sent as JSON
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     console.log(value);
//     return data;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

//
//
//
//
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
