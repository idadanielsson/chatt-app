import { useChatContext } from "../models/IChatContext";

export function Chat() {
  const { username } = useChatContext();
  return (
    <>
      <p>{username} har anslutit till chatten</p>
    </>
  );
}
