/// <reference types="node" />
import EventEmitter from "events";
import { Socket } from "socket.io-client";
import { AppConfigure } from "./types/reducerType";
interface RTCErrorType {
    message: string;
}
interface RTCSuccessType {
    userId: string;
    message: string;
}
declare class VideoRTC extends EventEmitter {
    static socket: Socket | null;
    constructor();
    static initSdk({ appId, secretKey, }: AppConfigure): Promise<RTCSuccessType | RTCErrorType>;
    static onJoin({ roomName }: any): Promise<any>;
}
export default VideoRTC;
