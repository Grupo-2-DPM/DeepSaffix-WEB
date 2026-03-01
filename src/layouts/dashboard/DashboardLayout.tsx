import React, { useState } from "react";
import { Navbar, type User } from "../../components/Navbar/Navbar";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Footer } from "../../components/Footer/Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  activePath: string; // viene del router
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  onLogout,
  activePath,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">

      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={onLogout}
        onOpenSidebar={handleOpenSidebar}
        className="fixed top-0 left-0 w-full z-50"
      />

      <div className="flex flex-1 pt-16">

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          activePath={activePath}
        />

        {/* Main Content */}
        <main
          role="main"
          className="
            flex-1
            w-full
            max-w-7xl
            mx-auto
            px-6 md:px-12
            py-8
            focus:outline-none
          "
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;