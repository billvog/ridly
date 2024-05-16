import ReconnectingWebSocket from "reconnecting-websocket";
import { getAccessToken } from "@/utils/authTokens";

const BASE_SOCKET_URL = "ws://localhost:8000/ws";

let socket: ReconnectingWebSocket | null = null;

function constructWebSocketUrl(path: string) {
  return `${BASE_SOCKET_URL}${path}/?accessToken=${getAccessToken()}`;
}

export function getWebSocket() {
  return socket;
}

export function useWebSocket(path: string | null) {
  if (!path) {
    return null;
  }

  const url = constructWebSocketUrl(path);

  if (socket) {
    if (socket.url !== url) {
      socket.close();
      socket = null;
    }
  }

  socket = socket ? socket : new ReconnectingWebSocket(url);
  if (socket.readyState === socket.CLOSED) {
    socket.reconnect();
  }

  return socket;
}
