"use client";
import { useSocket } from '@/context/SocketContext';
import React, { useCallback, useEffect, useState }  from 'react'
import VideoContent from './VideoContent';
import { MdMic, MdMicOff, MdVideoCall, MdVideocam, MdVideocamOff } from 'react-icons/md';

const VideoCall = () => {
    const {localStream} = useSocket();
    
    const [isVidOn, setIsVidOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    useEffect(() => {
        if(localStream){
            const videoTrack = localStream.getVideoTracks()[0];
            setIsVidOn(videoTrack.enabled);
            const audioTrack = localStream.getAudioTracks()[0];
            setIsVidOn(audioTrack.enabled);
        }
    }, [localStream])
    

    const toggleCamera = useCallback(() => {
        if(localStream){
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVidOn(videoTrack.enabled);
        }
    },[localStream])
    const toggleMic = useCallback(() => {
        if(localStream){
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    },[localStream])
    

  return (
    <div className="flex flex-col justify-center gap-8">
         {localStream && <VideoContent stream={localStream} isLocalStream={true} isOnCall={false}/>}
         {
            localStream && <div className="flex justify-center gap-8">
                <button type="button" onClick={toggleMic}>
                    {!isMicOn ? <MdMic size={28}/> : <MdMicOff size={28}/>}
                </button>
                <button type="button" className="bg-rose-500 text-white font-medium rounded-lg px-2 py-1">
                    End Call
                </button>
                <button type="button" onClick={toggleCamera}>
                    {!isVidOn ? <MdVideocam size={28}/> : <MdVideocamOff size={28}/>}
                </button>
            </div>
         }
    </div>
  )
}

export default VideoCall