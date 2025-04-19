import { Router, Request, Response } from "express";
import { fetchQR, getQR, setupCompanySession } from "../services/qrService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/session/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;

    const company = await prisma.empresas.findUnique({
      where: { id: parseInt(companyId) },
    });

    if (!company) {
      res.status(404).json({ error: "Company not found in DB" });
      return;
    }

    setupCompanySession(companyId);
    res.json({ message: `📲 Session setup started for ${company.nombre}` });
  }
);

router.get(
  "/qr/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const qr = await fetchQR(companyId);

    if (!qr) {
      res.status(404).json({ error: "No QR available yet" });
      return;
    }

    res.json({ qr });
  }
);

router.get("/qr", async (_req: Request, res: Response): Promise<void> => {
  try {
    const qr = await getQR();
    if (!qr) {
      res.status(400).json({ message: "QR code not available yet" });
      return;
    }
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch QR code", error: err });
  }
});

export default router;
