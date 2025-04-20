import express from "express";
import qrRoute from "./routes/qrRoute";
import companyRoute from "./routes/companyRoute";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", companyRoute);

app.use("/api", qrRoute);

app.get("/", (_req, res) => {
  res.send("🚀 WhatsApp bot is running");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
