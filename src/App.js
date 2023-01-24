import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:8080";

function App() {
  const [message, setMessage] = useState("");
  let socket;
  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      // setMessage(data);
    });
  }, [message]);

  const sendMessage = () => {
    if (message) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  const videoRef = useRef(null);

  useEffect(() => {
    getVideo();
  }, [videoRef]);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        // let video = videoRef.current;
        // console.log("socket", socket);
        // video.play();

        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        setInterval(function () {
          imageCapture.takePhoto().then((blob) => {
            socket.emit("video", blob);
          });
        }, 1000);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <video ref={videoRef} />
    </div>
  );
}

export default App;
