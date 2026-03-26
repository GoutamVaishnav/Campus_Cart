import amqp from "amqplib";

let channel;

export const initRabbit = async () => {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  channel = await conn.createChannel();
  await channel.assertQueue("buy_events");
};

export const publishEvent = async (data) => {
  channel.sendToQueue("buy_events", Buffer.from(JSON.stringify(data)));
};
