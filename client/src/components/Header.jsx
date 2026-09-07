const VISTAS = [
  { id: "comerciante", label: "Comerciante", detalle: "Publicar excedentes" },
  { id: "marketplace", label: "Compradores / Organizaciones", detalle: "Rescatar excedentes" },
  { id: "metricas", label: "Métricas", detalle: "Impacto y North Star" },
];

export default function Header({ vistaActiva, onCambiarVista }) {
  return (
    <header className="app-header">
      <div className="app-header__marca">
        <span className="app-header__logo">🌱</span>
        <div>
          <h1>AgroRuta</h1>
          <p>Cada alimento tiene una ruta.</p>
        </div>
      </div>

      <nav className="app-header__nav">
        {VISTAS.map((v) => (
          <button
            key={v.id}
            className={`tab ${vistaActiva === v.id ? "tab--activo" : ""}`}
            onClick={() => onCambiarVista(v.id)}
          >
            <span>{v.label}</span>
            <small>{v.detalle}</small>
          </button>
        ))}
      </nav>
    </header>
  );
}
