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
    <div className="min-h-screen bg-neutral-950 flex flex-col">

      {/* Navbar por encima de todo */}
      <Navbar
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={onLogout}
        className="fixed top-0 left-0 w-full z-50"
      />

      <div className="flex flex-1 pt-16 relative">

        {/* Sidebar interna */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="
        fixed top-16 left-0 h-[calc(100vh-4rem)]
        w-64 bg-neutral-900
        transform transition-transform duration-300
        z-40
      "
        />

        {/* Contenido principal */}
        <main className="
      flex-1 w-full
      max-w-7xl mx-auto
      p-6 md:p-12
      animate-fade-in
    ">
          {children}
        </main>

      </div>

      {/* Footer por encima de la sidebar */}
      <Footer className="relative z-50" />
    </div>
  );
};

export default DashboardLayout;
