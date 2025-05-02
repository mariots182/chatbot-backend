import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { setupMessageListener } from "../../bot/botMessageHandler";
import { centralPrisma } from "../../database/prismaClientFactory";
import { Company } from "@prisma/client";

const sessions: Map<string, Client> = new Map();
const sessionsPath = path.join(__dirname, "../../../sessions");

export class WhatsappSessionManager {
  static getSessionPath(companyId: string): string {
    if (!companyId) {
      console.error(
        `❌ [WhatsappSessionManager] Company ID is required to get session path`
      );

      // throw new Error("Company ID is required to get session path");
    }

    console.log(
      `🧩 [WhatsappSessionManager] Getting session path for company ID: ${companyId}`
    );

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
        dataPath: sessionsPath, // <== CAMBIO CLAVE
      }),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
    });

    // const existingFolders = fs.existsSync(sessionsPath)
    //   ? fs.readdirSync(sessionsPath)
    //   : [];

    // for (const folder of existingFolders) {
    //   if (!validCompanyIds.includes(Number(folder))) {
    //     const fullPath = path.join(sessionsPath, folder);
    //     fs.rmSync(fullPath, { recursive: true, force: true });
    //     console.log(`🧹 Removed orphaned session folder: ${folder}`);
    //   }
    // }

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
    console.log(
      `🧩 [WhatsappSessionManager] Checking sessions in ${sessionsPath}`
    );

    const companies = await centralPrisma.company.findMany();
    const validCompanyIds = companies.map((c) => c.id);
    const validCompanyDBName = companies.map((c) => c.database);

    const existingFolders = fs.existsSync(sessionsPath)
      ? fs.readdirSync(sessionsPath)
      : [];

    // 🔥 LIMPIA CARPETAS HUÉRFANAS
    for (const folder of existingFolders) {
      if (
        !validCompanyIds.includes(Number(folder)) ||
        !validCompanyDBName.includes(folder)
      ) {
        const fullPath = path.join(sessionsPath, folder);
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(
          `🧹 [WhatsappSessionManager] Removed orphaned session folder: ${folder}`
        );
      }
    }

    // ✅ CARGAR SOLO SESIONES VÁLIDAS
    for (const companyId of validCompanyIds) {
      const companySessionPath = path.join(sessionsPath, String(companyId));
      if (!fs.existsSync(companySessionPath)) {
        console.warn(
          `⚠️ [WhatsappSessionManager] Skipping session for ${companyId}, no folder found`
        );
        continue;
      }

      console.log(
        `🟢 [WhatsappSessionManager] Initializing session for ${companyId}`
      );

      const client = new Client({
        authStrategy: new LocalAuth({
          clientId: String(companyId),
          dataPath: sessionsPath,
        }),
        puppeteer: { headless: true, args: ["--no-sandbox"] },
      });

      await client.initialize();

      // TODO: Store client in sessions map
    }
  }

  static startListening(client: Client, company: Company) {
    console.log(
      `🧩 [WhatsappSessionManager] Starting listening for company ${company.id}`
    );

    setupMessageListener(client, company);
  }

  static async startAllBots() {
    console.log(
      `🧩 [WhatsappSessionManager] Starting all bots for ${sessions.size} companies`
    );

    console.log(
      `🧩 [WhatsappSessionManager] Loading sessions from database, ${sessions}`
    );

    if (sessions.size === 0) {
      console.warn(
        `⚠️ [WhatsappSessionManager] No sessions found. Please initialize clients first.`
      );

      return;
    }

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
