"use client";
import { OngoingCall, Participants, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  handleCall: (user: SocketUser) => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({children}: {children:React.ReactNode}) =>{
    const {user} = useUser();  // useUser() is a hook prooviderd by clerk js
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [ongoingCall, setOngoingCall] = useState< OngoingCall | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const currentSocketUser = onlineUsers?.find(onlineUser => onlineUser.userId === user?.id);
    
    // console.log("socketConnected ===>", isSocketConnected);
    // console.log("OnlineUsers ===>", onlineUsers);

    const getMediaStream = useCallback(async (faceMode?:string) => {
      if(localStream){
        return localStream;
      }

      try{

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");

        const stream = await navigator.mediaDevices.getUserMedia({
          audio:true,
          video: {
            width:{min:640, ideal:1280, max:1920},
            height:{min:360, ideal:720, max:1080},
            frameRate:{min:16, ideal:30, max:30},
            facingMode:videoDevices.length > 0 ? faceMode : undefined
          }
        })

        return stream;

      }catch(error){
        console.log("Failed to load stream", error);
        setLocalStream(null);
        return null;
      }

    }, [localStream])

    const handleCall = useCallback( async (user:SocketUser) => {
      if(!currentSocketUser|| !socket) return;

      const stream = await getMediaStream();

      if(!stream){
        console.log("no steam in handleCall");
        return;
      }

      const participants = {caller : currentSocketUser, receiver:user}
      setOngoingCall({
        participants:participants,
        isRinging:false
      })
      socket.emit("call", participants);
    }, [socket, currentSocketUser, ongoingCall])

    const onIncomingCall = useCallback((participants:Participants) => {
      setOngoingCall({
        participants:participants,
        isRinging:true
      })
    }, [socket, user, ongoingCall])
    


    // initializing a socket
    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        return  () => {
            newSocket.disconnect();
        }
    }, [user]) // the above defined user comes here as the dependancy of the useEffect hook's dependancy array.

    useEffect(() => {
      if(socket === null){
        return;
      }
      if(socket.connected){
        onConnect()
      }
      function onConnect(){
        setIsSocketConnected(true);
      }
      function onDisconnect(){
        setIsSocketConnected(false);
      }
    
      socket.on('connect',onConnect);
      socket.on('disconnect',onDisconnect);
      
      return () => {
        socket.off('connect',onConnect);
        socket.off('disconnect',onDisconnect);
      }
    }, [socket]);

    // set online users 
    useEffect(() => {
      if(!socket || !isSocketConnected ) return 

      socket.emit('addNewUser', user); // the user comes from the "initializing socket.io" use effect
      socket.on('getUsers', (res)=>{
        setOnlineUsers(res);
      })

      return () =>{
        socket.off('getUsers', (res)=>{
          setOnlineUsers(res);
        })
      }
    }, [socket, isSocketConnected, user]) // we also have to include the "user" which comes from the "initializing socket.io" use effect
    
    // calls
    useEffect(() => {
      if(!socket || !isSocketConnected) return;
      socket.on("incomingCall", onIncomingCall);
      return () => {
        socket.off("incomingCall", onIncomingCall);
      }
    }, [socket, isSocketConnected, user, onIncomingCall])

    return <SocketContext.Provider value={{
      onlineUsers,
      ongoingCall,
      localStream,
      handleCall,
    }}>
        {children}
    </SocketContext.Provider>
}

export const useSocket = () =>{
    const context = useContext(SocketContext)

    if(context === null){
        throw new Error("useSocket must be wrapped within a SocketContextProvider");
    }

    return context;

}