import { Client, LocalAuth } from "whatsapp-web.js";
import { handleIncomingMessage } from "./botMessageHandler";
import { setQR } from "../services/qrService";

export function initializeBot() {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: { headless: true },
  });
  client.on("qr", (qr) => {
    console.log("📱 QR code generated");
    setQR(qr); // <-- Aquí se guarda para exponer por API
  });
  client.on("ready", () => console.log("🤖 Bot ready"));
  client.on("message", (msg) => handleIncomingMessage(client, msg));
  client.initialize();
}
