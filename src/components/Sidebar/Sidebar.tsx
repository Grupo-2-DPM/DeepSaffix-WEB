import React from "react";
import { SidebarNav } from "./SidebarNav";
import { SidebarHeader } from "./SidebarHeader";
import { type SidebarItemType } from "./sidebar.types";

interface SidebarProps {
  items: SidebarItemType[];
  activePath: string;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activePath,
  isMobileOpen,
  onCloseMobile,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <>
      {/* Overlay móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          hidden md:flex
          flex-col
          ${collapsed ? "w-20" : "w-50"}
          bg-neutral-950
          border-r border-neutral-800
          transition-all duration-300
          shrink-0

          sticky top-0
          h-screen
        `}
      >
        <div className="flex flex-col h-full">

          <SidebarHeader
            collapsed={collapsed}
            onToggleCollapse={onToggleCollapse}
          />

          <SidebarNav
            items={items}
            activePath={activePath}
            collapsed={collapsed}
          />

        </div>
      </aside>
    </>
  );
};