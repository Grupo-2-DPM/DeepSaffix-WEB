import { useEffect, useState } from 'react';

export const QuantumOrb = () => {
  const [stats, setStats] = useState({ value: 128, unit: 'ms' });
  const [prevValue, setPrevValue] = useState(128);
  const [isChanging, setIsChanging] = useState(false);

  // Simular cambio de datos cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 200) + 50;
      setPrevValue(stats.value);
      setStats({ value: newValue, unit: 'ms' });
      setIsChanging(true);
      setTimeout(() => setIsChanging(false), 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [stats.value]);

  return (
    <div className="relative flex items-center justify-center md:w-16 md:h-15">
      {/* Capa de fondo: glow azul/cyan */}
      <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse-slow" />

      {/* Orb principal con gradiente rotatorio */}
      <div className="absolute inset-1 rounded-full bg-linear-to-br from-brand-500 via-accent-cyan to-brand-600 animate-spin-slow">
        <div className="absolute inset-0 rounded-full bg-neutral-950/70 mix-blend-overlay" />
      </div>

      {/* Anillo exterior con partículas */}
      <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/30 animate-rotate-ring">
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-accent-cyan rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-particle" />
        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-brand-400 rounded-full transform -translate-x-1/2 translate-y-1/2 animate-particle-delay" />
        <div className="absolute left-0 top-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-particle-slow" />
      </div>

      {/* Centro del orb con estadística */}
      <div className="absolute inset-2 rounded-full bg-neutral-900 flex items-center justify-center backdrop-blur-sm border border-neutral-800">
        <div className="relative w-full h-full flex items-center justify-center">
          <span
            key={stats.value}
            className={`absolute text-xs md:text-sm font-mono font-bold transition-all duration-300 ${
              isChanging ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
            }`}
            style={{ color: '#00f2ff' }}
          >
            {stats.value}
            <span className="text-[0.6rem] text-neutral-400 ml-0.5">{stats.unit}</span>
          </span>
          <span
            className={`absolute text-xs md:text-sm font-mono font-bold text-accent-cyan transition-all duration-300 ${
              isChanging ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            {prevValue}
            <span className="text-[0.6rem] text-neutral-400 ml-0.5">{stats.unit}</span>
          </span>
        </div>
      </div>

      {/* Líneas de escaneo (efecto radar) */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#00f2ff_0%,transparent_50%)] opacity-20 animate-scan" />
      </div>
    </div>
  );
};