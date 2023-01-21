import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
};

export const geoSlice = createSlice({
  name: "geo",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInformation } =
  geoSlice.actions;

export const selectOrigin = (state) => state.geo.origin;
export const selectDestination = (state) => state.geo.destination;
export const selectTravelTimeInformation = (state) =>
  state.geo.travelTimeInformation;

export default geoSlice.reducer;
