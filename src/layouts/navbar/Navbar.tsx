
// 1. Definimos la interfaz para aceptar las funciones del Layout
interface NavbarProps {
  setSidebarOpen?: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen, user, onLogout }) => {
  return (
    /* h-20 para hacerla más imponente + fondo con gradiente sutil */
    <nav className="h-20 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800 sticky top-0 z-30 animate-fade-in">
      <div className="h-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* LADO IZQUIERDO: Logo con efecto técnico */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSidebarOpen?.(true)}
            className="md:hidden text-accent-cyan p-2 bg-neutral-900 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-all active:scale-95"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-accent-cyan/30 blur-md animate-pulse"></span>
              <span className="relative block h-3 w-3 rounded-full bg-accent-cyan shadow-[0_0_12px_#00f2ff]"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-black text-neutral-200 tracking-[0.15em]">DEEPSAFFIX</span>
              <span className="text-[10px] font-mono text-neutral-500 tracking-wider">KERNEL v2.4.1 // SECURE</span>
            </div>
          </div>
        </div>

        {/* CENTRO: Visualizador de telemetría animado */}
        <div className="hidden lg:flex items-center gap-8 px-8 h-full border-x border-neutral-800">
          {/* Barras de ecualizador mejoradas con alturas fijas y animación de brillo */}
          <div className="flex items-end gap-0.75 h-8">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-0.75 bg-linear-to-t from-accent-cyan/40 to-accent-cyan rounded-full animate-pulse"
                style={{
                  // eslint-disable-next-line react-hooks/purity
                  height: `${Math.floor(Math.random() * 24 + 8)}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Texto dinámico con valores que cambian (simulado con pulse) */}
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold tracking-widest text-neutral-500">THROUGHPUT</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-brand-400 animate-pulse">2.4</span>
              <span className="text-[10px] text-neutral-600">Gbps</span>
            </div>
            <div className="flex gap-1 mt-1">
              <span className="h-1 w-4 bg-accent-cyan/60 rounded-full animate-pulse"></span>
              <span className="h-1 w-2 bg-accent-cyan/30 rounded-full animate-pulse [animation-delay:0.2s]"></span>
              <span className="h-1 w-3 bg-accent-cyan/40 rounded-full animate-pulse [animation-delay:0.4s]"></span>
            </div>
          </div>

          {/* Pequeño indicador de estado con parpadeo */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">ONLINE</span>
          </div>
        </div>

        {/* LADO DERECHO: Perfil con estilo de terminal */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-5">
              <div className="flex flex-col text-right">
                <span className="text-xs font-mono text-neutral-400">
                  <span className="text-neutral-600">USER:</span> {user.nombre || "root"}
                </span>
                <span className="text-[11px] font-mono text-brand-400 flex items-center justify-end gap-1">
                  <i className="fas fa-shield-alt text-[8px]"></i> LVL_2
                </span>
              </div>

              <button
                onClick={onLogout}
                className="group relative flex items-center justify-center h-9 w-9 text-brand-400  bg-neutral-900 border border-neutral-800 rounded-lg hover:border-red-500/50 transition-all duration-300 active:scale-90"
                title="Cerrar sesión"
              >
                <i className="fas fa-power-off text-neutral-500 group-hover:text-red-500 transition-colors"></i>
                <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-30"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600/40"></span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};