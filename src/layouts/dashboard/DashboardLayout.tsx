import React, { useState } from "react";
import { Navbar, type User } from "../../components/Navbar/Navbar";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Footer } from "../../components/Footer/Footer";
import { SIDEBAR_ITEMS } from "../../components/Sidebar/sidebar.data";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
  activePath: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  onLogout,
  activePath,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen">

      <div
        className="
          grid
          grid-cols-[auto_1fr]
          grid-rows-[auto_1fr_auto]
          h-full
        "
      >

        {/* SIDEBAR */}
        <div className="row-span-3">
          <Sidebar
            items={SIDEBAR_ITEMS}
            activePath={activePath}
            isMobileOpen={isMobileOpen}
            onCloseMobile={() => setIsMobileOpen(false)}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* NAVBAR */}
        <div className="sticky top-0 z-50">
          <Navbar
            user={user}
            onLogout={onLogout}
            onOpenSidebar={() => setIsMobileOpen(true)}
          />
        </div>

        {/* MAIN */}
        <main
          role="main"
          className="overflow-y-auto "
        >
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default DashboardLayout;