import { useStoreDispatch, useStoreSelector } from "@/redux/hooks";
import { SocketActions } from "@/redux/socket/reducer";
import { THuntSocketCommand } from "@/types/hunt";
import { getAccessToken } from "@/utils/authTokens";
import { randomUUID } from "expo-crypto";
import { useCallback, useEffect, useMemo } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const BASE_SOCKET_URL = "ws://localhost:8000/ws";

type SocketType = ReconnectingWebSocket | null;

export type SocketSendFunction<TCommand = string> = (
  command: TCommand,
  payload: any
) => string | null;

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

  // Be sure to close the socket when the component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  const socketState = useStoreSelector((state) => state.socket);
  const dispatch = useStoreDispatch();

  const send = useCallback<SocketSendFunction<THuntSocketCommand>>(
    (command, payload) => {
      if (!socket) {
        console.log("socket is not connected. aborting send.", socket);
        return null;
      }

      // Don't send duplicate messages
      const isDuplicate =
        typeof socketState.sent.find((v) => v.command == command && !v.resolved) !==
        "undefined";
      if (isDuplicate) {
        console.log("This is duplicate, not sending", command, socketState.sent);
        return null;
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

      return id;
    },
    [socket, socketState]
  );

  return { socket, send };
}
