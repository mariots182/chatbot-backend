import { PrismaClient as TenantPrismaClient } from "../../prisma/tenant/generated/client";
import { getTenantDatabaseUrl } from "./utils";
import { PrismaClient } from "@prisma/client";

const clients: Record<string, TenantPrismaClient> = {};

export function getPrismaClient(tenantDbName: string): TenantPrismaClient {
  if (!clients[tenantDbName]) {
    const url = getTenantDatabaseUrl(tenantDbName);

    clients[tenantDbName] = new TenantPrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres:M4r10182@localhost:5432/${tenantDbName}`,
        },
      },
    });
  }

  return clients[tenantDbName];
}

export const centralPrisma = new PrismaClient();
