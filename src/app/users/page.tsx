'use client';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';
import { CiUser } from "react-icons/ci";

const ListOnlineUsers = () => {

    const {onlineUsers} = useSocket();
    const {user} = useUser();


  return (
    <div className='h-screen flex flex-col w-full'>
        {onlineUsers && onlineUsers.map((onlineUser, index) => {
            if(user?.id === onlineUser.profile.id) return null;
           return <div key={index} className='flex space-x-3 items-center'>
                <Image src={onlineUser.profile.imageUrl} className="rounded-full" alt="Avatar" height={50} width={50}/>
                <div>
                    {onlineUser.profile.fullName?.split(" ")[0]}
                </div>
            </div>
        })}
    </div>
  )
}

export default ListOnlineUsers