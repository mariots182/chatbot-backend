import { Router, Request, Response } from "express";
// import { WhatsappSessionManager } from "../services/whatsapp/WhatsappSessionManager";
import { prisma } from "../lib/prismaClient"; // tu cliente central
import { WhatsappSessionManager } from "../services/whatsapp/whatsappSessionManager";

const router = Router();

/**
 * GET /api/qr/:companyId
 */
router.get("/:companyId", async (req: Request, res: Response) => {
  const { companyId } = req.params;

  try {
    const company = await prisma.company.findUnique({
      where: { id: Number(companyId) },
    });

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    const qrBase64 = await WhatsappSessionManager.generateQRCode(companyId);

    return res.status(200).json({
      message: "QR generado correctamente",
      qr: qrBase64,
    });
  } catch (error) {
    console.error("❌ [qrRoute] Error generating QR:", error);
    return res.status(500).json({ message: "Error interno al generar QR" });
  }
});

export default router;
