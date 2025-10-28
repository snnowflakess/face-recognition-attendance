// src/VideoCapture.js
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const VideoBox = styled.div`
  border: 2px solid white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
`;

const Button = styled.button`
  background-color: ${(p) => (p.stop ? "#ff4b2b" : "#00c6ff")};
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }
`;

const Popup = styled(motion.div)`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 20px 40px;
  backdrop-filter: blur(12px);
  color: #fff;
  font-size: 1.5em;
  text-align: center;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
`;

export default function VideoCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("Stopped");
  const [recognized, setRecognized] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startCamera = async () => {
    setStatus("Starting camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStatus("Running");
      const id = setInterval(captureAndSend, 1500);
      setIntervalId(id);
    } catch (err) {
      console.error(err);
      setStatus("Camera error: " + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setStatus("Stopped");
  };

  const captureAndSend = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

    try {
      const res = await fetch("http://localhost:8000/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: dataUrl }),
      });
      const json = await res.json();
      if (json.names && json.names.length > 0) {
        setRecognized(json.names);
        triggerPopup(json.names);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerPopup = (names) => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div style={{ position: "relative" }}>
      <VideoBox>
        <video ref={videoRef} style={{ width: "100%" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </VideoBox>
      <div style={{ marginTop: 10 }}>
        <Button onClick={startCamera}>Start</Button>
        <Button stop onClick={stopCamera}>
          Stop
        </Button>
        <span style={{ marginLeft: 12 }}>{status}</span>
      </div>

      <AnimatePresence>
        {showPopup && recognized.length > 0 && (
          <Popup
            key="popup"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
          >
            🎉 Welcome, <b>{recognized.join(", ")}</b>!
          </Popup>
        )}
      </AnimatePresence>
    </div>
  );
}

