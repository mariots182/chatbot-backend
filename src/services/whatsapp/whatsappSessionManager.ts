import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { setupMessageListener } from "../../bot/botMessageHandler";
import { centralPrisma } from "../../database/prismaClientFactory";
import { Company } from "@prisma/client";

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

    console.log(
      `✅ [WhatsappSessionManager] Client initialized for ${companyId}`
    );

    sessions.set(companyId, client);

    return client;
  }

  static async generateQRCode(companyId: string): Promise<string> {
    const client = await this.getOrCreateClient(companyId);

    return new Promise((resolve, reject) => {
      if (client.info && client.info.wid) {
        client.emit("qr", client.info.wid);
      }

      client.on("qr", async (qr) => {
        console.log(
          `🧩 [WhatsappSessionManager] QR generated for ${companyId}`
        );

        if (!qr || typeof qr !== "string" || qr.trim() === "") {
          throw new Error("Invalid QR data received");
        }

        const base64 = await qrcode.toDataURL(qr);

        resolve(base64);
      });

      client.on("ready", () => {
        console.log(
          `✅ [WhatsappSessionManager] Client already authenticated for ${companyId}`
        );
        if (client.pupPage) {
          return client.emit("qr", client.pupPage);
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

  static startListening(client: Client, company: Company) {
    setupMessageListener(client, company);
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

      const company = await centralPrisma.company.findUnique({
        where: { id: Number(companyId) },
      });

      if (!company) {
        console.error(
          `❌ [WhatsappSessionManager] Company with ID ${companyId} not found`
        );

        throw new Error(
          `❌ [WhatsappSessionManager] Company with ID ${companyId} not found`
        );
      }

      console.log(
        `🧩 [WhatsappSessionManager] Company found ID: ${company.id}, Name: ${company.name}, Database: ${company.database} `
      );

      this.startListening(client, company);
    }
  }
}
