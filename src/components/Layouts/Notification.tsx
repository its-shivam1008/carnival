import { useSocket } from '@/context/SocketContext';
import Image from 'next/image';
import React from 'react'

const Notification = () => {
    const {ongoingCall} = useSocket();
    if(!ongoingCall?.isRinging) return;
  return (
    <div className='h-screen w-full bg-blue-400 opacity-50'>
      <div className="bg-white min-w-[300px] min-h-[100px] flex justify-center items-center rounded p-4">
        <div className="flex flex-col items-center">
          <Image src={ongoingCall.participants.caller.profile.imageUrl} className="rounded-full" alt="Avatar" height={50} width={50}/>
          {ongoingCall.participants.caller.profile.fullName?.split(" ")[0]}
        </div>
        <p className="text-sm mb-2">Incoming Call</p>
      </div>
    </div>
  )
}

export default Notification;