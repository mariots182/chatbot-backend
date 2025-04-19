import { Client, LocalAuth } from "whatsapp-web.js";
import { handleIncomingMessage } from "./botMessageHandler";
import { setQR } from "../services/qrService";

export function initializeBot() {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-extensions",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
    },
  });

  client.on("qr", (qr) => {
    console.log("📱 QR code generated");
    setQR(qr);
  });
  // client.on("")

  client.on("ready", () => console.log("🤖 Bot ready"));
  client.on("message", (msg) => handleIncomingMessage(client, msg));
  client.initialize();
}
