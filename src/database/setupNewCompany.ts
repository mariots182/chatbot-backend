import prisma from "./prismaClient";

export async function setupNewCompany(name: string, phoneContact?: string) {
  const company = await prisma.empresas.create({
    data: { nombre: name, telefono_contacto: phoneContact }
  });
  console.log("New company created:", company);
  return company;
}