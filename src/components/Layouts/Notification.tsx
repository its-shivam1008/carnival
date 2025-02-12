"use client";
import { useSocket } from '@/context/SocketContext';
import Image from 'next/image';
import React from 'react'
import { MdCall } from 'react-icons/md';

const Notification = () => {
    const {ongoingCall, handleJoinCall} = useSocket();
    if(!ongoingCall?.isRinging) return;
  return (
    <div className='h-screen w-full bg-slate-900 absolute top-0 left-0 flex justify-center items-center bg-opacity-50'>
      <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col justify-center items-center rounded p-4">
        <div className="flex flex-col items-center">
          <Image src={ongoingCall.participants.caller.profile.imageUrl} className="rounded-full" alt="Avatar" height={50} width={50}/>
          {ongoingCall.participants.caller.profile.fullName?.split(" ")[0]}
        </div>
        <p className="text-sm mb-2">Incoming Call</p>
        <div className='flex gap-8'>
          <button type="button" onClick={() => handleJoinCall(ongoingCall)} className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"><MdCall size={24}/></button>
          <button type="button" className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"><MdCall size={24}/></button>
        </div>
      </div>
    </div>
  )
}

export default Notification;