/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { useState, useEffect } from 'react'
import { Profile } from './features/usuarios/components/Profile'
import { Hero } from './components/common/Hero'
import { AuthForm } from './features/auth/components/AuthForm'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import { SimulationPanel } from './features/simulation/components/SimulationPanel'
import SimulationRun from './features/simulation/pages/SimulationRun'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/profile') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/profile'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <div className="w-full p-6 bg-slate-900 ">
          <div className="mb-4">
            <a href="#/" className="text-gray-800 underline">&larr; Volver</a>
          </div>
          <Profile user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }} />
        </div>
      </DashboardLayout>
    );
  }

  if (route === '#/simulacros') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/simulacros'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <SimulationPanel />
      </DashboardLayout>
    );
  }

  if (route.startsWith('#/simulacros/run')) {
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

  if (route.startsWith('#/simulacros/view')) {
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

  if (!isAuthenticated) {
    return (
      <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); }} />
    );
  }

  return (
    <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
      <Hero />
    </DashboardLayout>
  )
}
export default App
