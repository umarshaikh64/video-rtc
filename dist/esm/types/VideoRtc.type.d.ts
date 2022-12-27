import { Socket } from "socket.io-client";
export interface User {
    name: string;
    email?: string;
    isHost?: boolean;
    userType: "Admin" | "user";
}
export interface RTCJoinType {
    roomId: string;
    user: User;
}
export declare enum mediaType {
    audio = "audioType",
    video = "videoType",
    camera = "cameraType",
    screen = "screenType",
    speaker = "speakerType"
}
export declare enum _EVENTS {
    localVideoStream = "localVideoStream",
    localAudioStream = "localAudioStream",
    remoteVideo = "remoteVideo"
}
export declare const LOCAL_STORAGE_DEVICES: {
    audio: {
        count: number;
        index: number;
        select: null;
    };
    speaker: {
        count: number;
        index: number;
        select: null;
    };
    video: {
        count: number;
        index: number;
        select: null;
    };
};
export declare const DEVICES_COUNT: {
    audio: number;
    speaker: number;
    video: number;
};
export interface RoomClientProps {
    socket: Socket | null;
    room_id: string;
    successCallback: () => void;
    isAudioAllowed: boolean;
    isVideoAllowed: boolean;
    peer_name: string;
}
export interface RTCStreamProps {
    id: string;
    stream: MediaStream;
    type: mediaType;
}
export interface RemoteVideoViewsProps {
    stream: MediaStream;
    id: string;
    name: string;
    type: mediaType;
}
