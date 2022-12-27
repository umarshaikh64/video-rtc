export const getAudioConstraints = (deviceId: any) => {
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
      deviceId: deviceId,
    },
    video: false,
  };
};

export const getCameraConstraints = (camera: any, camVideo: any) => {
  camera = camera === "user" ? "environment" : "user";
  if (camera !== "user") camVideo = { facingMode: { exact: camera } };
  else camVideo = true;
  return {
    audio: false,
    video: camVideo,
  };
};

export const getVideoConstraints = (deviceId: any) => {
  const frameRate = {
    min: 5,
    ideal: 15,
    max: 30,
  };
  let videoConstraints = {
    audio: false,
    video: {
      width: {
        min: 640,
        ideal: 1920,
        max: 3840,
      },
      height: {
        min: 480,
        ideal: 1080,
        max: 2160,
      },
      deviceId: deviceId,
      aspectRatio: 1.777, // 16:9
      frameRate: frameRate,
    },
  }; // Init auto detect max cam resolution and fps

  // switch (videoQuality.value) {
  //     case 'default':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         };
  //         break;
  //     case 'qvga':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 320 },
  //                 height: { exact: 240 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints low bandwidth
  //         break;
  //     case 'vga':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 640 },
  //                 height: { exact: 480 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints medium bandwidth
  //         break;
  //     case 'hd':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 1280 },
  //                 height: { exact: 720 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints high bandwidth
  //         break;
  //     case 'fhd':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 1920 },
  //                 height: { exact: 1080 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints very high bandwidth
  //         break;
  //     case '2k':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 2560 },
  //                 height: { exact: 1440 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints ultra high bandwidth
  //         break;
  //     case '4k':
  //         videoConstraints = {
  //             audio: false,
  //             video: {
  //                 width: { exact: 3840 },
  //                 height: { exact: 2160 },
  //                 deviceId: deviceId,
  //                 aspectRatio: 1.777,
  //                 frameRate: frameRate,
  //             },
  //         }; // video cam constraints ultra high bandwidth
  //         break;
  // }
  // this.videoQualitySelectedIndex = videoQuality.selectedIndex;
  return videoConstraints;
};

export const getScreenConstraints = () => {
  return {
    audio: true,
    video: {
      frameRate: {
        ideal: 15,
        max: 30,
      },
    },
  };
};

export const getEncoding = () => {
  return [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ];
};
