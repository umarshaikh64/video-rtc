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

export enum mediaType {
  audio = "audioType",
  video = "videoType",
  camera = "cameraType",
  screen = "screenType",
  speaker = "speakerType",
}

export enum _EVENTS {
  // openRoom= 'openRoom',
  // exitRoom= 'exitRoom',
  // startRec= 'startRec',
  // pauseRec= 'pauseRec',
  // resumeRec= 'resumeRec',
  // stopRec= 'stopRec',
  // raiseHand= 'raiseHand',
  // lowerHand= 'lowerHand',
  // startVideo= 'startVideo',
  // pauseVideo= 'pauseVideo',
  // resumeVideo= 'resumeVideo',
  // stopVideo= 'stopVideo',
  // startAudio= 'startAudio',
  // pauseAudio= 'pauseAudio',
  // resumeAudio= 'resumeAudio',
  // stopAudio= 'stopAudio',
  // startScreen= 'startScreen',
  // pauseScreen= 'pauseScreen',
  // resumeScreen= 'resumeScreen',
  // stopScreen= 'stopScreen',
  // roomLock= 'roomLock',
  // lobbyOn= 'lobbyOn',
  // lobbyOff= 'lobbyOff',
  // roomUnlock= 'roomUnlock',
  localVideoStream = "localVideoStream",
  localAudioStream = "localAudioStream",
  remoteVideo = "remoteVideo",
}

export const LOCAL_STORAGE_DEVICES = {
  audio: {
    count: 0,
    index: 0,
    select: null,
  },
  speaker: {
    count: 0,
    index: 0,
    select: null,
  },
  video: {
    count: 0,
    index: 0,
    select: null,
  },
};

export const DEVICES_COUNT = {
  audio: 0,
  speaker: 0,
  video: 0,
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
