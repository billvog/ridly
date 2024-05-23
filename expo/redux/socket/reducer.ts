import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { THuntSocketCommand } from "@/types/hunt";

type SentSocketMessage = {
  id: string;
  command: THuntSocketCommand;
  resolved: boolean;
  sent_at: number;
};

type SocketState = {
  sent: SentSocketMessage[];
};

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    sent: [],
  } satisfies SocketState as SocketState,
  reducers: {
    addToSent(state, action: PayloadAction<SentSocketMessage>) {
      return {
        sent: [...state.sent, action.payload],
      };
    },
    resolveMessage(state, action: PayloadAction<Pick<SentSocketMessage, "id">>) {
      return { sent: state.sent.filter((v) => v.id !== action.payload.id) };
    },
  },
});

export const SocketActions = socketSlice.actions;

export const SocketReducer = socketSlice.reducer;
