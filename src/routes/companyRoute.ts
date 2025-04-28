import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupNewTenant } from "../database/setupNewTenant";
import { NewCompany } from "../types";

const router = Router();

router.post("/company", async (req: Request, res: Response): Promise<void> => {
  const {
    name,
    database,
    phoneWhatsapp,
    ownerName,
    ownerPhone,
    ownerEmail,
    contactName,
    contactPhone,
    contactEmail,
    address,
    rfc,
    subscriptionType,
    subscriptionEndDate,
  }: NewCompany = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });

    return;
  }

  const company = await centralPrisma.company.create({
    data: {
      name: name,
      database: name.replace(/[^a-zA-Z0-9_]/g, "_"),
    },
  });

  if (!company) {
    res.status(500).json({ error: "Failed to create company" });

    return;
  }

  await setupNewTenant(company)
    .then(() => {
      console.log(
        `✅ [companyRoute] Tenant setup completed for company: ${company.name}`
      );
      res.json({ message: "Company registered", company });
    })
    .catch((error) => {
      console.error(
        `❌ [companyRoute] Error setting up tenant for company: ${company.name}`,
        error
      );

      res.status(500).json({ error: "Failed to set up tenant" });

      return;
    });
});

export default router;
