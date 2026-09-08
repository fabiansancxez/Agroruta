import { useState } from "react";
import Header from "./components/Header.jsx";
import ComercianteView from "./components/ComercianteView.jsx";
import MarketplaceView from "./components/MarketplaceView.jsx";
import MetricasView from "./components/MetricasView.jsx";
import HistorialView from "./components/HistorialView.jsx";

export default function App() {
  const [vista, setVista] = useState("marketplace");

  return (
    <div className="app">
      <Header vistaActiva={vista} onCambiarVista={setVista} />
      <main className="app-main">
        {vista === "comerciante" && <ComercianteView />}
        {vista === "marketplace" && <MarketplaceView />}
        {vista === "historial" && <HistorialView />}
        {vista === "metricas" && <MetricasView />}
      </main>
      <footer className="app-footer">
        MVP de validación · Plan de Negocio AgroRuta · Central de Abastos de Bogotá (Corabastos)
      </footer>
    </div>
  );
}
