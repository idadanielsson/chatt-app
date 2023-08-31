import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { IMessage } from "./IMessage";

export const ChatContext = createContext<IChatContext>({
  username: "",
  isLoggedIn: false,
  chatRooms: [],
  messages: [],
  inputValue: "",
  room: "",
  isTyping: false,
  userTyping: "",
  initChat: () => {},
  setUsernameFunction: () => {},
  setNewMessageFunction: () => {},
  sendMessage: () => {},
  setRoomFunction: () => {},
  joinRoomFunction: () => {},
  setInputValueFunction: () => {},
});

export const useChatContext = () => useContext(ChatContext);

export interface IChatContext {
  username: string;
  isLoggedIn: boolean;
  messages: string[];
  inputValue: string;
  room: string;
  chatRooms: string[];
  isTyping: boolean;
  userTyping: string;
  initChat(): void;
  setUsernameFunction(username: string): void;
  setNewMessageFunction(newMessage: string): void;
  sendMessage(): void;
  setRoomFunction(room: string): void;
  joinRoomFunction(room: string): void;
  setInputValueFunction(inputValue: string): void;
}

const socket = io("http://localhost:3000", { autoConnect: false });

function ChatProvider({ children }: PropsWithChildren<{}>) {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatRooms, setChatRooms] = useState<string[]>([]);
  const [isTyping, setIstyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");

  const setInputValueFunction = (inputValue: string) => {
    setInputValue(inputValue);
  };

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

    socket.emit("new_message", messageForServer, currentRoom);
  };

  useEffect(() => {
    socket.emit("isTyping", {
      username,
      isTyping: !!inputValue,
      room: currentRoom,
    });
  }, [inputValue]);

  useEffect(() => {
    const printMessage = (data: string) => {
      setMessages((messages) => [...messages, data]);
    };

    socket.on("user_typing", ({ username, isTyping }) => {
      setIstyping(isTyping);
      console.log(isTyping);
      console.log(username);

      setUserTyping(username);
    });

    socket.on("new-user-connected", (username: string) => {
      printMessage(`${username} har anslutit till chatten`);
    });

    socket.on("active_rooms", (roomsList) => {
      setChatRooms(Object.keys(roomsList));
    });

    socket.on("new-message-sent", (messageFromServer: IMessage) => {
      printMessage(
        `${messageFromServer.username}: ${messageFromServer.message}`
      );
    });
    socket.on("set_current_room", (room: string) => {
      setCurrentRoom(room);
    });
  }, []);

  const joinRoomFunction = (room: string) => {
    setMessages([]);
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
        userTyping,
        isTyping,
        chatRooms,
        room,
        username,
        isLoggedIn,
        messages,
        inputValue,
        setInputValueFunction,
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
