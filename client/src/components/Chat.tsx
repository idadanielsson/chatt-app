import { useChatContext } from "../models/IChatContext";
import "./Chat.scss";
import { AiOutlineSend } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";

// Chat component
export function Chat() {
  const {
    messages,
    inputValue,
    sendMessage,
    setNewMessageFunction,
    setInputValueFunction,
    room,
    setRoomFunction,
    joinRoomFunction,
    chatRooms,
    isTyping,
    userTyping,
  } = useChatContext();

  let typing = isTyping ? <p>{userTyping} skriver ett meddelande</p> : <p></p>;

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
            <div className="create-room">
              <input
                type="text"
                onChange={(e) => setRoomFunction(e.target.value)}
              />
              <button>
                <IoIosAddCircle></IoIosAddCircle>
              </button>
            </div>
          </form>
        </div>
        <div className="room">
          {chatRooms.map((room, index) => (
            <button
              onClick={() => {
                joinRoomFunction(room);
              }}
              key={index}
              className="room__btn"
            >
              {room}
            </button>
          ))}
        </div>
      </div>
      <div className="chat__chat">
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
            setInputValueFunction("");
          }}
        >
          {typing}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setNewMessageFunction(e.target.value)}
            placeholder="Meddelande"
          />
          <button>
            <AiOutlineSend></AiOutlineSend>
          </button>
        </form>
      </div>
    </div>
  );
}
