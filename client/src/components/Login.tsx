import { useChatContext } from "../models/IChatContext";
import "./Login.scss";

export const Login = () => {
  const { setUsernameFunction, username, initChat } = useChatContext();

  return (
    <div className="logincontainer">
      <div className="login">
        <input
          className="login__input"
          placeholder="Användarnamn"
          type="text"
          value={username}
          onChange={(e) => setUsernameFunction(e.target.value)}
        />
        <button
          className="login__btn"
          onClick={() => {
            initChat();
          }}
        >
          Chatta
        </button>
      </div>
    </div>
  );
};
