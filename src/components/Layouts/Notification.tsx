import { useSocket } from '@/context/SocketContext';
import React from 'react'

const Notification = () => {
    const {ongoingCall} = useSocket();
    if(!ongoingCall?.isRinging) return;
  return (
    <div className='h-screen w-full bg-blue-400 opacity-50'>Notification</div>
  )
}

export default Notification;