import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Footer } from '../footer/Footer';

interface Props {
  children: React.ReactNode;
  user?: any;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<Props> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 md:ml-64">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100" aria-label="Open sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div className="text-lg font-semibold text-slate-800">DeepSaffix</div>
            </div>

            <div className="flex items-center gap-4">
              {user && <div className="hidden sm:block text-sm text-slate-600">Hola, {user.nombre ?? user.name ?? 'Usuario'}</div>}
              {onLogout && <button onClick={onLogout} className="text-sm text-slate-600 hover:text-slate-800">Cerrar sesión</button>}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
