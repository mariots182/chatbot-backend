import { PrismaClient } from "@prisma/client";
import { getTenantDatabaseUrl } from "./utils";

const clients: Record<string, PrismaClient> = {};

/**
 * Returns a PrismaClient connected to the specified tenant DB.
 */
export function getPrismaClient(tenantId: string): PrismaClient {
  if (!clients[tenantId]) {
    const url = getTenantDatabaseUrl(tenantId);
    clients[tenantId] = new PrismaClient({
      datasources: { db: { url } },
    });
  }
  return clients[tenantId];
}

export const centralPrisma = new PrismaClient();
