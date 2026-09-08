import { useEffect, useState } from "react";
import { api } from "../api.js";
import GraficoEvolucion from "./GraficoEvolucion.jsx";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function MetricasView() {
  const [metricas, setMetricas] = useState(null);
  const [historico, setHistorico] = useState(null);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      const [datos, serieHistorica] = await Promise.all([
        api.obtenerMetricas(),
        api.obtenerHistorico(),
      ]);
      setMetricas(datos);
      setHistorico(serieHistorica);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 5000);
    return () => clearInterval(intervalo);
  }, []);

  if (error) return <p className="error-texto">{error}</p>;
  if (!metricas) return <p>Cargando métricas...</p>;

  const { kg, tasaRescatePorcentaje, transacciones, ingresosComision, northStarMetric } =
    metricas;
  const total = kg.publicados || 1;

  return (
    <div className="vista">
      <section className="panel panel--north-star">
        <p className="north-star__etiqueta">North Star Metric</p>
        <p className="north-star__valor">
          {northStarMetric.valor} <span>{northStarMetric.unidad}</span>
        </p>
        <p className="north-star__nombre">{northStarMetric.nombre}</p>
      </section>

      <section className="panel">
        <h2>Impacto y aprovechamiento</h2>
        <div className="tarjetas-stat">
          <div className="stat">
            <p className="stat__valor">{kg.publicados} kg</p>
            <p className="stat__etiqueta">Publicados en total</p>
          </div>
          <div className="stat">
            <p className="stat__valor">{kg.rescatados} kg</p>
            <p className="stat__etiqueta">Rescatados (vendidos o donados)</p>
          </div>
          <div className="stat">
            <p className="stat__valor">{kg.disponibles} kg</p>
            <p className="stat__etiqueta">Disponibles ahora mismo</p>
          </div>
          <div className="stat">
            <p className="stat__valor">{kg.vencidos} kg</p>
            <p className="stat__etiqueta">Perdidos por vencimiento</p>
          </div>
        </div>

        <div className="barra-progreso" title="Distribución de kg publicados">
          <div
            className="barra-progreso__segmento barra-progreso__segmento--verde"
            style={{ width: `${(kg.rescatados / total) * 100}%` }}
          />
          <div
            className="barra-progreso__segmento barra-progreso__segmento--amarillo"
            style={{ width: `${(kg.disponibles / total) * 100}%` }}
          />
          <div
            className="barra-progreso__segmento barra-progreso__segmento--rojo"
            style={{ width: `${(kg.vencidos / total) * 100}%` }}
          />
        </div>
        <p className="panel__ayuda">
          Tasa de rescate: <strong>{tasaRescatePorcentaje}%</strong> de lo publicado
          evitó convertirse en desperdicio.
        </p>
      </section>

      <section className="panel">
        <h2>Evolución de kg rescatados</h2>
        <p className="panel__ayuda">
          Progreso acumulado de la North Star Metric a lo largo del tiempo.
        </p>
        <GraficoEvolucion serie={historico} />
      </section>

      <section className="panel">
        <h2>Actividad comercial</h2>
        <div className="tarjetas-stat">
          <div className="stat">
            <p className="stat__valor">{transacciones.compras}</p>
            <p className="stat__etiqueta">Compras registradas</p>
          </div>
          <div className="stat">
            <p className="stat__valor">{transacciones.donaciones}</p>
            <p className="stat__etiqueta">Donaciones reclamadas</p>
          </div>
          <div className="stat">
            <p className="stat__valor">{formatoCOP.format(ingresosComision)}</p>
            <p className="stat__etiqueta">Ingresos por comisión (8%)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
