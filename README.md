# Video RTC Meeting SDK (For testing)

## Install ##

#### NPM
```bash
npm install video-rtc
```

## Usage ##
##### Javascript
Just import VideoRTC:
```
import { useEffect, useRef } from 'react';
import VideoRTC, { RTCEvent } from 'video-rtc';
function App() {
  const localVideoRef = useRef(null);
  const iniSdk = async () => {
    await VideoRTC.initSdk({ appId: "demoAppId", secretKey: "12345678" })
  }

  useEffect(() => {
    iniSdk();
  }, [])
  const onJoin = async () => {
    await VideoRTC.onJoin({ roomId: "newApp", user: { name: "umar" } });
    VideoRTC.rc.on(RTCEvent.localVideoStream, (data) => {
      localVideoRef.current.srcObject = data.stream;
      localVideoRef.current.play();
      localVideoRef.current.controls = true;
    })
    VideoRTC.rc.on(RTCEvent.remoteVideo, (data) => {
      if (data.type === "videoType") {
        const video = document.createElement("video");
        video.srcObject = data.stream;
        video.id = data.id;
        video.autoplay = true;
        video.controls = true;
        document.getElementById("remoteVideos")?.appendChild(video)
      }
    })
  }
  return (
    <div className="App">
      <video ref={localVideoRef} />
      <button onClick={onJoin}>Click </button>
      <div className='' id='remoteVideos'></div>
    </div>
  );
}
export default App;
```