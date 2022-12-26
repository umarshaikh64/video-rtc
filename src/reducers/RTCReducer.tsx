import { createSlice } from "@reduxjs/toolkit";
const initialState: any = {};
export const RTCReducer = createSlice({
  name: "RTCReducer",
  initialState: initialState,
  reducers: {
    initReducer: (state, action) => {
      console.log(state);
      console.log(action.payload);
    },
  },
});

export const { initReducer }: any = RTCReducer.actions;
