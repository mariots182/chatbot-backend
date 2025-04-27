import express from "express";
import companyRoute from "./routes/companyRoute";
import qrRoutes from "./routes/qrRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", companyRoute);
app.use("/api/qr", qrRoutes);

app.get("/", (_req, res) => {
  res.send("🚀 WhatsApp bot is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
