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
        <h2 className="text-3xl font-bold text-center">Proyectos destacados</h2>
        <p className="mt-3 text-slate-300 max-w-2xl mx-auto text-center">
          Explora pilotos de simulacros y analitica aplicada a evaluaciones. Cada proyecto resume objetivos, metodologia y resultados esperados.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-800 rounded p-4 bg-slate-950">
          <h3 className="font-semibold">Simulacro adaptativo</h3>
          <p className="mt-2 text-sm text-slate-400">Banco de preguntas con dificultad ajustable y retroalimentacion inmediata.</p>
          </div>
          <div className="border border-slate-800 rounded p-4 bg-slate-950">
          <h3 className="font-semibold">Mapa de competencias</h3>
          <p className="mt-2 text-sm text-slate-400">Visualizacion de fortalezas y brechas por componente evaluado.</p>
          </div>
          <div className="border border-slate-800 rounded p-4 bg-slate-950">
          <h3 className="font-semibold">Analitica de cohortes</h3>
          <p className="mt-2 text-sm text-slate-400">Comparativos por programa, semestre y resultados historicos.</p>
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
          <p>Metodologia basada en resultados historicos y practicas recomendadas para mejorar el rendimiento.</p>
          <p>Seguimiento por usuario, programa y cohortes, con reportes exportables y analisis por componente.</p>
          <p>Enfoque practico: simulacros con retroalimentacion y rutas de mejora personalizadas.</p>
        </div>
        </div>
      </div>
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
