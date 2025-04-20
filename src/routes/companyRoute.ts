import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupNewTenant } from "../database/setupNewTenant";

const router = Router();

router.post("/company", async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });

    return;
  }

  const company = await centralPrisma.company.create({
    data: {
      name: name,
      database: name,
    },
  });

  if (!company) {
    res.status(500).json({ error: "Failed to create company" });

    return;
  }

  await setupNewTenant(company.id)
    .then(() => {
      console.log(`✅ Tenant setup completed for company: ${company.name}`);
    })
    .catch((error) => {
      console.error(
        `❌ Error setting up tenant for company: ${company.name}`,
        error
      );

      res.status(500).json({ error: "Failed to set up tenant" });

      return;
    });

  res.json({ message: "Company registered", company });
});

export default router;
