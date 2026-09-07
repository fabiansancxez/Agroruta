import { Router } from "express";
import { randomUUID } from "node:crypto";
import { excedentes } from "../db.js";
import { calcularEstadoVida } from "../lib/vidaUtil.js";

export const excedentesRouter = Router();

function enriquecer(excedente) {
  const vida = calcularEstadoVida(excedente.fechaLimite);

  // Protocolo automatico: si el tiempo se agoto y seguia "disponible",
  // se marca como vencido (perdida) y sale de circulacion del marketplace.
  if (vida.nivel === "vencido" && excedente.estadoTransaccion === "disponible") {
    excedente.estadoTransaccion = "vencido";
  }

  return { ...excedente, vida };
}

// GET /api/excedentes?estado=disponible&modalidad=venta
excedentesRouter.get("/", (req, res) => {
  const { estado, modalidad } = req.query;

  let resultado = excedentes.map(enriquecer);

  if (estado) {
    resultado = resultado.filter((e) => e.estadoTransaccion === estado);
  }
  if (modalidad) {
    resultado = resultado.filter((e) => e.modalidad === modalidad);
  }

  // Priorizacion: los excedentes disponibles se ordenan por menor tiempo
  // de vida util restante primero (los mas urgentes de rescatar).
  resultado.sort((a, b) => a.vida.horasRestantes - b.vida.horasRestantes);

  res.json(resultado);
});

excedentesRouter.get("/:id", (req, res) => {
  const excedente = excedentes.find((e) => e.id === req.params.id);
  if (!excedente) return res.status(404).json({ error: "Excedente no encontrado" });
  res.json(enriquecer(excedente));
});

// POST /api/excedentes  -> un comerciante publica un nuevo excedente
excedentesRouter.post("/", (req, res) => {
  const {
    comerciante,
    tipoAlimento,
    descripcion,
    cantidadKg,
    estadoProducto,
    precio,
    modalidad,
    ubicacion,
    vidaUtilHoras,
  } = req.body;

  if (!comerciante || !tipoAlimento || !cantidadKg || !vidaUtilHoras) {
    return res.status(400).json({
      error:
        "Faltan campos obligatorios: comerciante, tipoAlimento, cantidadKg, vidaUtilHoras.",
    });
  }

  const esDonacion = modalidad === "donacion";
  const ahora = new Date();
  const fechaLimite = new Date(
    ahora.getTime() + Number(vidaUtilHoras) * 60 * 60 * 1000
  );

  const nuevo = {
    id: randomUUID(),
    comerciante,
    tipoAlimento,
    descripcion: descripcion || "",
    cantidadKg: Number(cantidadKg),
    estadoProducto: estadoProducto || "Bueno",
    precio: esDonacion ? 0 : Number(precio) || 0,
    modalidad: esDonacion ? "donacion" : "venta",
    ubicacion: ubicacion || "Corabastos",
    fechaPublicacion: ahora.toISOString(),
    fechaLimite: fechaLimite.toISOString(),
    estadoTransaccion: "disponible",
  };

  excedentes.unshift(nuevo);
  res.status(201).json(enriquecer(nuevo));
});
