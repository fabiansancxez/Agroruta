import { useEffect, useState } from "react";
import { api } from "../api.js";
import ExcedenteCard from "./ExcedenteCard.jsx";

const ESTADO_PRODUCTO = ["Bueno", "Por vencer", "Regular"];

// Protocolo de inspeccion de alimentos: los 4 puntos que pidio el docente
// para determinar que un excedente si es apto para comercializar o donar.
const PUNTOS_PROTOCOLO = [
  { clave: "empaqueEnBuenEstado", etiqueta: "El empaque o embalaje está en buen estado" },
  {
    clave: "sinSignosDescomposicion",
    etiqueta: "No presenta signos de descomposición (moho, mal olor, líquidos)",
  },
  {
    clave: "temperaturaAdecuada",
    etiqueta: "Se mantuvo a una temperatura de almacenamiento adecuada",
  },
  { clave: "pesoVerificado", etiqueta: "La cantidad y el peso fueron verificados físicamente" },
];

const PROTOCOLO_INICIAL = PUNTOS_PROTOCOLO.reduce(
  (acc, punto) => ({ ...acc, [punto.clave]: false }),
  {}
);

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
  const [protocolo, setProtocolo] = useState(PROTOCOLO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const protocoloCompleto = PUNTOS_PROTOCOLO.every((punto) => protocolo[punto.clave]);

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

    if (!protocoloCompleto) {
      setError("Debes confirmar los 4 puntos del protocolo de inspección para publicar.");
      return;
    }

    setEnviando(true);
    try {
      await api.publicarExcedente({
        ...form,
        cantidadKg: Number(form.cantidadKg),
        precio: form.modalidad === "donacion" ? 0 : Number(form.precio) || 0,
        vidaUtilHoras: Number(form.vidaUtilHoras),
        protocolo,
      });
      setMensaje("Excedente publicado. Ya es visible en el marketplace.");
      setForm(FORM_INICIAL);
      setProtocolo(PROTOCOLO_INICIAL);
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

          <fieldset className="protocolo">
            <legend>
              Protocolo de inspección <span className="protocolo__obligatorio">(obligatorio)</span>
            </legend>
            <p className="panel__ayuda">
              Confirma que verificaste el estado del alimento antes de publicarlo. Este
              protocolo es lo que permite que AgroRuta garantice que solo se comercializan
              o donan excedentes realmente aprovechables.
            </p>
            {PUNTOS_PROTOCOLO.map((punto) => (
              <label key={punto.clave} className="protocolo__item">
                <input
                  type="checkbox"
                  checked={protocolo[punto.clave]}
                  onChange={(e) =>
                    setProtocolo((p) => ({ ...p, [punto.clave]: e.target.checked }))
                  }
                />
                {punto.etiqueta}
              </label>
            ))}
          </fieldset>

          {error && <p className="error-texto">{error}</p>}
          {mensaje && <p className="exito-texto">{mensaje}</p>}

          <button
            className="btn btn--primario"
            type="submit"
            disabled={enviando || !protocoloCompleto}
            title={!protocoloCompleto ? "Completa el protocolo de inspección primero" : ""}
          >
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
