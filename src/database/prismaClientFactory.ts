import { PrismaClient } from "@prisma/client";
import { getTenantDatabaseUrl } from "./utils";

const clients: Record<string, PrismaClient> = {};

export function getPrismaClient(tenantDbName: string): PrismaClient {
  if (!clients[tenantDbName]) {
    const url = getTenantDatabaseUrl(tenantDbName);

    clients[tenantDbName] = new PrismaClient({
      datasources: { db: { url } },
    });
  }

  return clients[tenantDbName];
}

export const centralPrisma = new PrismaClient();
