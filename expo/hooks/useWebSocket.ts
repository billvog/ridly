import { SocketActions } from "@/redux/socket/reducer";
import { THuntSocketCommand } from "@/types/hunt";
import { getAccessToken } from "@/utils/authTokens";
import { randomUUID } from "expo-crypto";
import { useCallback, useMemo } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useStoreDispatch, useStoreSelector } from "../redux/hooks";

const BASE_SOCKET_URL = "ws://localhost:8000/ws";

type SocketType = ReconnectingWebSocket | null;

function constructWebSocketUrl(path: string) {
  return `${BASE_SOCKET_URL}${path}/?accessToken=${getAccessToken()}`;
}

export function useWebSocket(path: string | null) {
  const socket = useMemo<SocketType>(() => {
    if (!path) {
      return null;
    }

    const url = constructWebSocketUrl(path);
    return new ReconnectingWebSocket(url);
  }, [path]);

  const socketState = useStoreSelector((state) => state.socket);
  const dispatch = useStoreDispatch();

  const send = useCallback(
    (command: THuntSocketCommand, payload: any) => {
      if (!socket) {
        console.log("socket is not connected. aborting send.", socket);
        return;
      }

      // Don't send duplicate messages
      const isDuplicate =
        typeof socketState.sent.find((v) => v.command == command) !== "undefined";
      if (isDuplicate) {
        console.log("This is duplicate, not sending", command, socketState.sent);
        return;
      }

      const id = randomUUID();
      const request = [command, id, payload];

      console.log("Sending", request);

      // Store it in state
      dispatch(
        SocketActions.addToSent({
          id,
          command,
          resolved: false,
          sent_at: Date.now(),
        })
      );

      // Send it to socket
      socket.send(JSON.stringify(request));
    },
    [socket, socketState]
  );

  return { socket, send };
}
