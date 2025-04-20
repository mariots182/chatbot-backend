import { PrismaClient as CentralPrismaClient } from "@prisma/client";
import { PrismaClient as TenantPrismaClient } from "../generated/tenant"; // import generado

export const centralPrisma = new CentralPrismaClient();

const tenantClients: Record<string, TenantPrismaClient> = {};

export function getPrismaClient(databaseName: string): TenantPrismaClient {
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
