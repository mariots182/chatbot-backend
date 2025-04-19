import { Client, Message } from "whatsapp-web.js";
import prisma from "../../database/prismaClient";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleConfirmOrderState(
  client: Client,
  message: Message,
  session: UserSession
): Promise<UserSession> {
  const confirm = message.body.trim().toLowerCase();
  const phone = message.from;
  if (confirm === "sí" || confirm === "si") {
    const item = session.cart![0];
    await prisma.pedidos.create({
      data: {
        clientes: { connect: { id: parseInt(session.userId) } },
        cantidad: 1,
        observaciones: item.item.name,
      },
    });
    await message.reply("✅ Pedido confirmado. Gracias.");
  } else {
    await message.reply("🚫 Pedido cancelado.");
  }
  return { ...session, state: STATES.WELCOME, cart: [] };
}
