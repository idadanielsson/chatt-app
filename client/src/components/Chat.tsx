import { useChatContext } from "../models/IChatContext";
import "./Chat.scss";
import { AiOutlineSend } from "react-icons/ai";

// Chat component
export function Chat() {
  const {
    messages,
    inputValue,
    sendMessage,
    setNewMessageFunction,
    room,
    setRoomFunction,
    joinRoomFunction,
    chatRooms,
  } = useChatContext();
  const { connectedUsers } = useChatContext();

  return (
    <div className="chat">
      <div className="chat__rooms">
        <div className="chat__createroom">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              joinRoomFunction(room);
            }}
          >
            <h2>Skapa rum:</h2>
            <input
              type="text"
              onChange={(e) => setRoomFunction(e.target.value)}
            />
            <button>Skapa rum</button>
          </form>
        </div>
        {chatRooms.map((room, index) => (
          <button
            onClick={() => {
              joinRoomFunction(room);
            }}
            key={index}
          >
            {room}
          </button>
        ))}
      </div>
      <div className="chat__chat">
        {/* <h2>Connected Users:</h2>
      <ul>
        {connectedUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul> */}
        <div className="messages">
          <ul className="messages__list">
            {messages.map((message, index) => (
              <li key={index} className="messages__item">
                {message}
              </li>
            ))}
          </ul>
        </div>

        <form
          className="chatmessages"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setNewMessageFunction(e.target.value)}
          />
          <button>
            <AiOutlineSend></AiOutlineSend>
          </button>
        </form>
      </div>
    </div>
  );
}
