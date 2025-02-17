"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket:any;

export default function Home() {
  const [transport, setTransport] = useState(null);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    const connectSocket = async () => {
      await fetch("/api/socket"); // Initializes WebSocket Server
      socket = io();

      socket.on("connect", () => {
        console.log("Connected to server:", socket.id);
        createWebRtcTransport();
      });
    };

    const createWebRtcTransport = async () => {
      socket.emit("createTransport", {}, async (transportData:any) => {
        console.log("Transport created:", transportData);

        setTransport(transportData);

        const stream:any = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setVideoStream(stream);

        const [videoTrack] = stream.getVideoTracks();

        socket.emit(
          "produce",
          { transportId: transportData.id, kind: "video", rtpParameters: videoTrack.getSettings() },
          (produceResponse:any) => {
            console.log("Producer created:", produceResponse);
          }
        );
      });
    };

    connectSocket();
  }, []);

  return (
    <div>
      <h1>Next.js SFU Video Chat</h1>
      <video autoPlay muted ref={(video:any) => video && (video.srcObject = videoStream)}></video>
    </div>
  );
}
