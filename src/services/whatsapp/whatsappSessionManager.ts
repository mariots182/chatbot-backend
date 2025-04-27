// Crear y recuperar sesiones

// Generar QR si no hay sesión

// Guardar en disco la sesión (persistencia)

import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";

const sessions: Map<string, Client> = new Map();

export class WhatsappSessionManager {
  static getSessionPath(companyId: string): string {
    return path.join(__dirname, "../../../sessions", companyId);
  }

  static async getOrCreateClient(companyId: string): Promise<Client> {
    if (sessions.has(companyId)) {
      console.log(
        `✅ [WhatsappSessionManager] Client already initialized for ${companyId}`
      );

      return sessions.get(companyId)!;
    }

    console.log(
      `⚡ [WhatsappSessionManager] Initializing new client for ${companyId}`
    );

    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: companyId,
        dataPath: this.getSessionPath(companyId),
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
    });

    client.on("ready", () => {
      console.log(`✅ [WhatsappSessionManager] Client ready for ${companyId}`);
    });

    client.on("auth_failure", (msg) => {
      console.error(
        `❌ [WhatsappSessionManager] Auth failure for ${companyId}:`,
        msg
      );
    });

    client.on("disconnected", (reason) => {
      console.warn(
        `⚠️ [WhatsappSessionManager] Disconnected ${companyId}:`,
        reason
      );
      sessions.delete(companyId);
    });

    await client.initialize();
    sessions.set(companyId, client);

    return client;
  }

  static async generateQRCode(companyId: string): Promise<string> {
    const client = await this.getOrCreateClient(companyId);

    return new Promise((resolve, reject) => {
      if (client.info && client.info.wid) {
        // Generamos un nuevo QR solo si la sesión está lista
        client.emit("qr", client.info.wid); // Emite el QR para ese cliente
      }

      client.on("qr", async (qr) => {
        console.log(
          `🧩 [WhatsappSessionManager] QR generated for ${companyId}`
        );

        const base64 = await qrcode.toDataURL(qr);

        resolve(base64);
      });

      client.on("ready", () => {
        console.log(
          `✅ [WhatsappSessionManager] Client already authenticated for ${companyId}`
        );
        if (client.pupPage) {
          return client.emit("qr", client.pupPage); // Emite el QR para ese cliente
          // resolve(client.emit("qr", client.pupPage)); // Resolvemos con el QR de la sesión activa
        }
      });
    });
  }

  static async loadSessions() {
    const sessionsPath = path.join(__dirname, "../../../sessions");
    const directories = fs.readdirSync(sessionsPath);

    for (const dir of directories) {
      const companyId = dir;
      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: companyId,
          dataPath: path.join(sessionsPath, companyId),
        }),
        puppeteer: { headless: true, args: ["--no-sandbox"] },
      });
      await client.initialize();
      sessions.set(companyId, client);
    }
  }

  static startListening(client: Client, companyId: string) {
    // aqui debe ir la logica de botMessageHandler.ts
    // se debe pasar el session de cada bot por empresa para manejar el estado de cada numero escrito

    console.log(
      `🧩 [WhatsappSessionManager] Listening for messages for ${companyId}`
    );

    // ESTO SE ELIMINA???
    //  client.on("message", (message) => {
    //    console.log(
    //      `📩 [WhatsappSessionManager] New message from ${message.from}: ${message.body}`
    //    );
    //    if (message.body.toLowerCase() === "start") {
    //      message.reply("¡Hola! ¿Cómo puedo ayudarte hoy?");
    //    } else if (message.body.toLowerCase() === "order") {
    //      message.reply("¿Qué producto te gustaría pedir?");
    //    }
    //  });
  }

  static async startAllBots() {
    console.log(
      `🧩 [WhatsappSessionManager] Starting all bots for ${sessions.size} companies`
    );
    await this.loadSessions();

    for (let [companyId, client] of sessions) {
      console.log(
        `🧩 [WhatsappSessionManager] Starting bot for company ${companyId}`
      );

      this.startListening(client, companyId);
    }
  }
}
