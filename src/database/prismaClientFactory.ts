import { PrismaClient as CentralPrismaClient } from "@prisma/client";
import { PrismaClient as TenantPrismaClient } from "../../generated/tenant";

export const centralPrisma = new CentralPrismaClient();

const tenantClients: Record<string, TenantPrismaClient> = {};

export function getPrismaClient(databaseName: string): TenantPrismaClient {
  console.log(
    `🏗️ [getPrismaClient] Creating new tenant client for database: ${databaseName}`
  );

  if (!tenantClients[databaseName]) {
    const url = process.env.TENANT_DATABASE_URL!.replace(
      "<DB_NAME>",
      databaseName
    );

    tenantClients[databaseName] = new TenantPrismaClient({
      datasources: { db: { url } },
    });
  }
  return tenantClients[databaseName];
}
