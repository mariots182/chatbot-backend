import { Router, Request, Response } from "express";
import { fetchQR, getQR, setupCompanySession } from "../services/qrService";

const router = Router();

router.post("/session/:companyId", async (req, res) => {
  const { companyId } = req.params;
  await setupCompanySession(companyId);
  res.json({ message: `📲 Session setup started for ${companyId}` });
});

router.get("/qr/:companyId", async (req: Request, res: Response) => {
  const { companyId } = req.params;
  const qr = await fetchQR(companyId); // ← aquí estaba el detalle

  if (!qr) return res.status(404).json({ error: "No QR available yet" });

  res.json({ qr });
});

router.get("/qr", async (_req: Request, res: Response) => {
  try {
    const qr = await getQR();
    if (!qr) {
      return res.status(400).json({ message: "QR code not available yet" });
    }
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch QR code", error: err });
  }
});

export default router;
