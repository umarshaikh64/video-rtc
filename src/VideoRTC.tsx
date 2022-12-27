import EventEmitter from "events";
import io, { Socket } from "socket.io-client";
import { AppConfigure } from "./types/reducerType";
import { store } from "./store";
import { initReducer } from "./reducers/RTCReducer";
import { RTCJoinType, _EVENTS } from "./types/VideoRtc.type";
import RoomClient from "./RoomClient";

const BASEURL = "https://localhost:3010";

interface RTCErrorType {
  message: string;
}
interface RTCSuccessType {
  userId: string;
  message: string;
}

class VideoRTC extends EventEmitter {
  static socket: Socket | null = null;
  static rc: RoomClient | null = null;
  constructor() {
    super();
  }

  static async initSdk({
    appId,
    secretKey,
  }: AppConfigure): Promise<RTCSuccessType | RTCErrorType> {
    return new Promise(
      (
        resolve: (value: RTCSuccessType) => void,
        reject: (value: RTCErrorType) => void
      ) => {
        this.socket = io(BASEURL, {
          autoConnect: false,
          transports: ["websocket"],
          timeout: 3000,
        });
        this.socket.connect();
        this.socket.emit("initServer", { appId, secretKey }, (data: any) => {
          if (data.error) {
            store.dispatch(initReducer(false));
            reject(data.error);
          } else {
            store.dispatch(initReducer(true));
            resolve(data);
          }
        });
      }
    );
  }

  static async onJoin({ roomId, user }: RTCJoinType): Promise<void> {
    const initialize = store.getState().RTCReducer.initialize;
    if (initialize && this.socket !== null) {
      console.log(user);
      this.rc = new RoomClient({
        socket: this.socket,
        room_id: roomId,
        peer_name: "Umar",
        isAudioAllowed: true,
        isVideoAllowed: true,
        successCallback: () => {
          console.log("user Connected");
          new VideoRTC().handelEventFunction();
        },
      });
    } else {
      throw Error("Video Rtc Sdk is not initialize");
    }
  }
  handelEventFunction() {
    if (VideoRTC.rc !== null) {
      VideoRTC.rc.on(_EVENTS.localVideoStream, (data: any) => {
        this.emit(_EVENTS.localVideoStream, data);
      });
    }
  }
}

export default VideoRTC;
