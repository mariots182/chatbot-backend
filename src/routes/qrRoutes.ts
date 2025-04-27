import { Router, Request, Response } from "express";
import { centralPrisma } from "../database/prismaClientFactory";
import { WhatsappSessionManager } from "../services/whatsapp/whatsappSessionManager";

const router = Router();

router.get("/:companyId", async (req: Request, res: Response) => {
  const { companyId } = req.params;

  try {
    const company = await centralPrisma.company.findUnique({
      where: { id: Number(companyId) },
    });

    if (!company) {
      res.status(404).json({ message: "Empresa no encontrada" });

      console.log(`❌ [qrRoute] Empresa no encontrada para el ID ${companyId}`);

      return;
    }

    const qrBase64 = await WhatsappSessionManager.generateQRCode(companyId);

    res.status(200).json({
      message: "QR generado correctamente",
      qr: qrBase64,
    });

    console.log(
      `🧩 [qrRoute] QR generado correctamente para la empresa ${companyId}`
    );

    return;
  } catch (error) {
    console.error("❌ [qrRoute] Error generating QR:", error);

    res.status(500).json({ message: "Error interno al generar QR" });

    return;
  }
});

export default router;
