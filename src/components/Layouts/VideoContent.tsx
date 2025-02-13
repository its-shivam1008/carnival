"use client";
import React, { useEffect, useRef } from 'react';

interface VideoContainer {
    stream: MediaStream | null;
    isLocalStream: boolean;
    isOnCall: boolean;
}

const VideoContent = ({stream, isLocalStream, isOnCall}:VideoContainer) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }
    }, [stream])
    

  return (
    <div>
        <video className={`rounded-xl ${isLocalStream && isOnCall ? "w-[200px] border h-[120px] absolute border-green-400 ":"w-[800px]"}`} ref={videoRef} autoPlay playsInline muted={isLocalStream}></video>
    </div>
  )
}

export default VideoContent