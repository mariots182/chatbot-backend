import { PrismaClient as TenantPrismaClient } from "../../prisma/tenant/generated/client";
import { getTenantDatabaseUrl } from "./utils";

const clients: Record<string, TenantPrismaClient> = {};

export function getPrismaClient(tenantDbName: string): TenantPrismaClient {
  if (!clients[tenantDbName]) {
    const url = getTenantDatabaseUrl(tenantDbName);

    clients[tenantDbName] = new TenantPrismaClient({
      datasources: { db: { url } },
    });
  }

  return clients[tenantDbName];
}

export const centralPrisma = new TenantPrismaClient();
