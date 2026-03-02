import { SystemHealth } from "./SystemHealth";

interface NavbarProps {
  onOpenSidebar?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSidebar,
  className = "",
}) => {
  return (
    <nav className={`h-16 w-full border-b border-neutral-800 ${className}`}>
      <div className="mx-auto h-full px-4 md:px-8">
        <div className="grid h-full grid-cols-[auto_1fr_auto] items-center">
          {/* IZQUIERDA */}
          <div className="flex items-center">
            <button
              onClick={onOpenSidebar}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white md:hidden"
              aria-label="Abrir menú lateral"
            >
              <i className="fas fa-bars" />
            </button>
          </div>

          {/* CENTRO (realmente centrado) */}
          <div className="flex justify-center">
            <SystemHealth />
          </div>

          {/* DERECHA (espacio vacío para balance visual) */}
          <div />
        </div>
      </div>
    </nav>
  );
};
