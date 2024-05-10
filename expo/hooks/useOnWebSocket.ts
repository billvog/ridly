import { useEffect, useRef } from "react";
import { THuntSocketResponse } from "@/types/hunt";
import ReconnectingWebSocket from "reconnecting-websocket";

type WsFn = (e: THuntSocketResponse) => void;

export const useOnWebSocket = (
  socket: ReconnectingWebSocket | undefined,
  fn: WsFn
) => {
  const _fn = useRef<WsFn>(() => {});
  _fn.current = fn;
  useEffect(() => {
    if (!socket) return;

    const callRef = (e: MessageEvent) => _fn.current(JSON.parse(e.data));
    socket.addEventListener("message", callRef);

    return () => {
      socket.removeEventListener("message", callRef);
    };
  }, [socket]);
};
