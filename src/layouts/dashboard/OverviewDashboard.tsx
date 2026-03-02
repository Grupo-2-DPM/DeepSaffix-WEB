import React, { useEffect, useState } from "react";
import { SimulationPanel } from "../../features/simulation/components/SimulationPanel";
import { SimulationRun } from "../../features/simulation/pages/SimulationRun";

export const OverviewDashboard: React.FC = () => {
  const [view, setView] = useState<"dashboard" | "run" | "view" | "history">(
    "dashboard"
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash.includes("/run/")) setView("run");
      else if (hash.includes("/view/")) setView("view");
      else if (hash.includes("/history")) setView("history");
      else setView("dashboard");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen text-neutral-200">
      <main className="mx-auto max-w-7xl p-6">
        {view === "dashboard" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Banner de Bienvenida Técnica */}
            <div className="mb-10 rounded-xl border-neutral-800 p-8">
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">
                  Módulo de Evaluación
                </span>
                <h2 className="mt-1 text-3xl font-bold text-white">
                  Saber Pro: Central de Pruebas
                </h2>
                <p className="mt-3 max-w-xl text-neutral-400">
                  Selecciona un simulacro disponible para iniciar la sesión de
                  entrenamiento. Todos los resultados se guardarán
                  automáticamente en tu historial de red.
                </p>
              </div>
              {/* Decoración de fondo */}
              <div className="pointer-events-none absolute top-0 right-0 h-full w-64 bg-linear-to-l from-blue-600/5 to-transparent" />
            </div>

            {/* Inyectamos el Panel que contiene la lógica de "Iniciar" y "Listar" */}
            <div className="simulation-grid">
              <SimulationPanel />
            </div>
          </div>
        ) : (
          /* Cuando la URL cambie a /run/ o /view/, se mostrará el examen */
          <div className="animate-in zoom-in-95 duration-500">
            <SimulationRun />
          </div>
        )}
      </main>
    </div>
  );
};
