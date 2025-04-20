import { centralPrisma } from "../database/prismaClientFactory";

export async function setupNewCompany(name: string, database: string) {
  const company = await centralPrisma.company.create({
    data: { name, database },
  });

  console.log("New company created:", company);

  return company;
}
