import './App.css'
import React, { useState, useEffect } from 'react'
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
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/profile'; }} />
        </div>
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <div className="w-full p-6">
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
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/simulacros'; }} />
        </div>
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
        <div className="max-w-3xl mx-auto w-full">
          <SimulationPanel />
        </div>
      </DashboardLayout>
    );
  }

  if (route.startsWith('#/simulacros/run')) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = window.location.hash; }} />
        </div>
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
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = window.location.hash; }} />
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); }} />
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
      <Hero />

      <div className="p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Panel</h2>
        <p className="text-slate-600">Bienvenido al panel. Usa la navegación para ver tu perfil o simulacros.</p>
      </div>
    </DashboardLayout>
  )
}
export default App
