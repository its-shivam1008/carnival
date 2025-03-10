"use client";
import { OngoingCall, Participants, SocketUser, PeerData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData, SimplePeerData } from "simple-peer";
import { clearTimeout } from "timers";
// import { clearTimeout } from "timers";

interface iSocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  isCallEnded:boolean;
  peer:PeerData | null;
  localStream: MediaStream | null;
  handleCall: (user: SocketUser) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  handleHangup: (data: {ongoingCall?: OngoingCall, isEmitHangup?:boolean}) => void
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({children}: {children:React.ReactNode}) =>{
    const {user} = useUser();  // useUser() is a hook prooviderd by clerk js
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [ongoingCall, setOngoingCall] = useState< OngoingCall | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<PeerData | null>(null)
    const [isCallEnded, setIsCallEnded] = useState(false);

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
      setIsCallEnded(false);
      if(!currentSocketUser|| !socket) return;

      const stream = await getMediaStream();

      if(!stream){
        console.log("no steam in handleCall");
        return;
      }

      setLocalStream(stream);

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

    const handleHangup = useCallback((data:{ongoingCall?:OngoingCall |null, isEmitHangup?:boolean}) => {
      if(socket && user && data?.ongoingCall && data?.isEmitHangup){
        socket.emit("hangup",{
          ongoingCall:data.ongoingCall,
          userHangingupId:user.id
        })
      }

      setOngoingCall(null);
      setPeer(null);
      if(localStream){
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      setIsCallEnded(true);
    }, [socket, user, localStream])

    const createPeer = useCallback((stream:MediaStream, initiator:boolean) => {
      const iceServers:RTCIceServer[] = [
        {
          urls:[
            "stun:stun.1.google.com:19302",
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
            "stun:stun3.1.google.com:19302",
          ]
        }
      ]
      const peer = new Peer({
        stream,
        initiator,
        trickle:true,
        config:{iceServers}
      });

      peer.on("stream", (stream)=>{
        setPeer((prevPeer)=>{
          if(prevPeer){
            return {...prevPeer, stream};
          }
          return prevPeer;
        })
      })

      peer.on("error", console.error);
      peer.on("close", () => handleHangup({}));

      const rtcPeerConnection:RTCPeerConnection = (peer as any)._pc;

      rtcPeerConnection.oniceconnectionstatechange = async () => {
        if(rtcPeerConnection.iceConnectionState === "disconnected" || rtcPeerConnection.iceConnectionState === "failed"){
          handleHangup({})
        }
      }

      return peer;
    },[ongoingCall, setPeer])

    const completePeerConnection = useCallback(async(connectionData:{sdp:SignalData, ongoingCall:OngoingCall, isCaller:boolean}) => {
      if(!localStream){
        console.log("Missing the localStream");
        return;
      }

      if(peer){
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }

      const newPeer = createPeer(localStream, true);
      setPeer({
        peerConnection:newPeer,
        participantUser:connectionData.ongoingCall.participants.receiver,
        stream:undefined
      })
      newPeer.on('signal', async(data:SignalData)=>{
        if(socket){
          socket.emit("webrtcSignal",{
            sdp:data,
            ongoingCall,
            isCaller:true
          })
        }
      })
    }, [localStream, createPeer, peer, ongoingCall])

    const handleJoinCall = useCallback(async (ongoingCall:OngoingCall) => {
      setIsCallEnded(false);
      setOngoingCall(prev => {
        if(prev){
          return {...prev, isRinging:false}
        }
        return prev
      })

      const stream = await getMediaStream();
      if(!stream){
        console.log("no steam in handleJoinCall");
        return;
      }

      setLocalStream(stream);

      const newPeer = createPeer(stream, true);
      setPeer({
        peerConnection:newPeer,
        participantUser:ongoingCall.participants.caller,
        stream:undefined
      })
      newPeer.on('signal', async(data:SignalData)=>{
        if(socket){
          socket.emit("webrtcSignal",{
            sdp:data,
            ongoingCall,
            isCaller:false
          })
        }
      })

    },[socket, currentSocketUser])
    


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
      socket.on("webrtcSignal", completePeerConnection);
      socket.on("hangup", handleHangup);
      
      return () => {
        socket.off("incomingCall", onIncomingCall);
        socket.off("webrtcSignal", completePeerConnection);
        socket.off("hangup", handleHangup);
      }
    }, [socket, isSocketConnected, user, onIncomingCall, completePeerConnection])

    // useEffect(() => {
    //   let timeout:ReturnType<typeof setTimeout>

    //   if(isCallEnded){
    //     timeout = setTimeout(() => {
    //       setIsCallEnded(false);
    //     },2000);
    //   }

    //   return () => clearTimeout(timeout)
    // },[isCallEnded])

    return <SocketContext.Provider value={{
      onlineUsers,
      ongoingCall,
      peer,
      isCallEnded,
      localStream,
      handleCall,
      handleJoinCall,
      handleHangup
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