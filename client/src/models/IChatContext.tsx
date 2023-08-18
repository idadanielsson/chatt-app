import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

export const ChatContext = createContext<IChatContext>({
  username: "",
  isLoggedIn: false,
  messages: [],
  connectedUsers: [],
  newMessage: "",
  initChat: () => {},
  setUsernameFunction: () => {},
  printMessage: () => {},
  setNewMessageFunction: () => {},
  sendMessage: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export interface IChatContext {
  username: string;
  isLoggedIn: boolean;
  messages: string[];
  connectedUsers: string[];
  newMessage: string;
  initChat(): void;
  setUsernameFunction(username: string): void;
  printMessage(data: string): void;
  setNewMessageFunction(newMessage: string): void;
  sendMessage(): void;
}

const socket = io("http://localhost:3000", { autoConnect: false });

function ChatProvider({ children }: PropsWithChildren<{}>) {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const setUsernameFunction = (username: string) => {
    setUsername(username);
  };

  console.log(newMessage);
  const setNewMessageFunction = (newMessage: string) => {
    setNewMessage(newMessage);
  };

  const printMessage = (data: string) => {
    // let copy = [...messages, data];
    // setMessages(copy);
    setMessages((messages) => [...messages, data]);
  };

  const sendMessage = () => {
    socket.emit("new_message", newMessage);

    socket.on("new-message-sent", (newMessage) => {
      printMessage(newMessage);
    });
  };

  const initChat = () => {
    setIsLoggedIn(!isLoggedIn);

    socket.connect();

    socket.emit("user_connected", username);
    console.log(username);

    socket.on("new-user-connected", (username) => {
      printMessage(`${username} har anslutit till chatten`);
      setConnectedUsers((prevUsers) => [...prevUsers, username]);
    });
    console.log(newMessage);

    socket.on("disconnect", (disconnectedUsername) => {
      setConnectedUsers((prevUsers) =>
        prevUsers.filter((username) => username !== disconnectedUsername)
      );
    });
  };

  return (
    <ChatContext.Provider
      value={{
        username,
        isLoggedIn,
        messages,
        connectedUsers,
        newMessage,
        initChat,
        setUsernameFunction,
        printMessage,
        setNewMessageFunction,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
