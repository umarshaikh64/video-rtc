import { Device, Producer, Transport } from "mediasoup-client/lib/types";
import {
  LOCAL_STORAGE_DEVICES,
  RTCStreamProps,
  RemoteVideoViewsProps,
  RoomClientProps,
  _EVENTS,
  mediaType,
} from "./types/VideoRtc.type";
import {
  getAudioConstraints,
  getCameraConstraints,
  getEncoding,
  getScreenConstraints,
  getVideoConstraints,
} from "./VideoRtc.helper";

class RoomClient {
  socket: any;
  consumers: any;
  producers: any;
  producerLabel: any;
  eventListeners: any;
  producerTransport: Transport | null = null;
  consumerTransport: Transport | null = null;
  device: Device | undefined;
  _isConnected: boolean = false;
  isAudioAllowed = false;
  isVideoAllowed = false;
  camVideo = false;
  camera = "user";
  peer_name = "";
  peer_id: string;
  // peer_info:any|null =null;

  participantsCount: number = 0;

  producer: Producer | null = null;
  static roomId: string;
  // get getRoomId(): string {
  //   return RoomClient.roomId;
  // }
  // set setRoomId(value: string) {
  //   RoomClient.roomId = value;
  // }

  constructor({
    socket,
    room_id,
    isAudioAllowed,
    isVideoAllowed,
    peer_name,
    successCallback,
  }: RoomClientProps) {
    this.socket = socket;
    this.isAudioAllowed = isAudioAllowed;
    this.isVideoAllowed = isVideoAllowed;
    // this.setRoomId = room_id;
    this.consumers = new Map();
    this.producers = new Map();
    this.producerLabel = new Map();
    this.eventListeners = new Map();
    this.peer_name = peer_name;
    this.peer_id = socket!.id;
    Object.keys(_EVENTS).forEach((evt) => {
      this.eventListeners.set(evt, []);
    });

    this.socket.request = function request(type: any, data = {}) {
      return new Promise((resolve, reject) => {
        socket!.emit(type, data, (data: any) => {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        });
      });
    };
    this.createRoom(room_id).then(async () => {
      let data = {
        room_id: room_id,
        peer_info: {
          peer_id: socket!.id,
          peer_name: peer_name,
          peer_audio: isAudioAllowed,
          peer_video: isVideoAllowed,
        },
        peer_geo: "this.peer_geo",
      };
      await this.join(data);
      this.initSockets();
      this._isConnected = true;
      successCallback();
    });
  }

  // static get EVENTS() {
  //   return _EVENTS;
  // }

  async createRoom(room_id: string) {
    await this.socket
      .request("createRoom", {
        room_id,
      })
      .catch((err: any) => {
        console.log("Create room error:", err);
      });
  }

  async join(data: any) {
    this.socket
      .request("join", data)
      .then(async (room: any) => {
        await this.joinAllowed(room);
      })
      .catch((err: any) => {
        console.log("Join error:", err);
      });
  }

  async joinAllowed(room: any) {
    console.log("07 ----> Join Room allowed");
    await this.handleRoomInfo(room);
    const data = await this.socket.request("getRouterRtpCapabilities");
    this.device = await this.loadDevice(data);
    console.log(
      "07.1 ----> Get Router Rtp Capabilities codecs: ",
      this.device!.rtpCapabilities.codecs
    );
    await this.initTransports(this.device!);
    this.startLocalMedia();
    this.socket.emit("getProducers");
  }

  async handleRoomInfo(room: any) {
    let peers = new Map(JSON.parse(room.peers));
    this.participantsCount = peers.size;
    // isPresenter =this.participantsCount > 1 ? false : true;
    // handleRules(isPresenter);
    // adaptAspectRatio(participantsCount);
    for (let peer of Array.from(peers.keys()).filter(
      (id) => id !== this.peer_id
    )) {
      // let peer_info = peers.get(peer).peer_info;
      console.log(peer);
      // // console.log('07 ----> Remote Peer info', peer_info);
      // if (!peer_info.peer_video) {
      //     await this.setVideoOff(peer_info, true);
      // }
    }
    this.refreshParticipantsCount();
    console.log("06.2 Participants Count ---->", this.participantsCount);
    // notify && participantsCount == 1 ? shareRoom() : sound('joined');
    // if (notify && participantsCount == 1) {
    //     shareRoom();
    // } else {
    //     if (this.isScreenAllowed) {
    //         this.shareScreen();
    //     }
    //     sound('joined');
    // }
  }

  async loadDevice(routerRtpCapabilities: any) {
    let device;
    try {
      device = new Device();
    } catch (error: any) {
      if (error.name === "UnsupportedError") {
        console.error("Browser not supported");
      }
      console.error("Browser not supported: ", error);
    }
    await device?.load({
      routerRtpCapabilities,
    });
    return device;
  }

