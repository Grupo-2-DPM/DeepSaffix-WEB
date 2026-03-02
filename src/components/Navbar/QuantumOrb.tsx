import { useEffect, useState } from "react";

export const QuantumOrb = () => {
  const [stats, setStats] = useState({ value: 128, unit: "ms" });
  const [prevValue, setPrevValue] = useState(128);
  const [isChanging, setIsChanging] = useState(false);

  // Simular cambio de datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 200) + 50;
      setPrevValue(stats.value);
      setStats({ value: newValue, unit: "ms" });
      setIsChanging(true);
      setTimeout(() => setIsChanging(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [stats.value]);

  return (
    <div className="relative flex items-center justify-center md:h-15 md:w-16">
      {/* Capa de fondo: glow azul/cyan */}
      <div className="bg-brand-500/20 animate-pulse-slow absolute inset-0 rounded-full blur-xl" />

      {/* Orb principal con gradiente rotatorio */}
      <div className="from-brand-500 via-accent-cyan to-brand-600 animate-spin-slow absolute inset-1 rounded-full bg-linear-to-br">
        <div className="absolute inset-0 rounded-full bg-neutral-950/70 mix-blend-overlay" />
      </div>

      {/* Anillo exterior con partículas */}
      <div className="border-accent-cyan/30 animate-rotate-ring absolute inset-0 rounded-full border-2">
        <div className="bg-accent-cyan animate-particle absolute top-0 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 transform rounded-full" />
        <div className="bg-brand-400 animate-particle-delay absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 transform rounded-full" />
        <div className="animate-particle-slow absolute top-1/2 left-0 h-1 w-1 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white" />
      </div>

      {/* Centro del orb con estadística */}
      <div className="absolute inset-2 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 backdrop-blur-sm">
        <div className="relative flex h-full w-full items-center justify-center">
          <span
            key={stats.value}
            className={`absolute font-mono text-xs font-bold transition-all duration-300 md:text-sm ${
              isChanging ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{ color: "#00f2ff" }}
          >
            {stats.value}
            <span className="ml-0.5 text-[0.6rem] text-neutral-400">
              {stats.unit}
            </span>
          </span>
          <span
            className={`text-accent-cyan absolute font-mono text-xs font-bold transition-all duration-300 md:text-sm ${
              isChanging ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            {prevValue}
            <span className="ml-0.5 text-[0.6rem] text-neutral-400">
              {stats.unit}
            </span>
          </span>
        </div>
      </div>

      {/* Líneas de escaneo (efecto radar) */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="animate-scan absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#00f2ff_0%,transparent_50%)] opacity-20" />
      </div>
    </div>
  );
};
