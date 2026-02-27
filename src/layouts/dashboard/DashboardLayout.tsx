import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Navbar } from '../navbar/Navbar'; // nuestro Navbar adaptado
import { Footer } from '../footer/Footer';

interface Props {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<Props> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar (ya adaptado) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 md:ml-64 min-w-0">
        <Navbar setSidebarOpen={setSidebarOpen} user={user} onLogout={onLogout} />

        {/* Añadimos un margin-top o padding-top para compensar el tamaño de la Navbar */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 animate-fade-in">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
