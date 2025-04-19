import express from "express";
import { initializeBot } from "./bot/botClient";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("🚀 WhatsApp bot is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
  initializeBot();
});