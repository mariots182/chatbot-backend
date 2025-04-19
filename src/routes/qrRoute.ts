// src/routes/qrRoute.ts
import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { setupCompanySession, fetchQR } from "../services/qrService";

const prisma = new PrismaClient();
const router = Router();

router.post(
  "/session/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;

    // 1) Validar que exista la empresa
    const company = await prisma.empresas.findUnique({
      where: { id: parseInt(companyId) },
    });
    if (!company) {
      res.status(404).json({ error: "Company not found in DB" });
      return;
    }

    // 2) Inicializar la sesión de WhatsApp
    await setupCompanySession(companyId);
    res.json({ message: `📲 Session setup started for ${company.nombre}` });
  }
);

router.get(
  "/qr/:companyId",
  async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const qr = fetchQR(companyId);
    if (!qr) {
      res.status(404).json({ error: "No QR available yet" });
      return;
    }
    res.json({ qr });
  }
);

export default router;
