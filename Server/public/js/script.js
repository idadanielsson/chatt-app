const socket = io({ autoConnect: false });

const login = document.getElementById("login");
const loginBtn = document.getElementById("login__btn");
const messageList = document.getElementById("messagelist");
const chatForm = document.getElementById("chat__form");

socket.on("message", (message) => {
  console.log(message);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

const initChat = () => {
  socket.connect();

  const username = document.getElementById("login__input").value;
  socket.emit("user_connected", username);

  socket.on("new-user-connected", (username) => {
    const li = document.createElement("li");
    li.innerText = username + " har anslutit till chatten";
    messageList.appendChild(li);
  });

  window.location = "http://localhost:3000/lobby.html";
};

loginBtn.addEventListener("click", initChat);
