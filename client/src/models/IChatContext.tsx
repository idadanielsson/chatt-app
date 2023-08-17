import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { boolean } from "yargs";

export const ChatContext = createContext<IChatContext>({
  username: "",
  isLoggedIn: false,
  initChat: () => {},
  setUsernameFunction: () => {},
  printMessage: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export interface IChatContext {
  username: string;
  isLoggedIn: boolean;
  initChat(): void;
  setUsernameFunction(username: string): void;
  printMessage(data: string): void;
}

const socket = io("http://localhost:3000", { autoConnect: false });

function ChatProvider({ children }: PropsWithChildren<{}>) {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const setUsernameFunction = (username: string) => {
    setUsername(username);
  };

  const printMessage = (data: string) => {};

  const initChat = () => {
    setIsLoggedIn(!isLoggedIn);

    socket.connect();

    socket.emit("user_connected", username);
    console.log(username);
  };

  return (
    <ChatContext.Provider
      value={{
        username,
        isLoggedIn,
        initChat,
        setUsernameFunction,
        printMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
