import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupCompanySession, fetchQR } from "../services/qrService";

const router = Router();

router.post(
  "/session/:tenantId",
  async (req: Request, res: Response): Promise<void> => {
    const { tenantId } = req.params;
    // Validate in central DB
    const tenant = await centralPrisma.company.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) {
      res.status(404).json({ error: "Tenant not registered" });
      return;
    }
    // Init WhatsApp session
    await setupCompanySession(tenantId);
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
