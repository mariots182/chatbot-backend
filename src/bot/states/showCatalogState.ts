import { Client, Message } from "whatsapp-web.js";
import { getCatalog } from "../../config/catalog";
import { STATES } from "../../config/constants";
import { UserSession } from "../../types";

export async function handleShowCatalogState(client: Client, message: Message, session: UserSession): Promise<UserSession> {
  const catalog = getCatalog("default");
  const text = catalog.map((c, i) => `${i+1}. ${c.name} - $${c.price}`).join("\n");
  await message.reply("🛒 Catálogo:\n" + text);
  return { ...session, state: STATES.SELECT_PRODUCT, cart: [] };
}