import { create } from "domain";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.scss";
import { IChatContext } from "./models/IChatContext";

export const ChatContext = createContext<IChatContext>({});

function App() {
  const [username, setUsername] = useState("");
  const socket = io("http://localhost:3000", { autoConnect: false });

  useEffect(() => {
    socket.on("new_user_connected", (username: string) => {
      console.log(username);
    });
  }, []);

  const initChat = () => {
    socket.connect();
    socket.emit("user_connected", username);
  };
  return (
    <>
      <input type="text" />
      <button>Börja chatta</button>
    </>
  );
}

export default App;
