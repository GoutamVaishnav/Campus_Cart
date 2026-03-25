import amqp from "amqplib";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const start = async () => {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue("buy_events");

  channel.consume("buy_events", async (msg) => {
    const data = JSON.parse(msg.content.toString());

    const exists = await prisma.buy_notifications.findFirst({
      where: {
        buyer_id: data.buyer_id,
        product_id: data.product_id,
      },
    });

    if (!exists) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "seller@email.com",
        subject: "New Buyer Interested",
        text: `Buyer ${data.buyer_id} is interested in your product`,
      });

      await prisma.buy_notifications.create({
        data,
      });
    }

    channel.ack(msg);
  });
};

start();
