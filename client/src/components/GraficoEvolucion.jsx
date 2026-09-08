// Grafico de linea simple, dibujado a mano con SVG (sin librerias externas)
// para mostrar la evolucion de kg rescatados acumulados dia a dia.
const ANCHO = 640;
const ALTO = 200;
const MARGEN = { arriba: 16, abajo: 28, izquierda: 40, derecha: 16 };

const formatoFechaCorta = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short" });

export default function GraficoEvolucion({ serie }) {
  if (!serie || serie.length === 0) {
    return <p className="panel__ayuda">Aún no hay suficientes datos para graficar la evolución.</p>;
  }

  const anchoUtil = ANCHO - MARGEN.izquierda - MARGEN.derecha;
  const altoUtil = ALTO - MARGEN.arriba - MARGEN.abajo;
  const maxKg = Math.max(...serie.map((p) => p.kgAcumulado), 1);

  const puntos = serie.map((p, i) => {
    const x = MARGEN.izquierda + (serie.length === 1 ? anchoUtil : (i / (serie.length - 1)) * anchoUtil);
    const y = MARGEN.arriba + altoUtil - (p.kgAcumulado / maxKg) * altoUtil;
    return { ...p, x, y };
  });

  const lineaPath = puntos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${lineaPath} L${puntos[puntos.length - 1].x},${MARGEN.arriba + altoUtil} L${puntos[0].x},${MARGEN.arriba + altoUtil} Z`;

  return (
    <svg
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="grafico-evolucion"
      role="img"
      aria-label="Evolución de kilogramos de alimentos rescatados, acumulados día a día"
    >
      {/* líneas guía horizontales */}
      {[0, 0.5, 1].map((frac) => {
        const y = MARGEN.arriba + altoUtil * (1 - frac);
        return (
          <line
            key={frac}
            x1={MARGEN.izquierda}
            x2={ANCHO - MARGEN.derecha}
            y1={y}
            y2={y}
            className="grafico-evolucion__guia"
          />
        );
      })}

      <path d={areaPath} className="grafico-evolucion__area" />
      <path d={lineaPath} className="grafico-evolucion__linea" />

      {puntos.map((p) => (
        <circle key={p.fecha} cx={p.x} cy={p.y} r="4" className="grafico-evolucion__punto" />
      ))}

      {puntos.map((p) => (
        <text key={p.fecha} x={p.x} y={ALTO - 8} className="grafico-evolucion__etiqueta">
          {formatoFechaCorta.format(new Date(p.fecha))}
        </text>
      ))}

      <text
        x={MARGEN.izquierda}
        y={MARGEN.arriba}
        className="grafico-evolucion__etiqueta grafico-evolucion__etiqueta--max"
      >
        {maxKg} kg
      </text>
    </svg>
  );
}
