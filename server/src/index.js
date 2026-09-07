import express from "express";
import cors from "cors";
import { excedentesRouter } from "./routes/excedentes.js";
import { transaccionesRouter } from "./routes/transacciones.js";
import { metricasRouter } from "./routes/metricas.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, servicio: "AgroRuta API", fecha: new Date().toISOString() });
});

app.use("/api/excedentes", excedentesRouter);
app.use("/api", transaccionesRouter); // /api/excedentes/:id/transaccion y /api/transacciones
app.use("/api/metricas", metricasRouter);

app.listen(PORT, () => {
  console.log(`AgroRuta API escuchando en http://localhost:${PORT}`);
});
