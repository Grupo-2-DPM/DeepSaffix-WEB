import React from 'react';
import { UserMenu } from './UserMenu';
import { QuantumOrb } from './QuantumOrb';

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
  className = '',
}) => {
  return (
    <nav
      className={`w-full h-16 border-b border-neutral-800 backdrop-blur-xl ${className}`}
      role="navigation"
      aria-label="Main Navigation"
    >

      <div className="mx-auto max-w-10xl md:px-8 h-full">
        <div className="grid grid-cols-2 items-center h-full">

          {/* Columna izquierda: carrusel */}
          <div className="flex justify-start">
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-accent-cyan
                         hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              aria-label="Open sidebar menu"
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
            </button>
            <UserMenu user={user} onLogout={onLogout} />

          </div>


          {/* Columna derecha: botón móvil y menú de usuario */}
          <div className="flex justify-end items-center gap-2">
            <QuantumOrb />
          </div>

        </div>
      </div>
    </nav>
  );
};