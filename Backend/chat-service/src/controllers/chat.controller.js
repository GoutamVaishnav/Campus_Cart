import prisma from "../config/db.js";
import { publishEvent } from "../config/rabbitmq.js";

export const initiateChat = async (req, res) => {
  const buyer_id = req.user.id;
  const { product_id, seller_id } = req.body;

  if (!product_id || !seller_id) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (buyer_id === seller_id) {
    return res.status(400).json({ error: "Cannot chat with yourself" });
  }

  const chat = await prisma.chats.upsert({
    where: {
      buyer_id_seller_id_product_id: {
        buyer_id,
        seller_id,
        product_id,
      },
    },
    update: {},
    create: { buyer_id, seller_id, product_id },
  });

  await publishEvent({
    type: "BUY_CLICKED",
    buyer_id,
    seller_id,
    product_id,
  });

  res.json({ chat_id: chat.id });
};
