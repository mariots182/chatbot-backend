import { Client, Message } from "whatsapp-web.js";
import { getSession, updateSession } from "../config/sessionManager";
import { STATES } from "../config/constants";
import { handleWelcomeState } from "./states/welcomeState";
import { handleRegisterNameState } from "./states/registerNameState";
import { handleRegisterAddressState } from "./states/registerAddressState";
import { handleShowCatalogState } from "./states/showCatalogState";
import { handleSelectProductState } from "./states/selectProductState";
import { handleConfirmOrderState } from "./states/confirmOrderState";

export async function handleIncomingMessage(client: Client, message: Message) {
  const userId = message.from;
  const session = getSession(userId);
  let nextSession = session;

  switch (session.state) {
    case STATES.WELCOME:
      nextSession = await handleWelcomeState(client, message, session);
      break;
    case STATES.REGISTER_NAME:
      nextSession = await handleRegisterNameState(client, message, session);
      break;
    case STATES.REGISTER_ADDRESS:
      nextSession = await handleRegisterAddressState(client, message, session);
      break;
    case STATES.SHOW_CATALOG:
      nextSession = await handleShowCatalogState(client, message, session);
      break;
    case STATES.SELECT_PRODUCT:
      nextSession = await handleSelectProductState(client, message, session);
      break;
    case STATES.CONFIRM_ORDER:
      nextSession = await handleConfirmOrderState(client, message, session);
      break;
  }

  updateSession(userId, nextSession);
}