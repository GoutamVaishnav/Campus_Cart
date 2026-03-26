import { Server } from "socket.io";
import redis from "../config/redis.js";
import prisma from "../config/db.js";
import { verifySocket } from "../middleware/auth.middleware.js";

export default function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = verifySocket(token);
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    redis.hset("online_users", userId, socket.id);

    socket.on("send_message", async ({ chat_id, text }) => {
      const msg = await prisma.messages.create({
        data: {
          chat_id,
          sender_id: userId,
          text,
        },
      });

      const chat = await prisma.chats.findUnique({
        where: { id: chat_id },
      });

      const receiver =
        chat.buyer_id === userId ? chat.seller_id : chat.buyer_id;

      const receiverSocket = await redis.hget("online_users", receiver);

      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", msg);

        await prisma.messages.update({
          where: { id: msg.id },
          data: {
            is_delivered: true,
            delivered_at: new Date(),
          },
        });
      }

      socket.emit("message_sent", msg);
    });

    socket.on("mark_seen", async ({ chat_id }) => {
      await prisma.messages.updateMany({
        where: {
          chat_id,
          sender_id: { not: userId },
        },
        data: {
          is_seen: true,
          seen_at: new Date(),
        },
      });

      socket.broadcast.emit("message_seen", { chat_id });
    });

    socket.on("disconnect", () => {
      redis.hdel("online_users", userId);
    });
  });
}
