import { useEffect, useState } from "react";
import { api } from "../api.js";
import { iconoAlimento } from "../utils/iconoAlimento.js";

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function HistorialView() {
  const [transacciones, setTransacciones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .listarTransacciones()
      .then(setTransacciones)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="vista">
      <section className="panel">
        <h2>Historial de transacciones</h2>
        <p className="panel__ayuda">
          Trazabilidad completa de cada excedente rescatado: quién lo publicó, quién lo
          compró o reclamó, y en qué condiciones.
        </p>

        {error && <p className="error-texto">{error}</p>}

        <div className="tabla-envoltorio">
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Alimento</th>
                <th>Comerciante</th>
                <th>Tipo</th>
                <th>Recibido por</th>
                <th>Cantidad</th>
                <th>Monto</th>
                <th>Comisión</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((t) => (
                <tr key={t.id}>
                  <td>{formatoFecha.format(new Date(t.fecha))}</td>
                  <td>
                    <span aria-hidden="true">{iconoAlimento(t.tipoAlimento)}</span> {t.tipoAlimento}
                  </td>
                  <td>{t.comerciante}</td>
                  <td>
                    <span className={`etiqueta-tipo etiqueta-tipo--${t.tipoOperacion}`}>
                      {t.tipoOperacion === "compra" ? "Compra" : "Donación"}
                    </span>
                  </td>
                  <td>
                    {t.actorNombre}{" "}
                    <span className="tabla__actor-tipo">
                      ({t.actorTipo === "comprador" ? "comprador" : "organización"})
                    </span>
                  </td>
                  <td>{t.cantidadKg} kg</td>
                  <td>{t.monto > 0 ? formatoCOP.format(t.monto) : "—"}</td>
                  <td>{t.comision > 0 ? formatoCOP.format(t.comision) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transacciones.length === 0 && !error && (
            <p className="panel__ayuda">Aún no se ha registrado ninguna transacción.</p>
          )}
        </div>
      </section>
    </div>
  );
}
