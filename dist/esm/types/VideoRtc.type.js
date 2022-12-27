export var mediaType;
(function (mediaType) {
    mediaType["audio"] = "audioType";
    mediaType["video"] = "videoType";
    mediaType["camera"] = "cameraType";
    mediaType["screen"] = "screenType";
    mediaType["speaker"] = "speakerType";
})(mediaType || (mediaType = {}));
export var _EVENTS;
(function (_EVENTS) {
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
    _EVENTS["localVideoStream"] = "localVideoStream";
    _EVENTS["localAudioStream"] = "localAudioStream";
    _EVENTS["remoteVideo"] = "remoteVideo";
})(_EVENTS || (_EVENTS = {}));
export var LOCAL_STORAGE_DEVICES = {
    audio: {
        count: 0,
        index: 0,
        select: null
    },
    speaker: {
        count: 0,
        index: 0,
        select: null
    },
    video: {
        count: 0,
        index: 0,
        select: null
    }
};
export var DEVICES_COUNT = {
    audio: 0,
    speaker: 0,
    video: 0
};
//# sourceMappingURL=VideoRtc.type.js.map