// src/server.ts
import express from "express";
import qrRoute from "./routes/qrRoute";
import { initializeBot } from "./bot/botClient";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parseo JSON
app.use(express.json());

console.log(typeof qrRoute); // debería imprimir "function" si es Router

// Rutas del API
app.use("/api", qrRoute);

// Ruta principal
app.get("/", (_req, res) => {
  res.send("🚀 WhatsApp bot is running");
});

// Iniciar servidor y bot
app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
  initializeBot();
});
