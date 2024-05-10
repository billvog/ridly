import ReconnectingWebSocket from "reconnecting-websocket";
import { getAccessToken } from "@/utils/authTokens";

let socket: ReconnectingWebSocket | null = null;

export function useWebSocket(huntId?: string) {
  if (!huntId) {
    return;
  }

  if (socket) {
    return socket;
  }

  let url = `ws://localhost:8000/ws/hunt/${huntId}/?accessToken=${getAccessToken()}`;
  socket = new ReconnectingWebSocket(url);

  return socket;
}
