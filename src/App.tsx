/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useState, useEffect } from 'react'
import { Profile } from './features/usuarios/components/Profile'
import { Hero } from './components/common/Hero'
import { AuthForm } from './features/auth/components/AuthForm'
import { SimulationPanel } from './features/simulation/components/SimulationPanel'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import SimulationRun from './features/simulation/pages/SimulationRun'
import { About } from './layouts/about/about'
import { OverviewDashboard } from './layouts/dashboard/OverviewDashboard'
import { LicenseView } from './layouts/legal/LicenseView'
import { PrivacyPolicy } from './layouts/legal/PrivacyPolicy'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Función auxiliar para cerrar sesión (evita repetir código)
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    window.location.hash = '#/';
  };

  if (!isAuthenticated) {
    return (
      <AuthForm onLoginSuccess={(u: any) => { setIsAuthenticated(true); setUser(u); }} />
    );
  }

  // --- RUTAS EXISTENTES ---
  if (route === '#/profile') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <Profile user={user} onLogout={logout} />
      </DashboardLayout>
    );
  }

  if (route === '#/simulacrum') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <SimulationPanel />
      </DashboardLayout>
    );
  }

  if (route.startsWith('#/simulacrum/run') || route.startsWith('#/simulacrum/view')) {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <SimulationRun />
      </DashboardLayout>
    );
  }

  if (route === '#/overview') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <OverviewDashboard />
      </DashboardLayout>
    );
  }

  if (route === '#/about') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <About />
      </DashboardLayout>
    );
  }

  if (route === '#/privacy-policy') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <PrivacyPolicy />
      </DashboardLayout>
    );
  }

  if (route === '#/license') {
    return (
      <DashboardLayout user={user} onLogout={logout}>
        <LicenseView />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <Hero />
    </DashboardLayout>
  )
}
export default App