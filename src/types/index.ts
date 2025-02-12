import { User } from "@clerk/nextjs/server";
import Peer from "simple-peer";

export type SocketUser ={
    userId : string;
    socketId : string;
    profile: User;  // User comes from clerk/nextjs/server
}

export type OngoingCall = {
    participants: Participants;
    isRinging: boolean;
}

export type Participants = {
    caller: SocketUser;
    receiver: SocketUser;
}

export type PeerData = {
    peerConnection: Peer.Instance;
    stream: MediaStream | undefined;
    participantUser:SocketUser;
}