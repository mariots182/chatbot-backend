import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupCompanySession, fetchQR } from "../services/qrService";

const router = Router();

router.post(
  "/session/:tenantName",
  async (req: Request, res: Response): Promise<void> => {
    const { tenantName } = req.params;

    const company = await centralPrisma.company.create({
      data: {
        name: tenantName,
        database: tenantName,
      },
    });

    const tenantId = company.id;

    const tenant = await centralPrisma.company.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      res.status(404).json({ error: "Tenant not registered" });
      return;
    }
    // Init WhatsApp session
    await setupCompanySession(tenantName);
    res.json({ message: `📲 Session setup started for ${tenant.name}` });
  }
);

router.get(
  "/qr/:tenantId",
  async (req: Request, res: Response): Promise<void> => {
    const { tenantId } = req.params;
    const qr = fetchQR(tenantId);
    if (!qr) {
      res.status(404).json({ error: "No QR available" });
      return;
    }
    res.json({ qr });
  }
);

export default router;
