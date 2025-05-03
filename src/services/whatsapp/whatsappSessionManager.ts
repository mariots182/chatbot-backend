import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { setupMessageListener } from "../../bot/botMessageHandler";
import {
  centralPrisma,
  getCompanies,
} from "../../database/prismaClientFactory";
import { Company } from "@prisma/client";

const sessions: Map<string, Client> = new Map();
const sessionsPath = path.join(__dirname, "../../../sessions");

export class WhatsappSessionManager {
  static async getOrCreateClient(companyId: string): Promise<Client> {
    console.log(
      `🧩 [WhatsappSessionManager][getOrCreateClient] sessions: ${sessions.size}`
    );

    if (sessions.has(companyId)) {
      console.log(
        `✅ [WhatsappSessionManager][getOrCreateClient] Client already initialized for ${companyId}`
      );

      return sessions.get(companyId)!;
    }

    const companySessionFolder = path.join(sessionsPath, companyId);
    if (!fs.existsSync(companySessionFolder)) {
      console.warn(
        `⚠️ [WhatsappSessionManager][getOrCreateClient] No session folder for company ${companyId}. Creating it for first-time QR scan.`
      );

      // Crea la carpeta vacía, listo para generar QR después
      fs.mkdirSync(companySessionFolder, { recursive: true });
    }

    console.log(
      `⚡ [WhatsappSessionManager][getOrCreateClient] Initializing new client for ${companyId}`
    );

    const client = new Client({
      authStrategy: new LocalAuth({
        // clientId: companyId,
        dataPath: path.join(__dirname, "../../../sessions", companyId), // <== CAMBIO CLAVE
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
    });

    const companies = await getCompanies();
    const validCompanyIds = companies.map((c) => c.id.toString());
    const existingFolders = fs.existsSync(sessionsPath)
      ? fs.readdirSync(sessionsPath)
      : [];

    for (const folder of existingFolders) {
      if (!validCompanyIds.includes(folder)) {
        const fullPath = path.join(sessionsPath, folder);
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🧹 Removed orphaned session folder: ${folder}`);
      }
    }
    client.on("ready", () => {
      console.log(
        `✅ [WhatsappSessionManager][getOrCreateClient] Client ready for ${companyId}`
      );
    });

    client.on("auth_failure", (msg) => {
      console.error(
        `❌ [WhatsappSessionManager][getOrCreateClient] Auth failure for ${companyId}:`,
        msg
      );
    });

    client.on("disconnected", (reason) => {
      console.warn(
        `⚠️ [WhatsappSessionManager][getOrCreateClient] Disconnected ${companyId}:`,
        reason
      );
      sessions.delete(companyId);
    });

    await client.initialize();

    console.log(
      `✅ [WhatsappSessionManager][getOrCreateClient] Client initialized for ${companyId}`
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
          `🧩 [WhatsappSessionManager][generateQRCode] QR generated for ${companyId}`
        );

        if (client.info) {
          console.log(
            `[WhatsappSessionManager][generateQRCode] Ignoring QR: client already authenticated`
          );
          return;
        }

        if (!qr || typeof qr !== "string" || qr.trim() === "") {
          throw new Error("Invalid QR data received");
        }

        const base64 = await qrcode.toDataURL(qr);

        resolve(base64);
      });

      client.on("ready", () => {
        console.log(
          `✅ [WhatsappSessionManager][generateQRCode] Client already authenticated for ${companyId}`
        );
        if (client.pupPage) {
          return client.emit("qr", client.pupPage);
        }
      });
    });
  }

  static async loadSessions() {
    console.log(
      `🧩 [WhatsappSessionManager][loadSessions] Checking sessions in ${sessionsPath}`
    );

    const companies = await centralPrisma.company.findMany();
    // const validCompanyIds = companies.map((c) => c.id);
    // const existingFolders = fs.existsSync(sessionsPath)
    //   ? fs.readdirSync(sessionsPath)
    //   : [];

    // console.log(
    //   `🧩 [WhatsappSessionManager][loadSessions] Existing folders: ${existingFolders}`
    // );
    // console.log(
    //   `🧩 [WhatsappSessionManager][loadSessions] Valid company IDs: ${validCompanyIds}`
    // );

    // for (const folder of existingFolders) {
    //   console.log(
    //     `🧩 [WhatsappSessionManager][loadSessions] Checking folder: ${folder}`
    //   );

    //   if (!validCompanyIds.includes(Number(folder))) {
    //     const fullPath = path.join(sessionsPath, folder);

    //     fs.rmSync(fullPath, { recursive: true, force: true });

    //     console.log(
    //       `🧹 [WhatsappSessionManager][loadSessions] Removed orphaned session folder: ${folder}`
    //     );
    //   }
    // }

    for (const company of companies) {
      try {
        console.log(
          `🧩 [WhatsappSessionManager][loadSessions] Loading session for company ${company.id}`
        );

        // const client = await this.getOrCreateClient(company.id.toString());

        this.getOrCreateClient(company.id.toString());

        console.log(
          `✅ [WhatsappSessionManager][loadSessions] Session ready for company ${company.id}`
        );
      } catch (err) {
        console.error(
          `❌ [WhatsappSessionManager][loadSessions] Failed to initialize session for ${company.id}:`,
          err
        );
      }
    }
  }

  static startListening(client: Client, company: Company) {
    console.log(
      `🧩 [WhatsappSessionManager][startListening] Starting listening for company ${company.id}`
    );

    setupMessageListener(client, company);
  }

  static async startAllBots() {
    console.log(
      `🧩 [WhatsappSessionManager][startAllBots] Starting all bots for ${sessions.size} companies`
    );

    console.log(
      `🧩 [WhatsappSessionManager][startAllBots] Loading sessions from database, ${sessions}`
    );

    await this.loadSessions();

    if (sessions.size === 0) {
      console.warn(
        `⚠️ [WhatsappSessionManager][startAllBots] No sessions found. Please initialize clients first.`
      );

      return;
    }

    for (let [companyId, client] of sessions) {
      console.log(
        `🧩 [WhatsappSessionManager][startAllBots] Starting bot for company ${companyId}`
      );

      const company = await centralPrisma.company.findUnique({
        where: { id: Number(companyId) },
      });

      if (!company) {
        console.error(
          `❌ [WhatsappSessionManager][startAllBots] Company with ID ${companyId} not found`
        );

        throw new Error(
          `❌ [WhatsappSessionManager][startAllBots] Company with ID ${companyId} not found`
        );
      }

      console.log(
        `🧩 [WhatsappSessionManager][startAllBots] Company found ID: ${company.id}, Name: ${company.name}, Database: ${company.database} `
      );

      this.startListening(client, company);
    }
  }
}
