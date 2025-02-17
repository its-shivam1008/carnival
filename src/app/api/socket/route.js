import { Server } from "socket.io";
import { createWorker } from "mediasoup";
import {NextResponse} from "next/server";

let io;
let worker;
let router;
let transports = [];
let producers = [];
let consumers = [];

const startMediasoup = async () => {
  if (!worker) {
    worker = await createWorker();
    router = await worker.createRouter({
      mediaCodecs: [
        { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
        { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
      ],
    });
    console.log("Mediasoup Router initialized.");
  }
};

export const GET = (req, { res }) => {
  if (!NextResponse.socket.server.io) {
    console.log("Starting Socket.io server...");
    io = new Server(NextResponse.socket.server);
    NextResponse.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Create WebRTC Transport
      socket.on("createTransport", async (_, callback) => {
        const transport = await router.createWebRtcTransport({
          listenIps: [{ ip: "0.0.0.0", announcedIp: "your-public-ip" }],
          enableUdp: true,
          enableTcp: true,
        });

        transports.push({ socketId: socket.id, transport });

        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
      });

      // Handle Producer (sending media)
      socket.on("produce", async ({ transportId, kind, rtpParameters }, callback) => {
        const transport = transports.find((t) => t.transport.id === transportId).transport;
        const producer = await transport.produce({ kind, rtpParameters });

        producers.push({ socketId: socket.id, producer });

        callback({ id: producer.id });
      });

      // Handle Consumer (receiving media)
      socket.on("consume", async ({ producerId, rtpCapabilities }, callback) => {
        if (!router.canConsume({ producerId, rtpCapabilities })) {
          return callback({ error: "Cannot consume" });
        }

        const transport = transports.find((t) => t.socketId === socket.id).transport;
        const consumer = await transport.consume({ producerId, rtpCapabilities });

        consumers.push({ socketId: socket.id, consumer });

        callback({
          id: consumer.id,
          producerId: producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  NextResponse.end();
};

// Start Mediasoup Worker
startMediasoup();

// export default ioHandler;
