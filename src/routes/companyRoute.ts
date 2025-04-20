import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupNewTenant } from "../database/setupNewTenant";

const router = Router();

router.post("/company", async (req: Request, res: Response): Promise<void> => {
  const { name, phone } = req.body;
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

  await setupNewTenant(company.id.toString());

  res.json({ message: "Company registered", company });
});

export default router;
