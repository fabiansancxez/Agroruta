import { Router } from "express";
import { randomUUID } from "node:crypto";
import { excedentes, transacciones } from "../db.js";
import { calcularEstadoVida } from "../lib/vidaUtil.js";

export const transaccionesRouter = Router();

const COMISION_AGRORUTA = 0.08; // 8% sobre ventas comerciales, tal como en el plan de negocio

// POST /api/excedentes/:id/transaccion
// Registra que un comprador compro el excedente, o que una organizacion
// social reclamo la donacion.
transaccionesRouter.post("/excedentes/:id/transaccion", (req, res) => {
  const excedente = excedentes.find((e) => e.id === req.params.id);
  if (!excedente) {
    return res.status(404).json({ error: "Excedente no encontrado" });
  }

  const vida = calcularEstadoVida(excedente.fechaLimite);
  if (vida.nivel === "vencido" || excedente.estadoTransaccion !== "disponible") {
    return res.status(409).json({
      error: "Este excedente ya no esta disponible (vencido, vendido o reclamado).",
    });
  }

  const { actorNombre, actorTipo } = req.body;
  if (!actorNombre || !actorTipo) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: actorNombre, actorTipo.",
    });
  }

  const esDonacion = excedente.modalidad === "donacion";
  const monto = esDonacion ? 0 : excedente.precio;
  const comision = esDonacion ? 0 : Math.round(monto * COMISION_AGRORUTA);

  excedente.estadoTransaccion = esDonacion ? "reclamado" : "vendido";

  const transaccion = {
    id: randomUUID(),
    excedenteId: excedente.id,
    tipoOperacion: esDonacion ? "donacion" : "compra",
    actorNombre,
    actorTipo, // 'comprador' | 'organizacion'
    cantidadKg: excedente.cantidadKg,
    monto,
    comision,
    fecha: new Date().toISOString(),
  };
  transacciones.unshift(transaccion);

  res.status(201).json({ transaccion, excedente });
});

// GET /api/transacciones -> historial completo (para trazabilidad)
transaccionesRouter.get("/transacciones", (req, res) => {
  res.json(transacciones);
});
