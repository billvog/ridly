import { configureStore } from "@reduxjs/toolkit";
import { LocationReducer } from "@/redux/location/reducer";

const store = configureStore({
  reducer: {
    location: LocationReducer,
  },
});

export const LocationStore = store;

export type LocationStoreState = ReturnType<typeof store.getState>;
