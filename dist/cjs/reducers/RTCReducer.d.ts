import { RTCReducerType } from "../types/reducerType";
export declare const RTCReducer: import("@reduxjs/toolkit").Slice<RTCReducerType, {
    initReducer: (state: RTCReducerType, action: {
        payload: any;
        type: string;
    }) => void;
}, "RTCReducer">;
export declare const initReducer: any;
