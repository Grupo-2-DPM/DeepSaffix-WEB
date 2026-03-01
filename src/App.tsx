/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componentes Base
import NeuralPulseBackground from './components/common/NeuralPulseBackground';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

// Vistas de Negocio
import { Profile } from './features/usuarios/components/Profile';
import { Hero } from './components/common/Hero';
import { AuthForm } from './features/auth/components/AuthForm';
import { SimulationPanel } from './features/simulation/components/SimulationPanel';
import SimulationRun from './features/simulation/pages/SimulationRun';
import { OverviewDashboard } from './layouts/dashboard/OverviewDashboard';

// Vistas Legales e Info
import { About } from './components/About/about';
import { LicenseView } from './components/Legal/LicenseView';
import { PrivacyPolicy } from './components/Legal/PrivacyPolicy';

function App() {
  // --- ESTADO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [route, setRoute] = useState<string>(window.location.hash || '#/');

  // --- EFECTOS ---
  useEffect(() => {
    // Sincronizar hash de la URL
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);

    // Persistencia SEGURA
    const storedUser = localStorage.getItem('user');

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Si no es un objeto válido, limpiamos basura
          localStorage.removeItem('user');
        }
      } catch (e) {
        console.error("Error al recuperar sesión:", e);
        localStorage.removeItem('user'); // Limpiamos el JSON corrupto
      }
    }

    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // --- ACCIONES ---
  const handleLogin = (u: any) => {
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(u));
    // Opcional: Redirigir al home tras login
    window.location.hash = '#/';
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    window.location.hash = '#/';
  };

  // --- ENRUTADOR DINÁMICO ---
  // Extraemos la lógica de qué vista mostrar para mantener el JSX limpio
  const renderCurrentView = () => {
    switch (true) {
      case route === '#/profile':
        return <Profile user={user} onLogout={handleLogout} />;
      case route === '#/simulacrum':
        return <SimulationPanel />;
      case route.startsWith('#/simulacrum/run') || route.startsWith('#/simulacrum/view'):
        return <SimulationRun />;
      case route === '#/overview':
        return <OverviewDashboard />;
      case route === '#/about':
        return <About />;
      case route === '#/privacy-policy':
        return <PrivacyPolicy />;
      case route === '#/license':
        return <LicenseView />;
      default:
        return <Hero />;
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-slate-200 selection:bg-accent-cyan/20">

      {/* FONDO GLOBAL: Siempre presente, pero no interactuable */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralPulseBackground />
      </div>

      <main className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">

          {/* LÓGICA DE SEGURIDAD PRIMARIA: Si no está autenticado, solo AuthForm */}
          {!isAuthenticated ? (
            <motion.div
              key="auth-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center min-h-screen"
            >
              <AuthForm onLoginSuccess={handleLogin} />
            </motion.div>
          ) : (
            /* SI ESTÁ AUTENTICADO: Dashboard Layout + Vistas Animadas */
            <motion.div
              key="dashboard-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DashboardLayout
                user={user}
                onLogout={handleLogout}
                activePath={route}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={route} // Clave vital para que la animación ocurra al cambiar de ruta
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderCurrentView()}
                  </motion.div>
                </AnimatePresence>
              </DashboardLayout>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;