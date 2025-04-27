import { Client, Message } from "whatsapp-web.js";
import { getSession, updateSession } from "../config/sessionManager";
import { STATES } from "../config/constants";
import { handleWelcomeState } from "./states/welcomeState";
import { handleRegisterNameState } from "./states/registerNameState";
import { handleRegisterAddressState } from "./states/registerAddressState";
import { handleShowCatalogState } from "./states/showCatalogState";
import { handleSelectProductState } from "./states/selectProductState";
import { handleConfirmOrderState } from "./states/confirmOrderState";
import {
  centralPrisma,
  getPrismaClient,
} from "../database/prismaClientFactory";

export const setupMessageListener = (client: Client, companyId: string) => {
  client.on("message", (message) => {
    handleIncomingMessage(client, message, companyId);
  });
};

export async function handleIncomingMessage(
  client: Client,
  msg: Message,
  companyId: string
) {
  console.log(
    `[handleIncomingMessage] Received message for client ${client} :`,
    msg.body
  );

  const company = await centralPrisma.company.findUnique({
    where: { id: Number(companyId) },
  });

  if (!company) {
    console.error(
      `❌ [handleIncomingMessage] Company not found for ID ${companyId}`
    );
    return;
  }
  console.log(`🧩 [handleIncomingMessage] Existing client ${companyId}`);
  console.log(`🧩 [handleIncomingMessage] Company name ${company.name}`);
  console.log(
    `🧩 [handleIncomingMessage] Company database ${company.database}`
  );

  const prisma = getPrismaClient(company.database);

  const phone = msg.from.split("@")[0];

  //como hacer una sesion para cada usuario y manejar la conversacion por estados
  // let nextSession = session;

  // switch (session.state) {
  //   case STATES.WELCOME:
  //     nextSession = await handleWelcomeState(client, message, session);
  //     break;
  //   case STATES.REGISTER_NAME:
  //     nextSession = await handleRegisterNameState(client, message, session);
  //     break;
  //   case STATES.REGISTER_ADDRESS:
  //     nextSession = await handleRegisterAddressState(client, message, session);
  //     break;
  //   case STATES.SHOW_CATALOG:
  //     nextSession = await handleShowCatalogState(client, message, session);
  //     break;
  //   case STATES.SELECT_PRODUCT:
  //     nextSession = await handleSelectProductState(client, message, session);
  //     break;
  //   case STATES.CONFIRM_ORDER:
  //     nextSession = await handleConfirmOrderState(client, message, session);
  //     break;
  // }
  // updateSession(userId, nextSession);
}
