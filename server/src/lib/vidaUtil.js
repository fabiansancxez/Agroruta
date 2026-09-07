/**
 * Protocolo de clasificacion de vida util de un excedente.
 *
 * Este es el diferenciador de AgroRuta que pidio el docente: no solo conectar
 * oferta y demanda, sino determinar el estado del alimento y priorizarlo
 * segun el tiempo disponible para su aprovechamiento (comercializacion o
 * donacion) antes de que pierda valor.
 *
 * Niveles (semaforo):
 *  - verde   ("fresco")  -> mas de 24h de vida util restante
 *  - amarillo ("pronto") -> entre 6h y 24h
 *  - rojo    ("urgente") -> 6h o menos
 *  - gris    ("vencido") -> 0h o menos, ya no es apto para comercializar/donar
 */
export function calcularEstadoVida(fechaLimiteISO) {
  const ahoraMs = Date.now();
  const limiteMs = new Date(fechaLimiteISO).getTime();
  const horasRestantes = (limiteMs - ahoraMs) / (1000 * 60 * 60);

  let nivel, color, etiqueta;
  if (horasRestantes <= 0) {
    nivel = "vencido";
    color = "gris";
    etiqueta = "Vencido / fuera de circulacion";
  } else if (horasRestantes <= 6) {
    nivel = "urgente";
    color = "rojo";
    etiqueta = "Urgente: rescatar ya";
  } else if (horasRestantes <= 24) {
    nivel = "pronto";
    color = "amarillo";
    etiqueta = "Pronto a vencer";
  } else {
    nivel = "fresco";
    color = "verde";
    etiqueta = "En buen estado";
  }

  return {
    horasRestantes: Math.round(horasRestantes * 10) / 10,
    nivel,
    color,
    etiqueta,
  };
}
