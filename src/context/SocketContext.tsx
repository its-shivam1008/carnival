import { SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {
  onlineUsers: SocketUser[] | null
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({children}: {children:React.ReactNode}) =>{
    const {user} = useUser();  // useUser() is a hook prooviderd by clerk js
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);

    console.log("socketConnected ===>", isSocketConnected);
    console.log("OnlineUsers ===>", onlineUsers);


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
    

    return <SocketContext.Provider value={{
      onlineUsers
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