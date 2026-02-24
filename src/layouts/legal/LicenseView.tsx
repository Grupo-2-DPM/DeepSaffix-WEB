import React, { useEffect, useState } from 'react';

export const LicenseView: React.FC = () => {
  const [content, setContent] = useState<string>("Cargando protocolo de licencia...");

  useEffect(() => {
    // Simulamos la carga del archivo LICENSE.md
    fetch('/LICENSE.md')
      .then(res => res.text())
      .then(text => setContent(text))
      .catch(() => setContent("Error al cargar LICENSE.md. Verifique el repositorio raíz."));
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header Técnico */}
        <div className="bg-neutral-850 border-b border-neutral-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              Legal_System / OpenSource_License
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-600">v1.0.0-MIT</span>
        </div>

        {/* Visor de Licencia */}
        <div className="p-6 md:p-8">
          <pre className="text-sm font-mono text-neutral-400 leading-relaxed whitespace-pre-wrap bg-neutral-950 border border-neutral-800 p-6 rounded-lg">
            {content}
          </pre>
        </div>

        <div className="bg-neutral-950/50 p-4 border-t border-neutral-800 flex justify-end">
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-[10px] font-bold tracking-widest uppercase border border-neutral-700 rounded-lg transition-all active:scale-95"
          >
            Cerrar Terminal
          </button>
        </div>
      </div>
    </div>
  );
};