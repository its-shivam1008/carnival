'use client';
import VideoCall from '@/components/layouts/VideoCall';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import { FaVideo } from 'react-icons/fa6';

const ListOnlineUsers = () => {

    const {onlineUsers, handleCall} = useSocket();
    const {user} = useUser();


  return (
    <div className='h-screen flex flex-col w-full justify-center'>
        {onlineUsers && onlineUsers.map((onlineUser, index) => {
            if(user?.id === onlineUser.profile.id) return null;
           return <div key={index} className='flex space-x-3 items-center justify-between p-2'>
                <Image src={onlineUser.profile.imageUrl} className="rounded-full" alt="Avatar" height={50} width={50}/>
                <div>
                    {onlineUser.profile.fullName?.split(" ")[0]}
                </div>
                <button type="button" onClick={() => handleCall(onlineUser)} className='flex space-x-2 items-center px-2 py-2 w-fit bg-blue-600 hover:bg-blue-500 rounded-[8px] text-white font-bold'>Call <FaVideo className='text-white pl-2' size={24}/></button>
            </div>
        })}
        <VideoCall/>
    </div>
  )
}

export default ListOnlineUsers