/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useState, useEffect } from 'react'
import { Profile } from './features/usuarios/components/Profile'
import { Hero } from './components/common/Hero'
import { AuthForm } from './features/auth/components/AuthForm'
import { SimulationPanel } from './features/simulation/components/SimulationPanel'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import SimulationRun from './features/simulation/pages/SimulationRun'
import {About} from './layouts/about/about'
import { SimulacroContainer } from './components/ui/SimulationDashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!isAuthenticated) {
    return (
      <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); }} />
    );
  }

  if (route === '#/profile') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/profile'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
          <Profile user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }} />
      </DashboardLayout>
    );
  }

  if (route === '#/historial') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/historial'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <SimulationPanel />
      </DashboardLayout>
    );
  }

  if (route.startsWith('#/historial/run')) {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = window.location.hash; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <SimulationRun />
      </DashboardLayout>
    );
  }

  if (route.startsWith('#/historial/view')) {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = window.location.hash; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <SimulationRun />
      </DashboardLayout>
    );
  }

  if (route === '#/simulation') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/simulation'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <SimulacroContainer></SimulacroContainer>
      </DashboardLayout>
    );
    }

    if (route === '#/saber-mas') {
    if (!isAuthenticated) {
      return (
      <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/saber-mas'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <About></About>
      </DashboardLayout>
    );
    }

  return (
    <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
      <Hero />
    </DashboardLayout>
  )
}
export default App
