import { useEffect, useState } from "react";
import { api } from "../api.js";
import ExcedenteCard from "./ExcedenteCard.jsx";

export default function MarketplaceView() {
  const [excedentes, setExcedentes] = useState([]);
  const [filtroModalidad, setFiltroModalidad] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    setCargando(true);
    try {
      const params = { estado: "disponible" };
      if (filtroModalidad !== "todos") params.modalidad = filtroModalidad;
      const datos = await api.listarExcedentes(params);
      setExcedentes(datos);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroModalidad]);

  async function manejarAccion(excedenteId, payload) {
    await api.registrarTransaccion(excedenteId, payload);
    await cargar();
  }

  return (
    <div className="vista">
      <section className="panel">
        <div className="panel__encabezado">
          <div>
            <h2>Excedentes disponibles</h2>
            <p className="panel__ayuda">
              Ordenados automáticamente por prioridad: primero los que tienen menos
              tiempo de vida útil restante, para evitar que se pierdan.
            </p>
          </div>
          <div className="filtros">
            <button
              className={`chip ${filtroModalidad === "todos" ? "chip--activo" : ""}`}
              onClick={() => setFiltroModalidad("todos")}
            >
              Todos
            </button>
            <button
              className={`chip ${filtroModalidad === "venta" ? "chip--activo" : ""}`}
              onClick={() => setFiltroModalidad("venta")}
            >
              Solo venta
            </button>
            <button
              className={`chip ${filtroModalidad === "donacion" ? "chip--activo" : ""}`}
              onClick={() => setFiltroModalidad("donacion")}
            >
              Solo donación
            </button>
          </div>
        </div>

        {error && <p className="error-texto">{error}</p>}
        {cargando && <p>Cargando...</p>}

        <div className="cuadricula">
          {excedentes.map((exc) => (
            <ExcedenteCard
              key={exc.id}
              excedente={exc}
              modoMarketplace
              onAccion={manejarAccion}
            />
          ))}
          {!cargando && excedentes.length === 0 && (
            <p>No hay excedentes disponibles con este filtro por ahora.</p>
          )}
        </div>
      </section>
    </div>
  );
}