  async initTransports(device: Device) {
    {
      const data = await this.socket.request("createWebRtcTransport", {
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
      });
      if (data.error) {
        return console.error(
          "Create WebRtc Transport for Producer err: ",
          data.error
        );
      }
      this.producerTransport = device.createSendTransport(data);
      this.producerTransport.on(
        "connect",
        async ({ dtlsParameters }: any, callback: any, errback: any) => {
          this.socket
            .request("connectTransport", {
              dtlsParameters,
              transport_id: data.id,
            })
            .then(callback)
            .catch(errback);
        }
      );

      this.producerTransport.on(
        "produce",
        async ({ kind, appData, rtpParameters }, callback, errback) => {
          console.log("Going to produce", {
            kind: kind,
            appData: appData,
            rtpParameters: rtpParameters,
          });
          try {
            const { producer_id } = await this.socket.request("produce", {
              producerTransportId: this.producerTransport!.id,
              kind,
              appData,
              rtpParameters,
            });
            callback({
              id: producer_id,
            });
          } catch (err: any) {
            errback(err);
          }
        }
      );

      this.producerTransport.on("connectionstatechange", (state) => {
        switch (state) {
          case "connecting":
            break;

          case "connected":
            console.log("Producer Transport connected");
            break;

          case "failed":
            console.warn("Producer Transport failed");
            this.producerTransport!.close();
            break;

          default:
            break;
        }
      });
    }

    // ####################################################
    // CONSUMER TRANSPORT
    // ####################################################

    {
      const data = await this.socket.request("createWebRtcTransport", {
        forceTcp: false,
      });

      if (data.error) {
        return console.error(
          "Create WebRtc Transport for Consumer err: ",
          data.error
        );
      }

      this.consumerTransport = device.createRecvTransport(data);
      this.consumerTransport.on(
        "connect",
        ({ dtlsParameters }, callback, errback) => {
          this.socket
            .request("connectTransport", {
              transport_id: this.consumerTransport!.id,
              dtlsParameters,
            })
            .then(callback)
            .catch(errback);
        }
      );

      this.consumerTransport.on("connectionstatechange", async (state: any) => {
        switch (state) {
          case "connecting":
            break;

          case "connected":
            console.log("Consumer Transport connected");
            break;

          case "failed":
            console.warn("Consumer Transport failed");
            this.consumerTransport!.close();
            break;

          default:
            break;
        }
      });
    }
  }

  startLocalMedia() {
    if (this.isAudioAllowed) {
      console.log("09 ----> Start audio media");
      this.produce(mediaType.audio, LOCAL_STORAGE_DEVICES.audio.index);
    } else {
      console.log("09 ----> Audio is off");
    }
    if (this.isVideoAllowed) {
      console.log("10 ----> Start video media");
      this.produce(mediaType.video, LOCAL_STORAGE_DEVICES.video.index);
    } else {
      console.log("10 ----> Video is off");
    }
  }

  initSockets() {
    this.socket.on("consumerClosed", ({ consumer_id, consumer_kind }: any) => {
      console.log("Closing consumer", {
        consumer_id: consumer_id,
        consumer_kind: consumer_kind,
      });
    });
    this.socket.on("newProducers", async (data: any) => {
      if (data.length > 0) {
        console.log("New producers", data);
        for (let { producer_id, peer_name, peer_info, type } of data) {
          await this.consume(producer_id, peer_name, peer_info, type);
        }
      }
    });
    this.socket.on("refreshParticipantsCount", (data: any) => {
      console.log("Participants Count:", data);
      this.participantsCount = data.peer_counts;
      // adaptAspectRatio(participantsCount);
    });
  }

