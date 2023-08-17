import { create } from "domain";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.scss";
import { IChatContext, useChatContext } from "./models/IChatContext";

function App() {
  const { username } = useChatContext();
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
  return <></>;
}

export default App;
