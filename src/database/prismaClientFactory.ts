// src/database/prismaClientFactory.ts
import { PrismaClient as CentralPrismaClient } from "@prisma/client";
import { PrismaClient as TenantPrismaClient } from "../generated/tenant"; // import generado

// Cliente para la DB central
export const centralPrisma = new CentralPrismaClient();

const tenantClients: Record<string, TenantPrismaClient> = {};

/**
 * Devuelve un PrismaClient para la base de datos de cada tenant.
 * Asegúrate de haber establecido process.env.TENANT_DATABASE_URL antes de llamar.
 */
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
