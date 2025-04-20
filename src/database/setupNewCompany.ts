import { centralPrisma as prisma } from "./prismaClientFactory";

export async function setupNewCompany(
  companyName: string,
  generatedDbName: string
) {
  const company = await prisma.company.create({
    data: {
      name: companyName,
      database: generatedDbName,
    },
  });

  console.log("New company created:", company);

  return company;
}
