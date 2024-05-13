import { createSlice } from "@reduxjs/toolkit";
import { LatLng } from "react-native-maps";

type LocationState = LatLng;

const locationSlice = createSlice({
  name: "location",
  initialState: {
    latitude: 0,
    longitude: 0,
  } satisfies LocationState as LocationState,
  reducers: {
    setLocation(state, action) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const LocationActions = locationSlice.actions;

export const LocationReducer = locationSlice.reducer;
