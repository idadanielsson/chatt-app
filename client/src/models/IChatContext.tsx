import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { IMessage } from "./IMessage";

export const ChatContext = createContext<IChatContext>({
  username: "",
  isLoggedIn: false,
  chatRooms: [],
  messages: [],
  connectedUsers: [],
  inputValue: "",
  room: "",
  initChat: () => {},
  setUsernameFunction: () => {},
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
  chatRooms: string[];
  initChat(): void;
  setUsernameFunction(username: string): void;
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
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatRooms, setChatRooms] = useState<string[]>([]);

  const setUsernameFunction = (username: string) => {
    setUsername(username);
  };

  const setRoomFunction = (room: string) => {
    setRoom(room);
  };

  const setNewMessageFunction = (newMessage: string) => {
    setInputValue(newMessage);
  };

  const sendMessage = () => {
    const messageForServer: IMessage = {
      username,
      message: inputValue,
    };

    socket.emit("new_message", messageForServer);
  };

  useEffect(() => {
    const printMessage = (data: string) => {
      setMessages((messages) => [...messages, data]);
    };

    socket.on("new-user-connected", (username: string) => {
      printMessage(`${username} har anslutit till chatten`);
    });

    socket.on("active_rooms", (roomsList) => {
      console.log(roomsList);

      let list = [];

      for (const [room] of Object.entries(roomsList)) {
        list.push(room);
      }

      setChatRooms(list);
    });

    socket.on("new-message-sent", (messageFromServer: IMessage) => {
      printMessage(
        `${messageFromServer.username}: ${messageFromServer.message}`
      );
    });
    socket.on("set_current_room", (room: string) => {
      setCurrentRoom(room);
    });

    socket.on("disconnect", (disconnectedUsername) => {
      setConnectedUsers((prevUsers) =>
        prevUsers.filter((username) => username !== disconnectedUsername)
      );
    });
  }, []);

  const joinRoomFunction = (room: string) => {
    if (room) {
      socket.emit("join_room", room, currentRoom);
    }
  };

  const initChat = () => {
    setIsLoggedIn(!isLoggedIn);

    socket.connect();

    socket.emit("user_connected", username);
    setCurrentRoom("lobby");
    joinRoomFunction("lobby");
  };

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        room,
        username,
        isLoggedIn,
        messages,
        connectedUsers,
        inputValue,
        initChat,
        setUsernameFunction,
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
