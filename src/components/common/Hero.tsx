export const Hero = () => {
  const content = {
    title: "DeepSaffix",
    subtitle: "Simulacros inteligentes para las pruebas Saber Pro",
    description:
      "Prepárate con ejercicios personalizados, seguimiento de progreso y análisis detallado de resultados. Más de 2000 preguntas y 50 simulacros disponibles.",
    stats: [
      { label: "Preguntas", value: "2500+" },
      { label: "Simulacros", value: "50+" },
      { label: "Estudiantes", value: "1200+" },
    ],
    cta: "Comenzar simulacro",
    secondaryCta: "Ver demostración",
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 animate-fade-in">
      {/* Badge del equipo (estilo consola) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-neutral-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-neutral-700 shadow-lg">
        <i className="fas fa-code text-accent-cyan"></i>
        <span className="text-neutral-300">Grupo 2 · Diplomado MA26</span>
      </div>

      {/* Círculos decorativos con colores de acento (opacidad baja) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-cyan rounded-full mix-blend-soft-light filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-700 rounded-full mix-blend-soft-light filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda: contenido principal */}
          <div className="space-y-8">
            {/* Título y subtítulo */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                {content.title}
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-neutral-400">
                {content.subtitle}
              </p>
            </div>

            {/* Descripción */}
            <p className="text-lg text-neutral-500 max-w-2xl">
              {content.description}
            </p>

            {/* Estadísticas clave con acento brand */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-brand-500">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Botones de acción con efectos técnicos */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={async () => {
                  return window.location.hash = '#/simulation';
                }}
                className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-neutral-950 shadow-brand-600/50">
                {content.cta}
              </button>
              <button className="px-8 py-4 bg-transparent border border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white font-semibold rounded-lg transition-all duration-200 active:scale-95">
                {content.secondaryCta}
              </button>
            </div>
          </div>

          {/* Columna derecha: visualización de datos (estilo consola) */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-96 bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-2xl overflow-hidden">
              {/* Gráfico de barras simulado */}
              <div className="grid grid-cols-4 gap-3 h-full items-end">
                {[75, 60, 90, 45].map((height, i) => (
                  <div
                    key={i}
                    className="bg-linear-to-t from-brand-600 to-accent-cyan rounded-t-lg transition-all duration-500 hover:from-brand-500"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              {/* Etiqueta flotante con estilo de métrica */}
              <div className="absolute top-4 left-4 bg-neutral-800/90 text-neutral-300 px-3 py-1 rounded-full text-xs font-mono border border-neutral-700">
                <i className="fas fa-chart-line mr-1 text-accent-cyan"></i>
                <span>PROGRESO_PROMEDIO</span>
              </div>
              {/* Icono técnico */}
              <div className="absolute bottom-4 right-4 bg-neutral-800 p-3 rounded-full border border-neutral-700">
                <i className="fas fa-terminal text-accent-cyan text-xl"></i>
              </div>
            </div>
            {/* Pequeños destellos con acento cyan */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-cyan rounded-full opacity-20 animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-brand-500 rounded-full opacity-20 animate-ping animation-delay-1000"></div>
          </div>
        </div>
        {/* Banner de Datos Representativos - DeepSaffix Console Style */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/50 backdrop-blur-sm animate-fade-in shadow-2xl">

          {/* Métrica 1: Rendimiento */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-neutral-800 hover:bg-neutral-800/40 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00f2ff]"></div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Data Sync Status</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-brand-50 italic">98.4<span className="text-brand-400 text-sm not-italic">%</span></span>
              <span className="text-[10px] text-brand-500 font-mono font-bold tracking-tighter">↑ 2.1%</span>
            </div>
            <p className="text-[10px] text-neutral-600 font-medium uppercase mt-1">Efectividad en simulacros globales</p>
          </div>

          {/* Métrica 2: Usuarios Activos */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-neutral-800 hover:bg-neutral-800/40 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_8px_#0073bb]"></div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Active Nodes</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-brand-50 italic">+12.5K</span>
              <span className="text-[10px] text-accent-cyan font-mono font-bold tracking-tighter">LIVE</span>
            </div>
            <p className="text-[10px] text-neutral-600 font-medium uppercase mt-1">Estudiantes en entrenamiento concurrente</p>
          </div>

          {/* Métrica 3: Tiempo de Respuesta */}
          <div className="p-6 hover:bg-neutral-800/40 transition-colors group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-neutral-600 group-hover:bg-accent-cyan transition-colors"></div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Engine Latency</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-brand-50 italic">240<span className="text-brand-400 text-sm not-italic">ms</span></span>
              <span className="text-[10px] text-neutral-600 font-mono font-bold tracking-tighter">OPTIMIZED</span>
            </div>
            <p className="text-[10px] text-neutral-600 font-medium uppercase mt-1">Tiempo de feedback instantáneo IA</p>
          </div>
        </div>
        {/* System Advisory Banner - DeepSaffix Didactic Warning */}
        <div className="mt-8 relative overflow-hidden rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-3 animate-fade-in">
          {/* Fondo decorativo sutil (Escaneo de seguridad) */}
          <div className="absolute inset-0 bg-linear-to-r from-brand-500/10 via-transparent to-transparent opacity-30"></div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Icono de Alerta de Consola */}
              <div className="shrink-0">
                <svg className="w-5 h-5 text-brand-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0116 0z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-400 tracking-[0.2em] uppercase">Environment Advisory</span>
                <p className="text-xs text-neutral-400 font-medium">
                  <span className="text-brand-300 font-bold">NOTA DIDÁCTICA:</span> Las métricas y datos visualizados en este módulo son
                  <span className="text-brand-300"> representaciones simuladas</span> generadas para fines educativos. No corresponden a registros reales del sistema.
                </p>
              </div>
            </div>

            {/* Etiqueta de Modo Sandbox */}
            <div className="shrink-0 bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-md">
              <span className="text-[9px] font-mono text-neutral-500 tracking-tighter">
                STATUS: <span className="text-brand-500 font-bold">SANDBOX_MODE_ACTIVE</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};