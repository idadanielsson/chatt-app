import { createContext, PropsWithChildren, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

export const ChatContext = createContext<IChatContext>({ username: "" });
export const useChatContext = () => useContext(ChatContext);
export interface IChatContext {
  username: string;
}

const socket = io("http://localhost:3000", { autoConnect: false });

function ChatProvider({ children }: PropsWithChildren<{}>) {
  const [username, setUsername] = useState("");
  return (
    <ChatContext.Provider value={{ username }}>{children}</ChatContext.Provider>
  );
}

export default ChatProvider;
