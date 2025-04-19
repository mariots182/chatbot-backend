import { centralPrisma as prisma } from "./prismaClientFactory";

export async function setupNewCompany(name: string, phoneContact?: string) {
  const company = await prisma.company.create({
    data: { name: name, phone: phoneContact },
  });
  console.log("New company created:", company);
  return company;
}
