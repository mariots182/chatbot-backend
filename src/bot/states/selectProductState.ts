import { Client, Message } from "whatsapp-web.js";
import { STATES } from "../../config/constants";
import { UserSession, CatalogItem } from "../../types";

export async function handleSelectProductState(client: Client, message: Message, session: UserSession): Promise<UserSession> {
  const idx = parseInt(message.body.trim(), 10) - 1;
  const catalog = session.cart as CatalogItem[]; // using catalog in session
  const product = catalog[idx];
  await message.reply(`🧾 Confirmas producto: ${product.name}?`);
  return { ...session, state: STATES.CONFIRM_ORDER, cart: [product] };
}