import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { IMessage } from "./IMessage";

export const ChatContext = createContext<IChatContext>({
  username: "",
  isLoggedIn: false,
  messages: [],
  connectedUsers: [],
  inputValue: "",
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
  inputValue: string;
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
  const [inputValue, setInputValue] = useState("");

  const setUsernameFunction = (username: string) => {
    setUsername(username);
  };

  // console.log(newMessage);
  const setNewMessageFunction = (newMessage: string) => {
    setInputValue(newMessage);
  };

  const printMessage = (data: string) => {
    setMessages([...messages, data]);
  };

  const sendMessage = () => {
    const messageForServer: IMessage = {
      username,
      message: inputValue,
    };

    socket.emit("new_message", messageForServer);
  };

  socket.on("new-user-connected", (username) => {
    printMessage(`${username} har anslutit till chatten`);
    setConnectedUsers((prevUsers) => [...prevUsers, username]);
  });

  socket.on("new-message-sent", (messageFromServer: IMessage) => {
    printMessage(`${messageFromServer.username}: ${messageFromServer.message}`);
  });

  const initChat = () => {
    setIsLoggedIn(!isLoggedIn);

    socket.connect();

    socket.emit("user_connected", username);
    console.log(username);

    // socket.on("new-user-connected", (username) => {
    //   printMessage(`${username} har anslutit till chatten`);
    //   setConnectedUsers((prevUsers) => [...prevUsers, username]);
    // });

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
        inputValue,
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
