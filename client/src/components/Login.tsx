import { useChatContext } from "../models/IChatContext";

export const Login = () => {
  const { setUsernameFunction, username, initChat } = useChatContext();

  return (
    <>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsernameFunction(e.target.value)}
      />
      <button
        onClick={() => {
          initChat();
        }}
      >
        Börja chatta
      </button>
    </>
  );
};
