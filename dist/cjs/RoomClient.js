"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var types_1 = require("mediasoup-client/lib/types");
var VideoRtc_type_1 = require("./types/VideoRtc.type");
var VideoRtc_helper_1 = require("./VideoRtc.helper");
var RoomClient = /** @class */ (function () {
    // get getRoomId(): string {
    //   return RoomClient.roomId;
    // }
    // set setRoomId(value: string) {
    //   RoomClient.roomId = value;
    // }
    function RoomClient(_a) {
        var socket = _a.socket, room_id = _a.room_id, isAudioAllowed = _a.isAudioAllowed, isVideoAllowed = _a.isVideoAllowed, peer_name = _a.peer_name, successCallback = _a.successCallback;
        var _this = this;
        this.producerTransport = null;
        this.consumerTransport = null;
        this._isConnected = false;
        this.isAudioAllowed = false;
        this.isVideoAllowed = false;
        this.camVideo = false;
        this.camera = "user";
        this.peer_name = "";
        // peer_info:any|null =null;
        this.participantsCount = 0;
        this.producer = null;
        this.socket = socket;
        this.isAudioAllowed = isAudioAllowed;
        this.isVideoAllowed = isVideoAllowed;
        // this.setRoomId = room_id;
        this.consumers = new Map();
        this.producers = new Map();
        this.producerLabel = new Map();
        this.eventListeners = new Map();
        this.peer_name = peer_name;
        this.peer_id = socket.id;
        Object.keys(VideoRtc_type_1._EVENTS).forEach(function (evt) {
            _this.eventListeners.set(evt, []);
        });
        this.socket.request = function request(type, data) {
            if (data === void 0) { data = {}; }
            return new Promise(function (resolve, reject) {
                socket.emit(type, data, function (data) {
                    if (data.error) {
                        reject(data.error);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        };
        this.createRoom(room_id).then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            room_id: room_id,
                            peer_info: {
                                peer_id: socket.id,
                                peer_name: peer_name,
                                peer_audio: isAudioAllowed,
                                peer_video: isVideoAllowed
                            },
                            peer_geo: "this.peer_geo"
                        };
                        return [4 /*yield*/, this.join(data)];
                    case 1:
                        _a.sent();
                        this.initSockets();
                        this._isConnected = true;
                        successCallback();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    // static get EVENTS() {
    //   return _EVENTS;
    // }
    RoomClient.prototype.createRoom = function (room_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socket
                            .request("createRoom", {
                            room_id: room_id
                        })["catch"](function (err) {
                            console.log("Create room error:", err);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomClient.prototype.join = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.socket
                    .request("join", data)
                    .then(function (room) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.joinAllowed(room)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (err) {
                    console.log("Join error:", err);
                });
                return [2 /*return*/];
            });
        });
    };
    RoomClient.prototype.joinAllowed = function (room) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("07 ----> Join Room allowed");
                        return [4 /*yield*/, this.handleRoomInfo(room)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.socket.request("getRouterRtpCapabilities")];
                    case 2:
                        data = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.loadDevice(data)];
                    case 3:
                        _a.device = _b.sent();
                        console.log("07.1 ----> Get Router Rtp Capabilities codecs: ", this.device.rtpCapabilities.codecs);
                        return [4 /*yield*/, this.initTransports(this.device)];
                    case 4:
                        _b.sent();
                        this.startLocalMedia();
                        this.socket.emit("getProducers");
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomClient.prototype.handleRoomInfo = function (room) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var peers, _i, _a, peer;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                peers = new Map(JSON.parse(room.peers));
                this.participantsCount = peers.size;
                // isPresenter =this.participantsCount > 1 ? false : true;
                // handleRules(isPresenter);
                // adaptAspectRatio(participantsCount);
                for (_i = 0, _a = Array.from(peers.keys()).filter(function (id) { return id !== _this.peer_id; }); _i < _a.length; _i++) {
                    peer = _a[_i];
                    // let peer_info = peers.get(peer).peer_info;
                    console.log(peer);
                    // // console.log('07 ----> Remote Peer info', peer_info);
                    // if (!peer_info.peer_video) {
                    //     await this.setVideoOff(peer_info, true);
                    // }
                }
                this.refreshParticipantsCount();
                console.log("06.2 Participants Count ---->", this.participantsCount);
                return [2 /*return*/];
            });
        });
    };
    RoomClient.prototype.loadDevice = function (routerRtpCapabilities) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var device;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        try {
                            device = new types_1.Device();
                        }
                        catch (error) {
                            if (error.name === "UnsupportedError") {
                                console.error("Browser not supported");
                            }
                            console.error("Browser not supported: ", error);
                        }
                        return [4 /*yield*/, (device === null || device === void 0 ? void 0 : device.load({
                                routerRtpCapabilities: routerRtpCapabilities
                            }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, device];
                }
            });
        });
    };
    RoomClient.prototype.initTransports = function (device) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data_1, data;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socket.request("createWebRtcTransport", {
                            forceTcp: false,
                            rtpCapabilities: device.rtpCapabilities
                        })];
                    case 1:
                        data_1 = _a.sent();
                        if (data_1.error) {
                            return [2 /*return*/, console.error("Create WebRtc Transport for Producer err: ", data_1.error)];
                        }
                        this.producerTransport = device.createSendTransport(data_1);
                        this.producerTransport.on("connect", function (_a, callback, errback) {
                            var dtlsParameters = _a.dtlsParameters;
                            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                return tslib_1.__generator(this, function (_b) {
                                    this.socket
                                        .request("connectTransport", {
                                        dtlsParameters: dtlsParameters,
                                        transport_id: data_1.id
                                    })
                                        .then(callback)["catch"](errback);
                                    return [2 /*return*/];
                                });
                            });
                        });
                        this.producerTransport.on("produce", function (_a, callback, errback) {
                            var kind = _a.kind, appData = _a.appData, rtpParameters = _a.rtpParameters;
                            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var producer_id, err_1;
                                return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            console.log("Going to produce", {
                                                kind: kind,
                                                appData: appData,
                                                rtpParameters: rtpParameters
                                            });
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.socket.request("produce", {
                                                    producerTransportId: this.producerTransport.id,
                                                    kind: kind,
                                                    appData: appData,
                                                    rtpParameters: rtpParameters
                                                })];
                                        case 2:
                                            producer_id = (_b.sent()).producer_id;
                                            callback({
                                                id: producer_id
                                            });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_1 = _b.sent();
                                            errback(err_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        this.producerTransport.on("connectionstatechange", function (state) {
                            switch (state) {
                                case "connecting":
                                    break;
                                case "connected":
                                    console.log("Producer Transport connected");
                                    break;
                                case "failed":
                                    console.warn("Producer Transport failed");
                                    _this.producerTransport.close();
                                    break;
                                default:
                                    break;
                            }
                        });
                        return [4 /*yield*/, this.socket.request("createWebRtcTransport", {
                                forceTcp: false
                            })];
                    case 2:
                        data = _a.sent();
                        if (data.error) {
                            return [2 /*return*/, console.error("Create WebRtc Transport for Consumer err: ", data.error)];
                        }
                        this.consumerTransport = device.createRecvTransport(data);
                        this.consumerTransport.on("connect", function (_a, callback, errback) {
                            var dtlsParameters = _a.dtlsParameters;
                            _this.socket
                                .request("connectTransport", {
                                transport_id: _this.consumerTransport.id,
                                dtlsParameters: dtlsParameters
                            })
                                .then(callback)["catch"](errback);
                        });
                        this.consumerTransport.on("connectionstatechange", function (state) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (state) {
                                    case "connecting":
                                        break;
                                    case "connected":
                                        console.log("Consumer Transport connected");
                                        break;
                                    case "failed":
                                        console.warn("Consumer Transport failed");
                                        this.consumerTransport.close();
                                        break;
                                    default:
                                        break;
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomClient.prototype.startLocalMedia = function () {
        if (this.isAudioAllowed) {
            console.log("09 ----> Start audio media");
            this.produce(VideoRtc_type_1.mediaType.audio, VideoRtc_type_1.LOCAL_STORAGE_DEVICES.audio.index);
        }
        else {
            console.log("09 ----> Audio is off");
        }
        if (this.isVideoAllowed) {
            console.log("10 ----> Start video media");
            this.produce(VideoRtc_type_1.mediaType.video, VideoRtc_type_1.LOCAL_STORAGE_DEVICES.video.index);
        }
        else {
            console.log("10 ----> Video is off");
        }
    };
    RoomClient.prototype.initSockets = function () {
        var _this = this;
        this.socket.on("consumerClosed", function (_a) {
            var consumer_id = _a.consumer_id, consumer_kind = _a.consumer_kind;
            console.log("Closing consumer", {
                consumer_id: consumer_id,
                consumer_kind: consumer_kind
            });
        });
        this.socket.on("newProducers", function (data) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _i, data_2, _a, producer_id, peer_name, peer_info, type;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(data.length > 0)) return [3 /*break*/, 4];
                        console.log("New producers", data);
                        _i = 0, data_2 = data;
                        _b.label = 1;
                    case 1:
                        if (!(_i < data_2.length)) return [3 /*break*/, 4];
                        _a = data_2[_i], producer_id = _a.producer_id, peer_name = _a.peer_name, peer_info = _a.peer_info, type = _a.type;
                        return [4 /*yield*/, this.consume(producer_id, peer_name, peer_info, type)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        this.socket.on("refreshParticipantsCount", function (data) {
            console.log("Participants Count:", data);
            _this.participantsCount = data.peer_counts;
            // adaptAspectRatio(participantsCount);
        });
    };
    RoomClient.prototype.produce = function (type, deviceId, swapCamera) {
        if (deviceId === void 0) { deviceId = null; }
        if (swapCamera === void 0) { swapCamera = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mediaConstraints, audio, screen, stream, _a, track, params, _b, localStream_1, localStream_2, err_2;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mediaConstraints = {};
                        audio = false;
                        screen = false;
                        switch (type) {
                            case VideoRtc_type_1.mediaType.audio:
                                this.isAudioAllowed = true;
                                mediaConstraints = (0, VideoRtc_helper_1.getAudioConstraints)(deviceId);
                                audio = true;
                                break;
                            case VideoRtc_type_1.mediaType.video:
                                this.isVideoAllowed = true;
                                if (swapCamera) {
                                    mediaConstraints = (0, VideoRtc_helper_1.getCameraConstraints)(this.camera, this.camVideo);
                                }
                                else {
                                    mediaConstraints = (0, VideoRtc_helper_1.getVideoConstraints)(deviceId);
                                }
                                break;
                            case VideoRtc_type_1.mediaType.screen:
                                mediaConstraints = (0, VideoRtc_helper_1.getScreenConstraints)();
                                screen = true;
                                break;
                            default:
                                return [2 /*return*/];
                        }
                        if (!this.device.canProduce("video") && !audio) {
                            return [2 /*return*/, console.error("Cannot produce video")];
                        }
                        if (this.producerLabel.has(type)) {
                            return [2 /*return*/, console.log("Producer already exists for this type " + type)];
                        }
                        // let videoPrivacyBtn = this.getId(this.peer_id + '__vp');
                        // if (videoPrivacyBtn) videoPrivacyBtn.style.display = screen ? 'none' : 'inline';
                        console.log("Media contraints ".concat(type, ":"), mediaConstraints);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        if (!screen) return [3 /*break*/, 3];
                        return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia(mediaConstraints)];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, navigator.mediaDevices.getUserMedia(mediaConstraints)];
                    case 4:
                        _a = _c.sent();
                        _c.label = 5;
                    case 5:
                        stream = _a;
                        console.log("Supported Constraints", navigator.mediaDevices.getSupportedConstraints());
                        track = audio
                            ? stream.getAudioTracks()[0]
                            : stream.getVideoTracks()[0];
                        console.log("".concat(type, " settings ->"), track.getSettings());
                        params = {
                            track: track,
                            appData: {
                                mediaType: type
                            }
                        };
                        if (!audio && !screen) {
                            params.encodings = (0, VideoRtc_helper_1.getEncoding)();
                            params.codecOptions = {
                                videoGoogleStartBitrate: 1000
                            };
                        }
                        _b = this;
                        return [4 /*yield*/, this.producerTransport.produce(params)];
                    case 6:
                        _b.producer = _c.sent();
                        console.log("PRODUCER", this.producer);
                        this.producers.set(this.producer.id, this.producer);
                        // let elem, au;
                        if (!audio) {
                            localStream_1 = {
                                id: this.producer.id,
                                stream: stream,
                                type: type
                            };
                            if (this.eventListeners.has(VideoRtc_type_1._EVENTS.localVideoStream)) {
                                this.eventListeners
                                    .get(VideoRtc_type_1._EVENTS.localVideoStream)
                                    .forEach(function (callback) { return callback(localStream_1); });
                            }
                        }
                        else {
                            localStream_2 = {
                                id: this.producer.id,
                                stream: stream,
                                type: type
                            };
                            if (this.eventListeners.has(VideoRtc_type_1._EVENTS.localAudioStream)) {
                                this.eventListeners
                                    .get(VideoRtc_type_1._EVENTS.localAudioStream)
                                    .forEach(function (callback) { return callback(localStream_2); });
                            }
                        }
                        // producer.on('trackended', () => {
                        //     this.closeProducer(type);
                        // });
                        // producer.on('transportclose', () => {
                        //     console.log('Producer transport close');
                        //     if (!audio) {
                        //         elem.srcObject.getTracks().forEach(function (track) {
                        //             track.stop();
                        //         });
                        //         elem.parentNode.removeChild(elem);
                        //         handleAspectRatio();
                        //         console.log('[transportClose] Video-element-count', this.videoMediaContainer.childElementCount);
                        //     } else {
                        //         au.srcObject.getTracks().forEach(function (track) {
                        //             track.stop();
                        //         });
                        //         au.parentNode.removeChild(au);
                        //         console.log('[transportClose] audio-element-count', this.localAudioEl.childElementCount);
                        //     }
                        //     this.producers.delete(producer.id);
                        // });
                        // producer.on('close', () => {
                        //     console.log('Closing producer');
                        //     if (!audio) {
                        //         elem.srcObject.getTracks().forEach(function (track) {
                        //             track.stop();
                        //         });
                        //         elem.parentNode.removeChild(elem);
                        //         handleAspectRatio();
                        //         console.log('[closingProducer] Video-element-count', this.videoMediaContainer.childElementCount);
                        //     } else {
                        //         au.srcObject.getTracks().forEach(function (track) {
                        //             track.stop();
                        //         });
                        //         au.parentNode.removeChild(au);
                        //         console.log('[closingProducer] audio-element-count', this.localAudioEl.childElementCount);
                        //     }
                        //     this.producers.delete(producer.id);
                        // });
                        this.producerLabel.set(type, this.producer.id);
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _c.sent();
                        console.error("Produce error:", err_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // ####################################################
    // CONSUMER
    // ####################################################
    RoomClient.prototype.consume = function (producer_id, peer_name, peer_info, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                //
                // if (wbIsOpen && (!isRulesActive || isPresenter)) {
                //     console.log('Update whiteboard canvas to the participants in the room');
                //     wbCanvasToJson();
                // }
                this.getConsumeStream(producer_id, peer_info.peer_id, type).then(function (_a) {
                    var consumer = _a.consumer, stream = _a.stream, kind = _a.kind;
                    console.log("CONSUMER", consumer);
                    _this.consumers.set(consumer.id, consumer);
                    if (kind === "video") {
                        //     if (isParticipantsListOpen) getRoomParticipants(true);
                    }
                    console.log("CONSUMER MEDIA TYPE ----> " + type);
                    // RoomClient.RemoteVideoViews({
                    //     id: consumer.id,
                    //     type: type,
                    //     stream: stream,
                    //     name: peer_name
                    // });
                    var remote = {
                        id: consumer.id,
                        type: type,
                        stream: stream,
                        name: peer_name
                    };
                    if (_this.eventListeners.has(VideoRtc_type_1._EVENTS.remoteVideo)) {
                        _this.eventListeners
                            .get(VideoRtc_type_1._EVENTS.remoteVideo)
                            .forEach(function (callback) {
                            return callback(remote);
                        });
                    }
                    // this.handleConsumer(consumer.id, type, stream, peer_name, peer_info);
                });
                return [2 /*return*/];
            });
        });
    };
    RoomClient.prototype.getConsumeStream = function (producerId, peer_id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var rtpCapabilities, data, id, kind, rtpParameters, streamId, consumer, stream;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rtpCapabilities = this.device.rtpCapabilities;
                        return [4 /*yield*/, this.socket.request("consume", {
                                rtpCapabilities: rtpCapabilities,
                                consumerTransportId: this.consumerTransport.id,
                                producerId: producerId
                            })];
                    case 1:
                        data = _a.sent();
                        console.log("DATA", data);
                        id = data.id, kind = data.kind, rtpParameters = data.rtpParameters;
                        streamId = peer_id + (type === VideoRtc_type_1.mediaType.screen ? "-screensharing" : "-mic-webcam");
                        return [4 /*yield*/, this.consumerTransport.consume({
                                id: id,
                                producerId: producerId,
                                kind: kind,
                                rtpParameters: rtpParameters,
                                streamId: streamId
                            })];
                    case 2:
                        consumer = _a.sent();
                        stream = new MediaStream();
                        stream.addTrack(consumer.track);
                        return [2 /*return*/, {
                                consumer: consumer,
                                stream: stream,
                                kind: kind
                            }];
                }
            });
        });
    };
    RoomClient.prototype.refreshParticipantsCount = function () {
        this.socket.emit("refreshParticipantsCount");
    };
    RoomClient.prototype.event = function (evt) {
        if (this.eventListeners.has(evt)) {
            this.eventListeners.get(evt).forEach(function (callback) { return callback(); });
        }
    };
    RoomClient.prototype.on = function (evt, callback) {
        this.eventListeners.get(evt).push(callback);
    };
    return RoomClient;
}());
exports["default"] = RoomClient;
//# sourceMappingURL=RoomClient.js.map