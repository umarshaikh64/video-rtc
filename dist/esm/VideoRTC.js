import { __awaiter, __extends, __generator } from "tslib";
import EventEmitter from "events";
import io from "socket.io-client";
import { store } from "./store";
import { initReducer } from "./reducers/RTCReducer";
import { _EVENTS } from "./types/VideoRtc.type";
import RoomClient from "./RoomClient";
var BASEURL = "https://localhost:3010";
var VideoRTC = /** @class */ (function (_super) {
    __extends(VideoRTC, _super);
    function VideoRTC() {
        return _super.call(this) || this;
    }
    VideoRTC.initSdk = function (_a) {
        var appId = _a.appId, secretKey = _a.secretKey;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.socket = io(BASEURL, {
                            autoConnect: false,
                            transports: ["websocket"],
                            timeout: 3000
                        });
                        _this.socket.connect();
                        _this.socket.emit("initServer", { appId: appId, secretKey: secretKey }, function (data) {
                            if (data.error) {
                                store.dispatch(initReducer(false));
                                reject(data.error);
                            }
                            else {
                                store.dispatch(initReducer(true));
                                resolve(data);
                            }
                        });
                    })];
            });
        });
    };
    VideoRTC.onJoin = function (_a) {
        var roomId = _a.roomId, user = _a.user;
        return __awaiter(this, void 0, void 0, function () {
            var initialize;
            return __generator(this, function (_b) {
                initialize = store.getState().RTCReducer.initialize;
                if (initialize && this.socket !== null) {
                    console.log(user);
                    this.rc = new RoomClient({
                        socket: this.socket,
                        room_id: roomId,
                        peer_name: "Umar",
                        isAudioAllowed: true,
                        isVideoAllowed: true,
                        successCallback: function () {
                            console.log("user Connected");
                            new VideoRTC().handelEventFunction();
                        }
                    });
                }
                else {
                    throw Error("Video Rtc Sdk is not initialize");
                }
                return [2 /*return*/];
            });
        });
    };
    VideoRTC.prototype.handelEventFunction = function () {
        var _this = this;
        if (VideoRTC.rc !== null) {
            VideoRTC.rc.on(_EVENTS.localVideoStream, function (data) {
                _this.emit(_EVENTS.localVideoStream, data);
            });
        }
    };
    VideoRTC.socket = null;
    VideoRTC.rc = null;
    return VideoRTC;
}(EventEmitter));
export default VideoRTC;
//# sourceMappingURL=VideoRTC.js.map