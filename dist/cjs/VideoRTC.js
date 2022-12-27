"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var events_1 = tslib_1.__importDefault(require("events"));
var socket_io_client_1 = tslib_1.__importDefault(require("socket.io-client"));
var store_1 = require("./store");
var RTCReducer_1 = require("./reducers/RTCReducer");
var VideoRtc_type_1 = require("./types/VideoRtc.type");
var RoomClient_1 = tslib_1.__importDefault(require("./RoomClient"));
var BASEURL = "https://localhost:3010";
var VideoRTC = /** @class */ (function (_super) {
    tslib_1.__extends(VideoRTC, _super);
    function VideoRTC() {
        return _super.call(this) || this;
    }
    VideoRTC.initSdk = function (_a) {
        var appId = _a.appId, secretKey = _a.secretKey;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.socket = (0, socket_io_client_1["default"])(BASEURL, {
                            autoConnect: false,
                            transports: ["websocket"],
                            timeout: 3000
                        });
                        _this.socket.connect();
                        _this.socket.emit("initServer", { appId: appId, secretKey: secretKey }, function (data) {
                            if (data.error) {
                                store_1.store.dispatch((0, RTCReducer_1.initReducer)(false));
                                reject(data.error);
                            }
                            else {
                                store_1.store.dispatch((0, RTCReducer_1.initReducer)(true));
                                resolve(data);
                            }
                        });
                    })];
            });
        });
    };
    VideoRTC.onJoin = function (_a) {
        var roomId = _a.roomId, user = _a.user;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initialize;
            return tslib_1.__generator(this, function (_b) {
                initialize = store_1.store.getState().RTCReducer.initialize;
                if (initialize && this.socket !== null) {
                    console.log(user);
                    this.rc = new RoomClient_1["default"]({
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
            VideoRTC.rc.on(VideoRtc_type_1._EVENTS.localVideoStream, function (data) {
                _this.emit(VideoRtc_type_1._EVENTS.localVideoStream, data);
            });
        }
    };
    VideoRTC.socket = null;
    VideoRTC.rc = null;
    return VideoRTC;
}(events_1["default"]));
exports["default"] = VideoRTC;
//# sourceMappingURL=VideoRTC.js.map