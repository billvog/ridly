import { configureStore } from "@reduxjs/toolkit";
import { SocketReducer } from "@/redux/socket/reducer";

const store = configureStore({
  reducer: {
    socket: SocketReducer,
  },
});

export const Store = store;

export type StoreState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;
