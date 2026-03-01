import React from "react";
import { Brand } from "./Brand";
import { Telemetry } from "./Telemetry";
import { UserMenu } from "./UserMenu";

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
      className={`w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-xl ${className}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Mobile menu button */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-accent-cyan
                       hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            aria-label="Open sidebar menu"
          >
            <i className="fas fa-bars" aria-hidden="true"></i>
          </button>

          <Brand />

          <Telemetry />

          <UserMenu user={user} onLogout={onLogout} />

        </div>
      </div>
    </nav>
  );
};