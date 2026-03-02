import React from "react";
import { QuantumOrb } from "./QuantumOrb";
import { SystemHealth } from "./SystemHealth";

export interface User {
  id: string;
  nombre?: string;
  role?: string;
}

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
  onOpenSidebar?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSidebar,
  className = "",
}) => {
  return (
    <nav
      className={`h-16 w-full border-b border-neutral-800 backdrop-blur-xl ${className}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-10xl mx-auto h-full px-4 md:px-8">
        <div className="grid h-full grid-cols-3 items-center">
          {/* Columna izquierda: QuantumOrb + botón móvil */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="text-accent-cyan focus:ring-accent-cyan rounded-lg border border-neutral-800 bg-neutral-900 p-2 hover:bg-neutral-800 focus:ring-2 focus:outline-none md:hidden"
              aria-label="Abrir menú lateral"
            >
              <i className="fas fa-bars" aria-hidden="true" />
            </button>
            <QuantumOrb />
          </div>

          {/* Columna central: SystemHealth (centrado) */}
          <div className="flex justify-end">
            <SystemHealth />
          </div>
        </div>
      </div>
    </nav>
  );
};
