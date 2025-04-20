import { Client, Message } from "whatsapp-web.js";
import { getPrismaClient } from "../../database/prismaClientFactory";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleRegisterAddressState(
  client: Client,
  message: Message,
  session: UserSession,
  companyDbName: string
): Promise<UserSession> {
  process.env.TENANT_DATABASE_URL = process.env.TENANT_DATABASE_URL!.replace(
    "<DB_NAME>",
    companyDbName
  );

  const address = message.body.trim();
  const phone = message.from;
  const prisma = getPrismaClient(companyDbName);

  const existing = await prisma.customer.findUnique({ where: { phone } });

  if (!existing) {
    await prisma.customer.create({
      data: {
        name: session.name!,
        address: address,
        phone: phone,
      },
    });
  }

  await prisma.customer.create({
    data: {
      name: session.name!,
      address: address,
      phone: phone,
    },
  });

  await client.sendMessage(
    message.from,
    "✅ Datos registrados. Ahora muestro catálogo."
  );

  return { ...session, state: STATES.SHOW_CATALOG, address };
}
