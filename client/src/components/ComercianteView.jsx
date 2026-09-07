import { useEffect, useState } from "react";
import { api } from "../api.js";
import ExcedenteCard from "./ExcedenteCard.jsx";

const ESTADO_PRODUCTO = ["Bueno", "Por vencer", "Regular"];

const FORM_INICIAL = {
  comerciante: "",
  tipoAlimento: "",
  descripcion: "",
  cantidadKg: "",
  estadoProducto: "Bueno",
  modalidad: "venta",
  precio: "",
  vidaUtilHoras: "",
  ubicacion: "",
};

export default function ComercianteView() {
  const [misExcedentes, setMisExcedentes] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    const todos = await api.listarExcedentes();
    // En este MVP no hay autenticacion real: mostramos todo lo publicado
    // para poder demostrar el flujo completo con cualquier nombre.
    setMisExcedentes(todos);
  }

  useEffect(() => {
    cargar();
  }, []);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function publicar(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!form.comerciante || !form.tipoAlimento || !form.cantidadKg || !form.vidaUtilHoras) {
      setError("Completa comerciante, alimento, cantidad y vida útil restante.");
      return;
    }

    setEnviando(true);
    try {
      await api.publicarExcedente({
        ...form,
        cantidadKg: Number(form.cantidadKg),
        precio: form.modalidad === "donacion" ? 0 : Number(form.precio) || 0,
        vidaUtilHoras: Number(form.vidaUtilHoras),
      });
      setMensaje("Excedente publicado. Ya es visible en el marketplace.");
      setForm(FORM_INICIAL);
      await cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="vista">
      <section className="panel">
        <h2>Publicar excedente</h2>
        <p className="panel__ayuda">
          Registra el tipo de alimento, sus condiciones y el tiempo estimado de vida
          útil restante. AgroRuta calcula automáticamente su nivel de prioridad
          (protocolo de vida útil) para que compradores y organizaciones vean primero
          lo más urgente.
        </p>

        <form className="formulario" onSubmit={publicar}>
          <div className="formulario__grid">
            <label>
              Nombre del comerciante / bodega
              <input
                type="text"
                value={form.comerciante}
                onChange={(e) => actualizarCampo("comerciante", e.target.value)}
                placeholder="Ej: Bodega 12 - Don Alfonso"
              />
            </label>

            <label>
              Ubicación
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => actualizarCampo("ubicacion", e.target.value)}
                placeholder="Ej: Corabastos - Bodega 12"
              />
            </label>

            <label>
              Tipo de alimento
              <input
                type="text"
                value={form.tipoAlimento}
                onChange={(e) => actualizarCampo("tipoAlimento", e.target.value)}
                placeholder="Ej: Tomate chonto"
              />
            </label>

            <label>
              Cantidad (kg)
              <input
                type="number"
                min="1"
                value={form.cantidadKg}
                onChange={(e) => actualizarCampo("cantidadKg", e.target.value)}
              />
            </label>

            <label>
              Condición del producto
              <select
                value={form.estadoProducto}
                onChange={(e) => actualizarCampo("estadoProducto", e.target.value)}
              >
                {ESTADO_PRODUCTO.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Vida útil restante (horas)
              <input
                type="number"
                min="1"
                value={form.vidaUtilHoras}
                onChange={(e) => actualizarCampo("vidaUtilHoras", e.target.value)}
                placeholder="Ej: 6"
              />
            </label>

            <label>
              Modalidad
              <select
                value={form.modalidad}
                onChange={(e) => actualizarCampo("modalidad", e.target.value)}
              >
                <option value="venta">Venta (comisión AgroRuta 8%)</option>
                <option value="donacion">Donación (sin costo)</option>
              </select>
            </label>

            {form.modalidad === "venta" && (
              <label>
                Precio de venta (COP)
                <input
                  type="number"
                  min="0"
                  value={form.precio}
                  onChange={(e) => actualizarCampo("precio", e.target.value)}
                  placeholder="Ej: 90000"
                />
              </label>
            )}

            <label className="formulario__col-completa">
              Descripción / observaciones
              <textarea
                value={form.descripcion}
                onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                placeholder="Ej: madurez avanzada, ideal para consumo inmediato"
                rows={2}
              />
            </label>
          </div>

          {error && <p className="error-texto">{error}</p>}
          {mensaje && <p className="exito-texto">{mensaje}</p>}

          <button className="btn btn--primario" type="submit" disabled={enviando}>
            {enviando ? "Publicando..." : "Publicar excedente"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Excedentes publicados en la plataforma</h2>
        <div className="cuadricula">
          {misExcedentes.map((exc) => (
            <ExcedenteCard key={exc.id} excedente={exc} modoMarketplace={false} />
          ))}
          {misExcedentes.length === 0 && <p>Aún no hay excedentes publicados.</p>}
        </div>
      </section>
    </div>
  );
}
