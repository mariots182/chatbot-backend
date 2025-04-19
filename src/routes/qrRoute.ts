import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { setupCompanySession, fetchQR } from "../services/qrService";

const router = Router();

router.post(
  "/session/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { tenantId } = req.params;
    // Validate in central DB
    const tenant = await centralPrisma.empresas.findUnique({
      where: { id: Number(tenantId) },
    });
    if (!tenant) {
      res.status(404).json({ error: "Tenant not registered" });
      return;
    }
    // Init WhatsApp session
    await setupCompanySession(tenantId);
    res.json({ message: `📲 Session setup started for ${tenant.nombre}` });
  }
);

router.get(
  "/qr/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const qr = fetchQR(companyId);
    if (!qr) {
      res.status(404).json({ error: "No QR available" });
      return;
    }
    res.json({ qr });
  }
);

export default router;
