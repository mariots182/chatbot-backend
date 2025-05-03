import { PrismaClient as CentralPrismaClient, Company } from "@prisma/client";
import { PrismaClient as TenantPrismaClient } from "../../generated/tenant";

const tenantClients: Record<string, TenantPrismaClient> = {};

export const centralPrisma = new CentralPrismaClient();

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

export const getCompanies = async (): Promise<Company[]> => {
  return await centralPrisma.company.findMany();
};

export async function getCompany(companyId: number) {
  return await centralPrisma.company.findUnique({
    where: { id: companyId },
  });
}
