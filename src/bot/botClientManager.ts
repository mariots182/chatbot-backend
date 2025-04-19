
import { Client, LocalAuth } from "whatsapp-web.js";
import { handleIncomingMessage } from "./botMessageHandler";
import path from "path";

const clients: Record<string, Client> = {};
const qrCodes: Record<string, string> = {};

export function getQRCode(companyId: string) {
  return qrCodes[companyId] || null;
}

export async function initializeClientForCompany(companyId: string): Promise<void> {
  if (clients[companyId]) return;

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: companyId,
      dataPath: path.join(__dirname, "..", "..", "sessions"),
    }),
    puppeteer: { headless: true },
  });

  client.on("qr", (qr) => {
    console.log(`📲 QR for ${companyId}:`);
    qrCodes[companyId] = qr;
  });

  client.on("ready", () => {
    console.log(`✅ WhatsApp client ready for ${companyId}`);
    delete qrCodes[companyId];
  });

  client.on("message", handleIncomingMessage);

  client.initialize();
  clients[companyId] = client;
}
