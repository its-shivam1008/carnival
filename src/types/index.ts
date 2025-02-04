// import { User } from "@clerk/nextjs/server";

export type SocketUser ={
    user : string;
    socketId : string;
    // profile: User;  // User comes from clerk/nextjs/server
}