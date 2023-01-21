import { configureStore } from "@reduxjs/toolkit";
import geoReducer from "./slices/geoSlice";

export const Store = configureStore({
  reducer: {
    geo:geoReducer,
  },
});
