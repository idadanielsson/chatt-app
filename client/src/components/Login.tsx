import { useChatContext } from "../models/IChatContext";
import "./Login.scss";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export const Login = () => {
  const { setUsernameFunction, username, initChat } = useChatContext();

  return (
    <div className="logincontainer">
      <h1>Chattforumet</h1>
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
          <MdOutlineArrowForwardIos></MdOutlineArrowForwardIos>
        </button>
      </div>
    </div>
  );
};
