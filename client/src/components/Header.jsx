const VISTAS = [
  { id: "comerciante", icono: "🧺", label: "Comerciante", detalle: "Publicar excedentes" },
  { id: "marketplace", icono: "🤝", label: "Compradores / Organizaciones", detalle: "Rescatar excedentes" },
  { id: "historial", icono: "🧾", label: "Historial", detalle: "Trazabilidad" },
  { id: "metricas", icono: "📊", label: "Métricas", detalle: "Impacto y North Star" },
];

export default function Header({ vistaActiva, onCambiarVista }) {
  return (
    <header className="app-header">
      <div className="app-header__fila">
        <div className="app-header__marca">
          {/* El logo ya incluye el nombre "AgroRuta" y el eslogan, por eso el
              h1 queda solo para lectores de pantalla (no se ve duplicado). */}
          <h1 className="sr-solo">AgroRuta</h1>
          <img
            src="/logo-agroruta-trim.png"
            alt="AgroRuta - Cada alimento tiene una ruta"
            className="app-header__logo-img"
          />
        </div>

        <nav className="app-header__nav">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              className={`tab ${vistaActiva === v.id ? "tab--activo" : ""}`}
              onClick={() => onCambiarVista(v.id)}
            >
              <span className="tab__icono" aria-hidden="true">
                {v.icono}
              </span>
              <span className="tab__texto">
                <span className="tab__label">{v.label}</span>
                <small>{v.detalle}</small>
              </span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
