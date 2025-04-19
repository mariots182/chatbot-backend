import { Client, Message } from "whatsapp-web.js";
import { formatWelcome } from "../../utils/messageFormatter";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleWelcomeState(client: Client, message: Message, session: UserSession): Promise<UserSession> {
  await message.reply(formatWelcome());
  return { ...session, state: STATES.REGISTER_NAME };
}