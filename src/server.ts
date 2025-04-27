import express from "express";
import companyRoute from "./routes/companyRoute";
import qrRoutes from "./routes/qrRoutes";
import cors from "cors";
import { WhatsappSessionManager } from "./services/whatsapp/whatsappSessionManager";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api", companyRoute);

app.use("/api/qr", qrRoutes);

WhatsappSessionManager.startAllBots();

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
