"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

const SERVER_URL = "http://localhost:5000"; // Change if hosted

export default function Call() {
    const [socket, setSocket] = useState(null);
    const [device, setDevice] = useState(null);
    const [roomId, setRoomId] = useState("room1"); // Default room
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({}); // Store remote videos dynamically
    let sendTransport, recvTransport;
    let producers = [];
    let consumers = [];

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on("connect", async () => {
            console.log("Connected to Mediasoup server");
            await joinRoom(newSocket);
        });

        newSocket.on("newProducer", async ({ producerId }) => {
            console.log("New producer found:", producerId);
            await consume(producerId);
        });

        return () => newSocket.disconnect();
    }, []);

    const joinRoom = async (socket) => {
        socket.emit("joinRoom", { roomId }, async ({ routerRtpCapabilities }) => {
            const device = new mediasoupClient.Device();
            await device.load({ routerRtpCapabilities });
            setDevice(device);
            await createTransport(socket, device);
        });
    };

    const createTransport = async (socket, device) => {
        socket.emit("createTransport", { roomId }, async (data) => {
            sendTransport = device.createSendTransport(data);
            sendTransport.on("connect", ({ dtlsParameters }, callback) => {
                socket.emit("connectTransport", { transportId: sendTransport.id, dtlsParameters });
                callback();
            });

            sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
                socket.emit("produce", { roomId, transportId: sendTransport.id, kind, rtpParameters }, ({ id }) => {
                    callback({ id });
                });
            });

            // Get user media and produce video/audio
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;

            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            producers.push(await sendTransport.produce({ track: videoTrack }));
            producers.push(await sendTransport.produce({ track: audioTrack }));
        });
    };

    const consume = async (producerId) => {
        socket.emit("createTransport", { roomId }, async (data) => {
            recvTransport = device.createRecvTransport(data);
            recvTransport.on("connect", ({ dtlsParameters }, callback) => {
                socket.emit("connectTransport", { transportId: recvTransport.id, dtlsParameters });
                callback();
            });

            socket.emit("consume", { roomId, producerId, transportId: recvTransport.id, rtpCapabilities: device.rtpCapabilities }, async (response) => {
                const consumer = await recvTransport.consume({
                    id: response.id,
                    producerId: response.producerId,
                    kind: response.kind,
                    rtpParameters: response.rtpParameters,
                });

                consumers.push(consumer);
                const stream = new MediaStream();
                stream.addTrack(consumer.track);

                const videoElement = document.createElement("video");
                videoElement.srcObject = stream;
                videoElement.autoplay = true;
                remoteVideoRefs.current[producerId] = videoElement;
                document.getElementById("remote-videos").appendChild(videoElement);
            });
        });
    };

    return (
        <div>
            <h1>Mediasoup Video Call</h1>
            <video ref={localVideoRef} autoPlay muted style={{ width: "400px", border: "1px solid black" }} />
            <div id="remote-videos"></div>
        </div>
    );
}
