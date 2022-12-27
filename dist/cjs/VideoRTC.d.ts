/// <reference types="node" />
import EventEmitter from "events";
import { Socket } from "socket.io-client";
import { AppConfigure } from "./types/reducerType";
import { RTCJoinType } from "./types/VideoRtc.type";
import RoomClient from "./RoomClient";
interface RTCErrorType {
    message: string;
}
interface RTCSuccessType {
    userId: string;
    message: string;
}
declare class VideoRTC extends EventEmitter {
    static socket: Socket | null;
    static rc: RoomClient | null;
    constructor();
    static initSdk({ appId, secretKey, }: AppConfigure): Promise<RTCSuccessType | RTCErrorType>;
    static onJoin({ roomId, user }: RTCJoinType): Promise<void>;
    handelEventFunction(): void;
}
export default VideoRTC;
