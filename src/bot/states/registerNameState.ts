import { Client, Message } from "whatsapp-web.js";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleRegisterNameState(client: Client, message: Message, session: UserSession): Promise<UserSession> {
  const name = message.body.trim();
  await message.reply("🙌 ¡Gracias! Ahora envía tu dirección.");
  return { ...session, state: STATES.REGISTER_ADDRESS, name };
}