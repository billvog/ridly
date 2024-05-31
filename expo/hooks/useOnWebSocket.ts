import { useStoreSelector } from "@/redux/hooks";
import { SocketActions } from "@/redux/socket/reducer";
import { TSocketResponse, TSocketResult } from "@/types/socket";
import { useEffect, useRef } from "react";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import ReconnectingWebSocket from "reconnecting-websocket";
import { socketErrorToMessage } from "../utils/socketErrorToMessage";

type WsFn<TResponse> = (e: TResponse) => void;

export const useOnWebSocket = <TResult = TSocketResult>(
  socket: ReconnectingWebSocket | null,
  handleMessage: WsFn<TResult>
) => {
  const dispatch = useDispatch();
  const socketState = useStoreSelector((state) => state.socket);

  const handleMessageRef = useRef<WsFn<TSocketResponse>>(() => {});
  handleMessageRef.current = (response) => {
    const status = response[0];
    const id = response[1];

    const sentMessage = socketState.sent.find((v) => v.id == id);
    if (!sentMessage) {
      console.error("Failed to find received message in sent", response, socketState);
      return;
    }

    // Resolve message from state
    // console.log("Received", sentMessage, response);
    dispatch(SocketActions.resolveMessage({ id: sentMessage.id }));

    // On error, show a toast
    if (status === "error") {
      const errorMessage = socketErrorToMessage(response[2].code);

      Toast.show({
        type: "error",
        text1: "Error!",
        text1Style: { fontWeight: "bold", fontSize: 16 },
        text2: errorMessage,
        text2Style: { fontSize: 12 },
      });

      return;
    }

    const command = sentMessage.command;
    const result: TSocketResult = { command, payload: response[2] };

    handleMessage(result as TResult);
  };

  useEffect(() => {
    if (!socket) return;

    const callRef = (e: MessageEvent) => handleMessageRef.current(JSON.parse(e.data));
    socket.addEventListener("message", callRef);

    return () => {
      socket.removeEventListener("message", callRef);
    };
  }, [socket, socketState]);
};
