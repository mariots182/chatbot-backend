// // src/bot/botClientManager.ts
// import { Client, LocalAuth } from "whatsapp-web.js";
// import path from "path";
// import { handleIncomingMessage } from "./botMessageHandler";
// // import { setQR } from "../services/qrService";
// import { getPrismaClient } from "../database/prismaClientFactory";

// const clients = new Map<string, Client>();

// export async function initializeClientForCompany(
//   companyId: string
// ): Promise<void> {
//   if (clients.has(companyId)) return;

//   // cada empresa su propio directorio de sesión
//   const dataPath = path.join(process.cwd(), "sessions", companyId);

//   const client = new Client({
//     authStrategy: new LocalAuth({ clientId: companyId, dataPath }),
//     puppeteer: {
//       headless: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//       ],
//     },
//   });

//   client.on("message", (msg) => handleIncomingMessage(companyId, msg));

//   await client.initialize();
//   clients.set(companyId, client);
// }
