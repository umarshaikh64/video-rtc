import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { store } from "./store";
import { AnyAction, ThunkMiddleware } from "@reduxjs/toolkit";

export const useRTCStore = () => {
  const RTCStore: ToolkitStore<{}, AnyAction, [ThunkMiddleware<{}>]> = store;
  return RTCStore;
};
