import React, { useEffect, useState } from 'react';
import { SimulationPanel } from '../../features/simulation/components/SimulationPanel'; // El panel que lista
import { SimulationRun } from '../../features/simulation/pages/SimulationRun';     // El motor de ejecución

export const SimulacroContainer: React.FC = () => {
  // Estado para detectar si estamos en modo ejecución o en el dashboard
  const [view, setView] = useState<'dashboard' | 'run' | 'view'>('dashboard');
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('/run/')) setView('run');
      else if (hash.includes('/view/')) setView('view');
      else setView('dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Carga inicial
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30">
      {/* Header Estilo Terminal */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-blue-600 rounded-full animate-pulse" />
            <div>
              <h1 className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase">Saber Pro Engine</h1>
              <p className="text-lg font-semibold text-white tracking-tight">CENTRAL DE SIMULACROS</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              SISTEMA ACTIVO
            </div>
            <div className="hidden md:block">LATENCY: 24ms</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 animate-in fade-in duration-700">
        {view === 'dashboard' ? (
          <>
            {/* Sección de Bienvenida Técnica */}
            <section className="mb-12">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                
                <div className="max-w-2xl">
                  <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">Protocolo de Evaluación</span>
                  <h2 className="text-3xl font-bold text-white mt-2 mb-4">Entorno de Práctica Avanzada</h2>
                  <p className="text-neutral-400 leading-relaxed">
                    Accede a la base de datos de preguntas de competencias ciudadanas, lectura crítica y razonamiento cuantitativo. 
                    El sistema registrará tu latencia de respuesta y precisión métrica.
                  </p>
                </div>
              </div>
            </section>

            {/* Aquí inyectamos tu lógica de SimulationPanel con el nuevo estilo */}
            <div className="grid grid-cols-1 gap-8">
               <SimulationPanel />
            </div>
          </>
        ) : (
          /* Renderiza el componente de ejecución (SimulationRun) */
          <div className="mt-4">
            <SimulationRun />
          </div>
        )}
      </main>
    </div>
  );
};