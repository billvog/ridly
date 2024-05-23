import { useCallback, useEffect, useState } from "react";
import { SocketSendFunction } from "@/hooks/useWebSocket";
import { Store } from "@/redux/store";

type SocketSendHookFunction = (payload: any) => ReturnType<SocketSendFunction>;

export function useSocketSend<TCommand>(
  command: TCommand,
  sendFn: SocketSendFunction<TCommand>
) {
  const [sentId, setSentId] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Wrap the send function to set the loading state
  const send = useCallback<SocketSendHookFunction>(
    (payload) => {
      setLoading(true);
      const id = sendFn(command, payload);
      if (id) {
        setSentId(id);
      }

      return id;
    },
    [sendFn]
  );

  // Monitor the sent messages for the one we're waiting for
  // and update the loading state when it's resolved
  useEffect(() => {
    if (!loading || !sentId) {
      return;
    }

    const unsubscribe = Store.subscribe(() => {
      const state = Store.getState().socket;

      const message = state.sent.find((v) => v.id === sentId);
      if (!message) {
        return;
      }

      if (message.resolved) {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loading, sentId]);

  return { send, loading };
}
