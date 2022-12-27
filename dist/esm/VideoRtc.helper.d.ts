export declare const getAudioConstraints: (deviceId: any) => {
    audio: {
        echoCancellation: boolean;
        noiseSuppression: boolean;
        sampleRate: number;
        deviceId: any;
    };
    video: boolean;
};
export declare const getCameraConstraints: (camera: any, camVideo: any) => {
    audio: boolean;
    video: any;
};
export declare const getVideoConstraints: (deviceId: any) => {
    audio: boolean;
    video: {
        width: {
            min: number;
            ideal: number;
            max: number;
        };
        height: {
            min: number;
            ideal: number;
            max: number;
        };
        deviceId: any;
        aspectRatio: number;
        frameRate: {
            min: number;
            ideal: number;
            max: number;
        };
    };
};
export declare const getScreenConstraints: () => {
    audio: boolean;
    video: {
        frameRate: {
            ideal: number;
            max: number;
        };
    };
};
export declare const getEncoding: () => {
    rid: string;
    maxBitrate: number;
    scalabilityMode: string;
}[];
