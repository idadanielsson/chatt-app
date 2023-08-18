import { useChatContext } from "../models/IChatContext";

// Chat component
export function Chat() {
  const { messages, newMessage, sendMessage, setNewMessageFunction } =
    useChatContext();
  const { connectedUsers } = useChatContext();

  console.log(messages);

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
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessageFunction(e.target.value)}
        />
        <button>Skicka</button>
      </form>
    </div>
  );
}
