import { Router } from "express";
import { excedentes, transacciones } from "../db.js";
import { calcularEstadoVida } from "../lib/vidaUtil.js";

export const metricasRouter = Router();

// GET /api/metricas -> resumen para el dashboard / North Star Metric
metricasRouter.get("/", (req, res) => {
  // Refresca estados vencidos antes de sumar (mismo protocolo que en excedentes.js)
  excedentes.forEach((e) => {
    const vida = calcularEstadoVida(e.fechaLimite);
    if (vida.nivel === "vencido" && e.estadoTransaccion === "disponible") {
      e.estadoTransaccion = "vencido";
    }
  });

  const sumaKg = (lista) => lista.reduce((acc, e) => acc + e.cantidadKg, 0);

  const kgPublicados = sumaKg(excedentes);
  const kgRescatados = sumaKg(
    excedentes.filter((e) => ["vendido", "reclamado"].includes(e.estadoTransaccion))
  );
  const kgVencidos = sumaKg(excedentes.filter((e) => e.estadoTransaccion === "vencido"));
  const kgDisponibles = sumaKg(
    excedentes.filter((e) => e.estadoTransaccion === "disponible")
  );

  const compras = transacciones.filter((t) => t.tipoOperacion === "compra");
  const donaciones = transacciones.filter((t) => t.tipoOperacion === "donacion");
  const ingresosComision = compras.reduce((acc, t) => acc + t.comision, 0);

  const tasaRescate = kgPublicados > 0 ? (kgRescatados / kgPublicados) * 100 : 0;

  res.json({
    northStarMetric: {
      nombre: "Kilogramos de alimentos rescatados por semana",
      valor: kgRescatados,
      unidad: "kg",
    },
    kg: {
      publicados: kgPublicados,
      rescatados: kgRescatados,
      vencidos: kgVencidos,
      disponibles: kgDisponibles,
    },
    tasaRescatePorcentaje: Math.round(tasaRescate * 10) / 10,
    transacciones: {
      compras: compras.length,
      donaciones: donaciones.length,
      total: transacciones.length,
    },
    ingresosComision,
  });
});

// GET /api/metricas/historico -> evolucion de kg rescatados por dia
// (para el grafico de la North Star Metric en el tiempo)
metricasRouter.get("/historico", (req, res) => {
  const kgPorDia = {};
  transacciones.forEach((t) => {
    const dia = t.fecha.slice(0, 10); // "YYYY-MM-DD"
    kgPorDia[dia] = (kgPorDia[dia] || 0) + t.cantidadKg;
  });

  const dias = Object.keys(kgPorDia).sort();
  let acumulado = 0;
  const serie = dias.map((dia) => {
    acumulado += kgPorDia[dia];
    return { fecha: dia, kgDelDia: kgPorDia[dia], kgAcumulado: acumulado };
  });

  res.json(serie);
});
