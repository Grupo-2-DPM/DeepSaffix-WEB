import React, { useEffect, useState } from 'react';
import { NAV_LINKS } from '../navbar/navbar,data';

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
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={onClose} />}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 z-40`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-slate-800">
            <div className="text-xl font-bold text-white">DeepSaffix</div>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {NAV_LINKS.map(link => {
                const isActive = active === link.href;
                return (
                  <li key={link.href}>
                    <a href={link.href} onClick={() => onClose()} className={`group flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-800 text-sm text-slate-300">
            <div>Soporte • ayuda@deepsaffix.test</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
