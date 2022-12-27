import { createSlice } from "@reduxjs/toolkit";
import { RTCReducerType } from "../types/reducerType";
const initialState: RTCReducerType = {
  configure: {
    appId: "",
    secretKey: "",
  },
  initialize: false,
};
export const RTCReducer = createSlice({
  name: "RTCReducer",
  initialState: initialState,
  reducers: {
    initReducer: (state: RTCReducerType, action) => {
      state.initialize = action.payload;
    },
  },
});

export const { initReducer }: any = RTCReducer.actions;
