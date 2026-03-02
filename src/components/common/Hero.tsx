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
    <section className="animate-fade-in relative overflow-auto border-b border-neutral-800 px-4 py-20 text-white sm:px-6 lg:px-8">
      {/* Badge del equipo (estilo consola) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-lg backdrop-blur-sm">
        <i className="fas fa-code text-accent-cyan"></i>
        <span className="text-neutral-300">Grupo 2 · Diplomado MA26</span>
      </div>

      {/* Círculos decorativos con colores de acento (opacidad baja) */}
      <div className="absolute inset-0 opacity-20">
        <div className="bg-brand-500 absolute top-0 left-0 h-96 w-96 animate-pulse rounded-full mix-blend-soft-light blur-3xl filter"></div>
        <div className="bg-accent-cyan animation-delay-2000 absolute right-0 bottom-0 h-96 w-96 animate-pulse rounded-full mix-blend-soft-light blur-3xl filter"></div>
        <div className="animation-delay-4000 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-neutral-700 mix-blend-soft-light blur-3xl filter"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Columna izquierda: contenido principal */}
          <div className="space-y-8">
            {/* Título y subtítulo */}
            <div>
              <h1 className="text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-4 text-xl text-neutral-400 md:text-2xl">
                {content.subtitle}
              </p>
            </div>

            {/* Descripción */}
            <p className="max-w-2xl text-lg text-neutral-500">
              {content.description}
            </p>

            {/* Estadísticas clave con acento brand */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-brand-500 text-2xl font-bold md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-wider text-neutral-500 uppercase md:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Botones de acción con efectos técnicos */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={async () => {
                  return (window.location.hash = "#/overview");
                }}
                className="bg-brand-600 hover:bg-brand-500 focus:ring-brand-400 shadow-brand-600/50 transform rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:outline-none active:scale-95"
              >
                {content.cta}
              </button>
              <button className="rounded-lg border border-neutral-700 bg-transparent px-8 py-4 font-semibold text-neutral-300 transition-all duration-200 hover:bg-neutral-800 hover:text-white active:scale-95">
                {content.secondaryCta}
              </button>
            </div>
          </div>

          {/* Columna derecha: visualización de métricas (Acertadas vs Fallidas) */}
          <div className="js-avoid relative hidden lg:block">
            {/* Columna derecha: Visualización Circular Prototipo */}
            <div className="js-avoid relative hidden lg:block">
              <div className="relative flex h-105 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-neutral-800/40 p-8 shadow-2xl backdrop-blur-xl">
                {/* Encabezado de la interfaz */}
                <div className="absolute top-6 right-8 left-8 flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-accent-cyan animate-pulse font-mono text-[10px] tracking-[0.2em]">
                    SYSTEM_DIAGNOSTIC
                  </span>
                  <span className="font-mono text-[9px] text-neutral-500">
                    REF_ID: 88-X2
                  </span>
                </div>

                {/* GRÁFICO CIRCULAR (SVG) */}
                {/* Contenedor Circular Externo */}
                <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-neutral-950/40 p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  {/* Efecto de 'Vidrio' o Lente (opcional para realismo) */}
                  <div className="from-accent-cyan/5 pointer-events-none absolute inset-0 bg-linear-to-tr to-transparent"></div>

                  {/* SVG del Gráfico */}
                  <div className="relative flex h-64 w-64 items-center justify-center">
                    <svg
                      className="h-full w-full -rotate-90 transform"
                      viewBox="0 0 100 100"
                    >
                      {/* Track de fondo */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-neutral-800/50"
                      />

                      {/* Segmento: FALLIDAS (15%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#ef4444"
                        strokeWidth="6"
                        strokeDasharray="39.6 263.9"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        fill="transparent"
                        className="drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                      />

                      {/* Segmento: ACERTADAS (85%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#00f2ff"
                        strokeWidth="6"
                        strokeDasharray="224.3 263.9"
                        strokeDashoffset="-39.6"
                        strokeLinecap="round"
                        fill="transparent"
                        className="drop-shadow-[0_0_12px_rgba(0,242,255,0.5)]"
                      />

                      {/* Anillos de escaneo decorativos internos */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="white"
                        strokeWidth="0.1"
                        fill="transparent"
                        className="opacity-20"
                      />
                    </svg>

                    {/* Texto Central */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-4xl leading-none font-bold text-white">
                        85<span className="text-accent-cyan text-sm">%</span>
                      </span>
                      <span className="mt-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                        Efficiency
                      </span>
                    </div>
                  </div>

                  {/* Efecto de luz de escaneo circular (Barrido de radar) */}
                  <div className="border-accent-cyan/20 animate-spin-slow pointer-events-none absolute inset-0 h-full w-full rounded-full border-t"></div>
                </div>

                {/* Leyenda Inferior (Estilo Consola) */}
                <div className="mt-8 grid w-full grid-cols-2 gap-4">
                  <div className="border-accent-cyan flex flex-col border-l-2 pl-3">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase">
                      Correctas
                    </span>
                    <span className="font-mono text-lg text-white">1,284</span>
                  </div>
                  <div className="flex flex-col border-l-2 border-red-500 pl-3">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase">
                      Errores
                    </span>
                    <span className="font-mono text-lg text-white">226</span>
                  </div>
                </div>

                {/* Micro-métrica flotante */}
                <div className="text-accent-cyan/40 absolute right-8 bottom-4 flex items-center space-x-2">
                  <div className="h-1 w-8 overflow-hidden rounded-full bg-current">
                    <div className="bg-accent-cyan h-full animate-[gradient-x_2s_infinite]"></div>
                  </div>
                  <span className="font-mono text-[8px]">ENCRYPTED_STREAM</span>
                </div>
              </div>

              {/* Efectos de luz periférica */}
              <div className="bg-brand-600/10 absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full blur-[80px]"></div>
            </div>

            {/* Decoración Cyan (Ping) */}
            <div className="bg-accent-cyan/10 absolute -top-6 -right-6 h-20 w-20 animate-pulse rounded-full blur-3xl"></div>
            <div className="bg-accent-cyan absolute top-0 right-0 h-1 w-1 shadow-[0_0_15px_#00f2ff]"></div>
          </div>
        </div>

        {/* System Advisory Banner - DeepSaffix Didactic Warning */}
        <div className="border-brand-500/20 bg-brand-500/5 animate-fade-in relative mt-8 overflow-hidden rounded-lg border px-4 py-3">
          {/* Fondo decorativo sutil (Escaneo de seguridad) */}
          <div className="from-brand-500/10 absolute inset-0 bg-linear-to-r via-transparent to-transparent opacity-30"></div>

          <div className="relative flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-3">
              {/* Icono de Alerta de Consola */}
              <div className="shrink-0">
                <svg
                  className="text-brand-400 h-5 w-5 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0116 0z"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-brand-400 text-[10px] font-black tracking-[0.2em] uppercase">
                  Environment Advisory
                </span>
                <p className="text-xs font-medium text-neutral-400">
                  <span className="text-brand-300 font-bold">
                    NOTA DIDÁCTICA:
                  </span>{" "}
                  Las métricas y datos visualizados en este módulo son
                  <span className="text-brand-300">
                    {" "}
                    representaciones simuladas
                  </span>{" "}
                  generadas para fines educativos. No corresponden a registros
                  reales del sistema.
                </p>
              </div>
            </div>

            {/* Etiqueta de Modo Sandbox */}
            <div className="shrink-0 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1">
              <span className="font-mono text-[9px] tracking-tighter text-neutral-500">
                STATUS:{" "}
                <span className="text-brand-500 font-bold">
                  SANDBOX_MODE_ACTIVE
                </span>
              </span>
            </div>
          </div>
        </div>
        {/* Banner de Datos Representativos - DeepSaffix Console Style */}
        <div className="animate-fade-in mt-12 grid grid-cols-1 gap-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-sm md:grid-cols-3">
          {/* Métrica 1: Rendimiento */}
          <div className="group border-b border-neutral-800 p-6 transition-colors hover:bg-neutral-800/40 md:border-r md:border-b-0">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-accent-cyan h-2 w-2 animate-pulse rounded-full shadow-[0_0_8px_#00f2ff]"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Data Sync Status
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-50 text-2xl font-black italic">
                98.4<span className="text-brand-400 text-sm not-italic">%</span>
              </span>
              <span className="text-brand-500 font-mono text-[10px] font-bold tracking-tighter">
                ↑ 2.1%
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium text-neutral-600 uppercase">
              Efectividad en simulacros globales
            </p>
          </div>

          {/* Métrica 2: Usuarios Activos */}
          <div className="group border-b border-neutral-800 p-6 transition-colors hover:bg-neutral-800/40 md:border-r md:border-b-0">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-brand-500 h-2 w-2 rounded-full shadow-[0_0_8px_#0073bb]"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Active Nodes
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-50 text-2xl font-black italic">
                +12.5K
              </span>
              <span className="text-accent-cyan font-mono text-[10px] font-bold tracking-tighter">
                LIVE
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium text-neutral-600 uppercase">
              Estudiantes en entrenamiento concurrente
            </p>
          </div>

          {/* Métrica 3: Tiempo de Respuesta */}
          <div className="group p-6 transition-colors hover:bg-neutral-800/40">
            <div className="mb-2 flex items-center gap-3">
              <div className="group-hover:bg-accent-cyan h-2 w-2 rounded-full bg-neutral-600 transition-colors"></div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                Engine Latency
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-brand-50 text-2xl font-black italic">
                240<span className="text-brand-400 text-sm not-italic">ms</span>
              </span>
              <span className="font-mono text-[10px] font-bold tracking-tighter text-neutral-600">
                OPTIMIZED
              </span>
            </div>
            <p className="mt-1 text-[10px] font-medium text-neutral-600 uppercase">
              Tiempo de feedback instantáneo IA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
