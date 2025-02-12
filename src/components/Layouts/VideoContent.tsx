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
        <video className={`rounded-xl border w-[800px] ${isLocalStream && isOnCall ? "w-[200px] h-[200px] absolute border-green-400 ":""}`} ref={videoRef} autoPlay playsInline muted={isLocalStream}></video>
    </div>
  )
}

export default VideoContent