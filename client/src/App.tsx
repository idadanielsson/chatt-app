import { create } from "domain";
import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./App.scss";
import { IChatContext, useChatContext } from "./models/IChatContext";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";

function App() {
  const { isLoggedIn } = useChatContext();

  return <>{isLoggedIn ? <Chat /> : <Login />}</>;
}

export default App;
