import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [log, setLog] = useState([]);
  const [welcome, setWelcome] = useState("");

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // Capture frame and send as base64
  const captureFrame = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL("image/jpeg");

    try {
      const res = await axios.post("http://127.0.0.1:8000/recognize", {
        image_base64: imageBase64,
      });

      if (res.data.names && res.data.names.length > 0) {
        const name = res.data.names[0];
        setWelcome(`🎉 Welcome ${name}!`);
        const time = new Date().toLocaleTimeString();
        setLog((prev) => [`${name} - ${time}`, ...prev]);
        setTimeout(() => setWelcome(""), 3000);
      }
    } catch (err) {
      console.error("Recognition error:", err);
    }
  };

  useEffect(() => {
    let interval;
    if (streaming) {
      interval = setInterval(captureFrame, 2000);
    }
    return () => clearInterval(interval);
  }, [streaming]);

  return (
    <div className="container">
      <h1 className="title">Face Recognition Attendance</h1>
      <div className="main-section">
        <div className="button-panel">
          <button onClick={startCamera} className="start-btn">Start</button>
          <button onClick={stopCamera} className="stop-btn">Stop</button>
        </div>

        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline className="camera" />
          {welcome && <div className="popup">{welcome}</div>}
        </div>
      </div>

      <div className="log-box">
        <h2>Attendance Log</h2>
        <ul>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
