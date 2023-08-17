import { Socket } from "socket.io-client";

export interface IChatContext {
  username: string;
  socket: Socket;
}
