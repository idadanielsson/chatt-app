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
  room: "",
  initChat: () => {},
  setUsernameFunction: () => {},
  printMessage: () => {},
  setNewMessageFunction: () => {},
  sendMessage: () => {},
  setRoomFunction: () => {},
  joinRoomFunction: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export interface IChatContext {
  username: string;
  isLoggedIn: boolean;
  messages: string[];
  connectedUsers: string[];
  inputValue: string;
  room: string;
  initChat(): void;
  setUsernameFunction(username: string): void;
  printMessage(data: string): void;
  setNewMessageFunction(newMessage: string): void;
  sendMessage(): void;
  setRoomFunction(room: string): void;
  joinRoomFunction(room: string): void;
}

const socket = io("http://localhost:3000", { autoConnect: false });

function ChatProvider({ children }: PropsWithChildren<{}>) {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [room, setRoom] = useState("");

  const setUsernameFunction = (username: string) => {
    setUsername(username);
  };

  const setRoomFunction = (room: string) => {
    setRoom(room);
  };

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

  socket.on("active_rooms", (activeRooms) => {
    console.log(activeRooms);
  });

  const joinRoomFunction = (room: string) => {
    if (room) {
      socket.emit("join_room", room);
    }
  };

  const initChat = () => {
    setIsLoggedIn(!isLoggedIn);

    socket.connect();

    socket.emit("user_connected", username);
    joinRoomFunction("lobby");

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
        room,
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
        setRoomFunction,
        joinRoomFunction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
