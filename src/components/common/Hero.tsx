import { useUserStats } from "../../hooks/useUserStats";

export const Hero = () => {
  const { stats, loading } = useUserStats();

  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const eficiencia = stats?.eficiencia ?? 0;
  const correctas = stats?.totalCorrectas ?? 0;
  const incorrectas = stats?.totalIncorrectas ?? 0;
  const totalIntentos = stats?.totalIntentos ?? 0;
  const promedioTiempo = stats?.promedioTiempo ?? 0;
  const promedioPuntaje = stats?.promedioPuntaje ?? 0;

  const correctLength = (eficiencia / 100) * circumference;
  const incorrectLength = circumference - correctLength;

  const hasData = stats && totalIntentos > 0;

  return (
    <section className="relative overflow-auto px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Columna izquierda */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
                DeepSaffix
              </h1>
              <p className="mt-4 text-xl text-neutral-400 md:text-2xl">
                Analítica personalizada de tu rendimiento
              </p>
            </div>

            <p className="max-w-2xl text-lg text-neutral-500">
              {hasData
                ? "Resumen consolidado de tu desempeño en simulacros realizados."
                : "Aún no tienes simulacros finalizados. Completa tu primer intento para generar estadísticas personalizadas."}
            </p>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-brand-500 text-2xl font-bold md:text-3xl">
                  {totalIntentos}
                </div>
                <div className="text-xs tracking-wider text-neutral-500 uppercase md:text-sm">
                  Intentos
                </div>
              </div>

              <div className="text-center">
                <div className="text-brand-500 text-2xl font-bold md:text-3xl">
                  {promedioPuntaje}
                </div>
                <div className="text-xs tracking-wider text-neutral-500 uppercase md:text-sm">
                  Promedio Puntaje
                </div>
              </div>

              <div className="text-center">
                <div className="text-brand-500 text-2xl font-bold md:text-3xl">
                  {promedioTiempo}
                  <span className="ml-1 text-sm text-neutral-400">m</span>
                </div>
                <div className="text-xs tracking-wider text-neutral-500 uppercase md:text-sm">
                  Tiempo Medio
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: gráfico circular */}
          <div className="relative hidden lg:block">
            <div className="relative flex h-105 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-neutral-800/40 p-8 shadow-2xl backdrop-blur-xl">
              <div className="relative flex h-64 w-64 items-center justify-center">
                <svg
                  className="h-full w-full -rotate-90 transform"
                  viewBox="0 0 100 100"
                >
                  {/* Fondo */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-neutral-800/50"
                  />

                  {/* Incorrectas */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#ef4444"
                    strokeWidth="6"
                    strokeDasharray={`${incorrectLength} ${circumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    fill="transparent"
                  />

                  {/* Correctas */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#00f2ff"
                    strokeWidth="6"
                    strokeDasharray={`${correctLength} ${circumference}`}
                    strokeDashoffset={`-${incorrectLength}`}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                {/* Texto central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {loading ? (
                    <span className="font-mono text-sm text-neutral-500">
                      Cargando...
                    </span>
                  ) : hasData ? (
                    <>
                      <span className="font-mono text-4xl font-bold text-white">
                        {eficiencia}
                        <span className="text-accent-cyan text-sm">%</span>
                      </span>
                      <span className="mt-1 font-mono text-[9px] tracking-widest text-neutral-400 uppercase">
                        Eficiencia Global
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-sm text-neutral-500">
                      Sin datos
                    </span>
                  )}
                </div>
              </div>

              {/* Leyenda */}
              <div className="mt-8 grid w-full grid-cols-2 gap-4">
                <div className="border-accent-cyan flex flex-col border-l-2 pl-3">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">
                    Correctas
                  </span>
                  <span className="font-mono text-lg text-white">
                    {correctas}
                  </span>
                </div>

                <div className="flex flex-col border-l-2 border-red-500 pl-3">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">
                    Incorrectas
                  </span>
                  <span className="font-mono text-lg text-white">
                    {incorrectas}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
