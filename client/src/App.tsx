import { create } from "domain";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.scss";
import { IChatContext, useChatContext } from "./models/IChatContext";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";

function App() {
  const { isLoggedIn } = useChatContext();
  // const [username, setUsername] = useState("");
  // const socket = io("http://localhost:3000", { autoConnect: false });

  // useEffect(() => {
  //   socket.on("new_user_connected", (username: string) => {
  //     console.log(username);
  //   });
  // }, []);

  // const initChat = () => {
  //   socket.connect();
  //   socket.emit("user_connected", username);
  // };
  return <>{isLoggedIn ? <Chat /> : <Login />}</>;
}

export default App;
