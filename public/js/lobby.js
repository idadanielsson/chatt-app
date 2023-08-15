const socket = io();

const messageList = document.getElementById("messagelist");

socket.on("new-user-connected", (username) => {
  const li = document.createElement("li");
  li.innerText = username + " har anslutit till chatten";
  messageList.appendChild(li);
});
