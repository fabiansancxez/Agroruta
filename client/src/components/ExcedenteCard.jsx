import { useState } from "react";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ETIQUETA_ESTADO_TRANSACCION = {
  disponible: "Disponible",
  vendido: "Vendido",
  reclamado: "Donado / reclamado",
  vencido: "Vencido (perdida)",
};

export default function ExcedenteCard({ excedente, modoMarketplace, onAccion }) {
  const [nombreActor, setNombreActor] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const esDonacion = excedente.modalidad === "donacion";
  const disponible = excedente.estadoTransaccion === "disponible";

  async function confirmar(actorTipo) {
    if (!nombreActor.trim()) {
      setError("Escribe un nombre para continuar.");
      return;
    }
    setError("");
    setCargando(true);
    try {
      await onAccion(excedente.id, {
        actorNombre: nombreActor.trim(),
        actorTipo,
      });
      setMostrarForm(false);
      setNombreActor("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <article className={`card card--${excedente.vida.color}`}>
      <header className="card__header">
        <span className={`badge badge--${excedente.vida.color}`}>
          {excedente.vida.etiqueta}
        </span>
        <span className="card__tiempo">
          {excedente.vida.nivel === "vencido"
            ? "0h restantes"
            : `${excedente.vida.horasRestantes}h restantes`}
        </span>
      </header>

      <h3 className="card__titulo">{excedente.tipoAlimento}</h3>
      <p className="card__meta">
        {excedente.comerciante} · {excedente.ubicacion}
      </p>
      <p className="card__descripcion">{excedente.descripcion}</p>

      <dl className="card__datos">
        <div>
          <dt>Cantidad</dt>
          <dd>{excedente.cantidadKg} kg</dd>
        </div>
        <div>
          <dt>Condición</dt>
          <dd>{excedente.estadoProducto}</dd>
        </div>
        <div>
          <dt>Modalidad</dt>
          <dd>{esDonacion ? "Donación" : "Venta"}</dd>
        </div>
        <div>
          <dt>Precio</dt>
          <dd>{esDonacion ? "Gratuito" : formatoCOP.format(excedente.precio)}</dd>
        </div>
      </dl>

      {!modoMarketplace && (
        <p className="card__estado-propio">
          Estado: <strong>{ETIQUETA_ESTADO_TRANSACCION[excedente.estadoTransaccion]}</strong>
        </p>
      )}

      {modoMarketplace && disponible && (
        <div className="card__accion">
          {!mostrarForm ? (
            <button className="btn btn--primario" onClick={() => setMostrarForm(true)}>
              {esDonacion ? "Reclamar donación" : "Comprar"}
            </button>
          ) : (
            <div className="card__form-accion">
              <input
                type="text"
                placeholder={esDonacion ? "Nombre de la organización" : "Nombre del comprador"}
                value={nombreActor}
                onChange={(e) => setNombreActor(e.target.value)}
              />
              {error && <p className="error-texto">{error}</p>}
              <div className="card__form-botones">
                <button
                  className="btn btn--primario"
                  disabled={cargando}
                  onClick={() => confirmar(esDonacion ? "organizacion" : "comprador")}
                >
                  {cargando ? "Registrando..." : "Confirmar"}
                </button>
                <button className="btn btn--secundario" onClick={() => setMostrarForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {modoMarketplace && !disponible && (
        <p className="card__ya-no-disponible">
          {ETIQUETA_ESTADO_TRANSACCION[excedente.estadoTransaccion]}
        </p>
      )}
    </article>
  );
}
