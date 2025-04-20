import { Client, Message } from "whatsapp-web.js";
import { getPrismaClient } from "../../database/prismaClientFactory";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleConfirmOrderState(
  client: Client,
  message: Message,
  session: UserSession,
  tenantDbName: string
): Promise<UserSession> {
  const confirm = message.body.trim().toLowerCase();
  const phone = message.from;

  if (confirm === "sí" || confirm === "si") {
    const item = session.cart![0];

    const prisma = getPrismaClient(tenantDbName); // tenantDbName debe pasarse como parámetro

    await prisma.order.create({
      data: {
        customer: { connect: { id: parseInt(session.userId) } },
        quantity: 1,
        // : item.item.name,
      },
    });
    await message.reply("✅ Pedido confirmado. Gracias.");
  } else {
    await message.reply("🚫 Pedido cancelado.");
  }
  return { ...session, state: STATES.WELCOME, cart: [] };
}
