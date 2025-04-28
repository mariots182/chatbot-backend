import { Client, Message } from "whatsapp-web.js";
import { getSession, setSession } from "../config/sessionManager";
import { STATES } from "../config/constants";
import { handleWelcomeState } from "./states/welcomeState";
import { handleRegisterNameState } from "./states/registerNameState";
import { handleRegisterAddressState } from "./states/registerAddressState";
import { handleShowCatalogState } from "./states/showCatalogState";
import { handleSelectProductState } from "./states/selectProductState";
import { handleConfirmOrderState } from "./states/confirmOrderState";
import { UserSession } from "../types";
import { Company } from "@prisma/client";

export const setupMessageListener = (client: Client, company: Company) => {
  console.log(
    `🧩 [botMessageHandler] Listening for messages for company ${company.name}`
  );
  client.on("message", (message) => {
    handleIncomingMessage(client, message, company);
  });
};

export async function handleIncomingMessage(
  client: Client,
  msg: Message,
  company: Company
) {
  console.log(
    `🧩 [botMessageHandler] Received message for client ${msg.from} :`,
    msg.body
  );

  const phone = msg.from.split("@")[0];

  const user: UserSession = {
    userId: phone,
    state: STATES.WELCOME,
    lastActivity: Date.now(),
    data: {},
  };

  // setSession(String(company.id), user);

  let session = await getSession(String(company.id), phone);

  console.log(
    `🧩 [botMessageHandler] Session loaded for ${phone} under company ${company.name}, state: ${session.state}`
  );

  switch (session.state) {
    case STATES.WELCOME:
      session = await handleWelcomeState(client, msg, session);
      break;
    case STATES.REGISTER_NAME:
      session = await handleRegisterNameState(client, msg, session);
      break;
    // case STATES.REGISTER_ADDRESS:
    //   session = await handleRegisterAddressState(client, msg, session);
    //   break;
    case STATES.SHOW_CATALOG:
      session = await handleShowCatalogState(client, msg, session);
      break;
    case STATES.SELECT_PRODUCT:
      session = await handleSelectProductState(client, msg, session);
      break;
    // case STATES.CONFIRM_ORDER:
    //   session = await handleConfirmOrderState(client, msg, session);
    //   break;
  }
  // updateSession(userId, nextSession);
}
