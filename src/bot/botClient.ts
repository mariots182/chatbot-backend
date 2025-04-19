import { Client, LocalAuth } from "whatsapp-web.js";
import { handleIncomingMessage } from "./botMessageHandler";

export function initializeBot() {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: { headless: true },
  });

  client.on("ready", () => console.log("🤖 Bot ready"));
  client.on("message", msg => handleIncomingMessage(client, msg));
  client.initialize();
}