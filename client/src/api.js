// En local, Vite hace proxy de "/api" hacia http://localhost:4000 (ver vite.config.js).
// En producción (Render), el frontend y el backend quedan en dominios distintos,
// asi que se usa la URL completa del backend definida en VITE_API_URL.
const RAIZ_API = import.meta.env.VITE_API_URL || "";
const BASE = `${RAIZ_API}/api`;

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Error de red inesperado");
  }
  return data;
}

export const api = {
  listarExcedentes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/excedentes${qs ? `?${qs}` : ""}`).then(handle);
  },
  publicarExcedente: (payload) =>
    fetch(`${BASE}/excedentes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  registrarTransaccion: (excedenteId, payload) =>
    fetch(`${BASE}/excedentes/${excedenteId}/transaccion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  obtenerMetricas: () => fetch(`${BASE}/metricas`).then(handle),
  obtenerHistorico: () => fetch(`${BASE}/metricas/historico`).then(handle),
  listarTransacciones: () => fetch(`${BASE}/transacciones`).then(handle),
};
