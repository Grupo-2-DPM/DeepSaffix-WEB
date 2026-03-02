import React from "react";

interface SidebarFooterProps {
  collapsed: boolean;
  user?: {
    nombre?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  collapsed,
  user,
  onLogout,
}) => {
  if (!user) return null;

  return (
    <div className="mt-auto border-t border-neutral-800 p-3">
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {/* Nombre */}
        {!collapsed && (
          <span className="truncate text-sm font-medium text-white">
            {user.nombre ?? "Usuario"}
          </span>
        )}

        {/* Botón logout (solo icono) */}
        <button
          onClick={onLogout}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all duration-200 hover:border-red-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
          title="Cerrar sesión"
        >
          <i className="fas fa-sign-out-alt" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
