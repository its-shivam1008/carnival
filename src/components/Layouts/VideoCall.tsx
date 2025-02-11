"use client";
import { useSocket } from '@/context/SocketContext';
import React from 'react'
import VideoContent from './VideoContent';

const VideoCall = () => {
    const {localStream} = useSocket();
  return (
    <div>
         {localStream && <VideoContent stream={localStream} isLocalStream={true} isOnCall={false}/>}
    </div>
  )
}

export default VideoCall