  async produce(
    type: mediaType,
    deviceId: number | null = null,
    swapCamera = false
  ) {
    let mediaConstraints = {};
    let audio = false;
    let screen = false;
    switch (type) {
      case mediaType.audio:
        this.isAudioAllowed = true;
        mediaConstraints = getAudioConstraints(deviceId);
        audio = true;
        break;
      case mediaType.video:
        this.isVideoAllowed = true;
        if (swapCamera) {
          mediaConstraints = getCameraConstraints(this.camera, this.camVideo);
        } else {
          mediaConstraints = getVideoConstraints(deviceId);
        }
        break;
      case mediaType.screen:
        mediaConstraints = getScreenConstraints();
        screen = true;
        break;
      default:
        return;
    }
    if (!this.device!.canProduce("video") && !audio) {
      return console.error("Cannot produce video");
    }
    if (this.producerLabel.has(type)) {
      return console.log("Producer already exists for this type " + type);
    }

    // let videoPrivacyBtn = this.getId(this.peer_id + '__vp');
    // if (videoPrivacyBtn) videoPrivacyBtn.style.display = screen ? 'none' : 'inline';

    console.log(`Media contraints ${type}:`, mediaConstraints);
    let stream;
    try {
      stream = screen
        ? await navigator.mediaDevices.getDisplayMedia(mediaConstraints)
        : await navigator.mediaDevices.getUserMedia(mediaConstraints);

      console.log(
        "Supported Constraints",
        navigator.mediaDevices.getSupportedConstraints()
      );

      const track = audio
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];

      console.log(`${type} settings ->`, track.getSettings());

      const params: any = {
        track,
        appData: {
          mediaType: type,
        },
      };

      if (!audio && !screen) {
        params.encodings = getEncoding();
        params.codecOptions = {
          videoGoogleStartBitrate: 1000,
        };
      }

      this.producer = await this.producerTransport!.produce(params);

      console.log("PRODUCER", this.producer);

      this.producers.set(this.producer.id, this.producer);

      // let elem, au;
      if (!audio) {
        const localStream: RTCStreamProps = {
          id: this.producer.id,
          stream: stream,
          type: type,
        };
        if (this.eventListeners.has(_EVENTS.localVideoStream)) {
          this.eventListeners
            .get(_EVENTS.localVideoStream)
            .forEach((callback: any) => callback(localStream));
        }
      } else {
        const localStream: RTCStreamProps = {
          id: this.producer.id,
          stream: stream,
          type: type,
        };
        if (this.eventListeners.has(_EVENTS.localAudioStream)) {
          this.eventListeners
            .get(_EVENTS.localAudioStream)
            .forEach((callback: any) => callback(localStream));
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

      // switch (type) {
      //     case mediaType.audio:
      //         // this.setIsAudio(this.peer_id, true);
      //         this.event(_EVENTS.startAudio);
      //         break;
      //     case mediaType.video:
      //         // this.setIsVideo(true);
      //         this.event(_EVENTS.startVideo);
      //         break;
      //     case mediaType.screen:
      //         // this.setIsScreen(true);
      //         this.event(_EVENTS.startScreen);
      //         break;
      //     default:
      //         return;
      // }
      // if present produce the tab audio on screen share
      // if (screen && stream.getAudioTracks()[0]) {
      //     this.produceScreenAudio(stream);
      // }
    } catch (err) {
      console.error("Produce error:", err);

      // if (!audio && !screen && videoQuality.selectedIndex != 0) {
      //     videoQuality.selectedIndex = this.videoQualitySelectedIndex;
      //     this.sound('alert');
      //     this.userLog(
      //         'error',
      //         `Your device doesn't support the selected video quality (${videoQuality.value}), please select the another one.`,
      //         'top-end',
      //     );
      // }
    }
  }

  // ####################################################
  // CONSUMER
  // ####################################################

  async consume(producer_id: any, peer_name: any, peer_info: any, type: any) {
    //
    // if (wbIsOpen && (!isRulesActive || isPresenter)) {
    //     console.log('Update whiteboard canvas to the participants in the room');
    //     wbCanvasToJson();
    // }
    this.getConsumeStream(producer_id, peer_info.peer_id, type).then(
      ({ consumer, stream, kind }: any) => {
        console.log("CONSUMER", consumer);
        this.consumers.set(consumer.id, consumer);
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
        const remote: RemoteVideoViewsProps = {
          id: consumer.id,
          type: type,
          stream: stream,
          name: peer_name,
        };
        if (this.eventListeners.has(_EVENTS.remoteVideo)) {
          this.eventListeners
            .get(_EVENTS.remoteVideo)
            .forEach((callback: (data: RemoteVideoViewsProps) => void) =>
              callback(remote)
            );
        }

        // this.handleConsumer(consumer.id, type, stream, peer_name, peer_info);
      }
    );
  }

  async getConsumeStream(producerId: any, peer_id: any, type: any) {
    const { rtpCapabilities } = this.device!;
    const data = await this.socket.request("consume", {
      rtpCapabilities,
      consumerTransportId: this.consumerTransport!.id,
      producerId,
    });
    console.log("DATA", data);
    const { id, kind, rtpParameters } = data;
    // let codecOptions:any = {};
    const streamId =
      peer_id + (type === mediaType.screen ? "-screensharing" : "-mic-webcam");
    const consumer = await this.consumerTransport!.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      streamId,
    });
    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    return {
      consumer,
      stream,
      kind,
    };
  }

  refreshParticipantsCount() {
    this.socket.emit("refreshParticipantsCount");
  }

  event(evt: any) {
    if (this.eventListeners.has(evt)) {
      this.eventListeners.get(evt).forEach((callback: any) => callback());
    }
  }

  on(evt: any, callback: (data: any) => void | any) {
    this.eventListeners.get(evt).push(callback);
  }
}

export default RoomClient;
