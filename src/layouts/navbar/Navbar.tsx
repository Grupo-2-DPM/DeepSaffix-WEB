
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

        {/* LADO IZQUIERDO: Identidad de Nodo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSidebarOpen?.(true)}
            className="md:hidden text-accent-cyan p-2 bg-neutral-900 rounded-lg border border-neutral-800"
          >
            <i className="fas fa-bars"></i>
          </button>

          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_#00f2ff]"></span>
              <span className="text-[15px] font-black text-neutral-400 uppercase tracking-[0.2em]">System_Core: <span className="text-white">Active</span></span>
            </div>
            <div className="text-[12px] font-mono text-neutral-600 mt-1 uppercase tracking-tighter">
              Location: 0x24-PASTO_CO // Latency: 24ms
            </div>
          </div>
        </div>

        {/* CENTRO: Elementos Visuales Diferentes (Indicadores de carga simulados) */}
        <div className="hidden lg:flex items-center gap-12 border-x border-neutral-800 px-12 h-full">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest text-center">Engine_Load</span>
            <div className="w-32 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div className="h-full bg-brand-500 w-[65%] shadow-[0_0_10px_#0073bb]"></div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold text-neutral-500 uppercase tracking-widest text-center">Memory_Usage</span>
            <div className="w-32 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div className="h-full bg-accent-cyan w-[40%] shadow-[0_0_10px_#00f2ff]"></div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Perfil Avanzado */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-5">
              <div className="flex flex-col text-right">
                <span className="text-xs font-black text-brand-50 uppercase tracking-tighter italic">
                  {user.nombre || "root_access"}
                </span>
                <span className="text-[16px] font-mono text-brand-400 flex items-center justify-end gap-1">
                  <i className="fas fa-shield-alt text-[8px]"></i> AUTH_LVL_2
                </span>
              </div>

              <button
                onClick={onLogout}
                className="group relative flex items-center justify-center h-10 w-10 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-red-500/50 transition-all duration-300 active:scale-90"
                title="TERMINATE_SESSION"
              >
                <span className="text-[10px] font-mono text-brand-400 group-hover:text-red-500 flex items-center justify-end gap-1">
                  <i className="fas fa-shield-alt text-[8px]"></i> Exit
                </span>
                <i className="fas fa-power-off text-neutral-600 group-hover:text-red-500 transition-colors"></i>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600/30"></span>
                </span>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};