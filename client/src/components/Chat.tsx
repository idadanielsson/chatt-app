import { useChatContext } from "../models/IChatContext";

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
  } = useChatContext();
  const { connectedUsers } = useChatContext();

  return (
    <div>
      {/* <h2>Connected Users:</h2>
      <ul>
        {connectedUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul> */}
      <h2>Chat Messages:</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <h1>Skicka meddelande:</h1>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setNewMessageFunction(e.target.value)}
        />
        <button>Skicka</button>
      </form>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          joinRoomFunction(room);
        }}
      >
        <h2>Skapa rum:</h2>
        <input type="text" onChange={(e) => setRoomFunction(e.target.value)} />
        <button>Skapa rum</button>
      </form>
    </div>
  );
}
