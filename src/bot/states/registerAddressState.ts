import { Client, Message } from "whatsapp-web.js";
import { getPrismaClient } from "../../database/prismaClientFactory";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleRegisterAddressState(
  client: Client,
  message: Message,
  session: UserSession,
  companyId: string
): Promise<UserSession> {
  const address = message.body.trim();
  const phone = message.from;
  const prisma = getPrismaClient(companyId);

  await prisma.customer.create({
    where: { phone: { telefono: phone, empresa_id: 1 } },
    update: { nombre: session.name!, direccion: address },
    create: {
      nombre: session.name!,
      direccion: address,
      telefono: phone,
      empresa_id: 1,
    },
  });
  await message.reply("✅ Datos registrados. Ahora muestro catálogo.");
  return { ...session, state: STATES.SHOW_CATALOG, address };
}
