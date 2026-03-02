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
          className="fixed inset-0 z-40 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`hidden flex-col md:flex ${collapsed ? "w-20" : "w-50"} sticky top-0 h-screen shrink-0 border-r border-neutral-800 transition-all duration-300`}
      >
        <div className="flex h-full flex-col">
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
