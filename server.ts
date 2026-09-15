import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { prisma } from "./db/db";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "0.0.0.0";
const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const expo = new Expo();

async function sendPushNotification(
  cid: string,
  senderId: string,
  text: string,
) {
  const convo = await prisma.conversation.findUnique({
    where: { cid: cid },
    select: {
      buyerId: true,
      sellerId: true,
      listing: {
        select: {
          title: true,
          price: true,
        },
      },
      buyer: {
        select: { name: true, pushToken: { select: { token: true } } },
      },
      seller: {
        select: { name: true, pushToken: { select: { token: true } } },
      },
    },
  });

  if (!convo) return;

  const isSenderBuyer = senderId === convo.buyerId;
  const recipient = isSenderBuyer ? convo.seller : convo.buyer;
  const senderName = isSenderBuyer ? convo.buyer?.name : convo.seller?.name;
  const pushToken = recipient?.pushToken?.token;

  if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;

  const message: ExpoPushMessage = {
    to: pushToken,
    sound: "default",
    title: `You got a message from ${senderName}.`,
    subtitle: `${convo?.listing?.title} | ${convo?.listing?.price}`,

    body: text.length > 80 ? text.slice(0, 77) + "…" : text,
    data: { screen: "convos", conversationId: cid },
    channelId: "convos",
  };

  await expo.sendPushNotificationsAsync([message]);
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const allowedOrigins = dev
      ? ["http://localhost:3001"]
      : [
          "https://app.market-quad.com",
          "https://market-quad.com",
          "https://web.market-quad.com",
        ];

    res.setHeader("Access-Control-Allow-Origin", [
      "https://app.market-quad.com",
      "https://market-quad.com",
      "https://web.market-quad.com",
      dev ? "http://localhost:3001" : "",
    ]);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-cloud-folder",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    handler(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: dev
        ? ["http://localhost:3001"]
        : [
            "https://app.market-quad.com",
            "https://market-quad.com",
            "https://web.market-quad.com",
          ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected", socket.id);
    socket.data.activeCid = null;
    socket.on("open-convo", ({ cid }) => {
      if (socket.data.activeCid) {
        socket.leave(socket.data.activeCid);
      }
      socket.join(cid);
      socket.data.activeCid = cid;
      socket.to(cid).emit("user_connected");
    });

    socket.on("typing", ({ cid, typing }) => {
      if (socket.data.activeCid !== cid) return;
      socket.to(cid).emit("typing", { cid, typing });
    });

    socket.on("message", async ({ cid, message }) => {
      socket.to(cid).emit("message", { sender: "chat", message });

      const room = io.sockets.adapter.rooms.get(cid);
      const recipientIsActive = room && room.size > 1;

      if (!recipientIsActive && message.senderId) {
        await sendPushNotification(cid, message.senderId, message.text).catch(
          (err) => console.error("Push failed:", err),
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
