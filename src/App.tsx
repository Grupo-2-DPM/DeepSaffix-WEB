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

  if (route === '#/proyectos') {
    if (!isAuthenticated) {
      return (
        <AuthForm onLoginSuccess={(u:any) => { setIsAuthenticated(true); setUser(u); window.location.hash = '#/proyectos'; }} />
      );
    }

    return (
      <DashboardLayout user={user} onLogout={() => { setIsAuthenticated(false); setUser(null); localStorage.removeItem('user'); window.location.hash = '#/'; }}>
      <div className="w-full p-6 bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="max-w-4xl w-full">
        <div className="mb-4">
          <a href="#/" className="text-gray-800 underline">&larr; Volver</a>
        </div>
        <h2 className="text-3xl font-bold text-center">Proyectos</h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-center">
          Realiza simulacros de pruebas Saber Pro y consulta tus resultados. Practica con preguntas similares a las reales y mejora tu desempeño.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded p-4 bg-slate-950">
          <h3 className="font-semibold">Realizar Simulacro</h3>
          <p className="mt-2 text-sm text-slate-400">Accede a nuevos simulacros y practica con preguntas de todas las competencias.</p>
          </div>
          <div className="border border-slate-800 rounded p-4 bg-slate-950">
          <h3 className="font-semibold">Ver Resultados</h3>
          <p className="mt-2 text-sm text-slate-400">Consulta el desempeño de tus simulacros anteriores y tu progreso.</p>
          </div>
        </div>
        </div>
      </div>
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
      <div className="w-full p-6 bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="max-w-4xl w-full">
        <div className="mb-4">
          <a href="#/" className="text-gray-800 underline">&larr; Volver</a>
        </div>
        <h2 className="text-3xl font-bold text-center">Sobre DeepSaffix</h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-center">
          DeepSaffix centraliza simulacros, reportes y seguimiento academico para preparar las pruebas Saber Pro con informacion clara.
        </p>
        <div className="mt-6 space-y-3 max-w-2xl mx-auto text-slate-300 text-center">
            <p>Realiza simulacros completos de las pruebas Saber Pro con preguntas actualizadas.</p>
            <p>Consulta tus resultados detallados y analiza tu desempeño por componente.</p>
            <p>Intenta los simulacros nuevamente para mejorar tu puntuación y prepararte mejor.</p>
        </div>
        </div>
      </div>
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
