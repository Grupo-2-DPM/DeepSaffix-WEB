import React, { useEffect, useRef } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activePath,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      sidebarRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay accesible */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200
                    md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        tabIndex={-1}
        role="navigation"
        aria-label="Sidebar navigation"
        aria-hidden={!isOpen}
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-neutral-950 border-r border-neutral-800
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">
          <SidebarHeader />
          <SidebarNav activePath={activePath} onNavigate={onClose} />
        </div>
      </aside>
    </>
  );
};