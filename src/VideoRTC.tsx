import EventEmitter from "events";
import io, { Socket } from "socket.io-client";
import { AppConfigure } from "./types/reducerType";
import { store } from "./store";
import { initReducer } from "./reducers/RTCReducer";

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

  static async onJoin({ roomName }: any): Promise<any> {
    console.log("new Appp", roomName);
    const initialize = store.getState().RTCReducer.initialize;
    console.log(initialize);
  }
}

export default VideoRTC;
