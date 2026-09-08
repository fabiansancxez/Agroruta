const VISTAS = [
  { id: "comerciante", label: "Comerciante", detalle: "Publicar excedentes" },
  { id: "marketplace", label: "Compradores / Organizaciones", detalle: "Rescatar excedentes" },
  { id: "historial", label: "Historial", detalle: "Trazabilidad" },
  { id: "metricas", label: "Métricas", detalle: "Impacto y North Star" },
];

export default function Header({ vistaActiva, onCambiarVista }) {
  return (
    <header className="app-header">
      <div className="app-header__marca">
        {/* El logo ya incluye el nombre "AgroRuta" y el eslogan, por eso el
            h1 queda solo para lectores de pantalla (no se ve duplicado). */}
        <h1 className="sr-solo">AgroRuta</h1>
        <img src="/logo-agroruta.jpg" alt="AgroRuta - Cada alimento tiene una ruta" className="app-header__logo-img" />
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
