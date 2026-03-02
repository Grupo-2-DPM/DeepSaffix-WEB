import React from "react";
import { UserMenu } from "./UserMenu";
import { QuantumOrb } from "./QuantumOrb";

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
  user,
  onLogout,
  onOpenSidebar,
  className = "",
}) => {
  return (
    <nav
      className={`h-16 w-full border-b border-neutral-800 backdrop-blur-xl ${className}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-10xl mx-auto h-full md:px-8">
        <div className="grid h-full grid-cols-2 items-center">
          {/* Columna izquierda: carrusel */}
          <div className="flex justify-start">
            <button
              onClick={onOpenSidebar}
              className="text-accent-cyan focus:ring-accent-cyan rounded-lg border border-neutral-800 bg-neutral-900 p-2 hover:bg-neutral-800 focus:ring-2 focus:outline-none md:hidden"
              aria-label="Open sidebar menu"
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
            </button>
            <UserMenu user={user} onLogout={onLogout} />
          </div>

          {/* Columna derecha: botón móvil y menú de usuario */}
          <div className="flex items-center justify-end gap-2">
            <QuantumOrb />
          </div>
        </div>
      </div>
    </nav>
  );
};
