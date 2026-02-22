import React, { useEffect, useState } from 'react';
import { NAV_LINKS } from '../navbar/navbar.data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const [active, setActive] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setActive(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-neutral-950 border-r border-neutral-800 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-200 ease-in-out z-40
          shadow-[2px_0_15px_-5px_rgba(0,242,255,0.15)]`}
      >
        <div className="h-full flex flex-col">
          {/* Cabecera con logo y versión (estilo consola) */}
          <div className="px-6 py-6 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <i className="fas fa-terminal text-accent-cyan text-sm"></i>
              <span className="text-white font-mono text-lg tracking-wider">
                DeepSaffix
              </span>
              <span className="text-[10px] font-bold tracking-widest text-neutral-600 border border-neutral-800 px-1.5 py-0.5 rounded">
                v1.0.0
              </span>
            </div>
          </div>
          {/* Navegación */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => onClose()}
                      className={`
                        group flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 active:scale-95
                        ${isActive
                          ? "bg-neutral-900 text-accent-cyan border-l-2 border-accent-cyan"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-accent-cyan"
                        }
                      `}
                    >
                      {/* Indicador de "cursor" solo en hover/active */}
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-accent-400">
                        {isActive ? ">" : "$"}
                      </span>
                      <span className="text-sm font-medium tracking-wide">
                        {link.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
