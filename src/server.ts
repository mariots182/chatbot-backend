import express from "express";
import qrRoute from "./routes/qrRoute";
import { initializeBot } from "./bot/botClient";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", qrRoute);

app.get("/", (_req, res) => {
  res.send("🚀 WhatsApp bot is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
  initializeBot();
});
