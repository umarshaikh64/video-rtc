import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { AnyAction, ThunkMiddleware } from "@reduxjs/toolkit";
export declare const useRTCStore: () => ToolkitStore<{}, AnyAction, [ThunkMiddleware<{}, AnyAction, undefined>]>;
