import './App.css'
import { useState } from 'react'
import { Hero } from './components/common/Hero'
import { AuthForm } from './features/auth/components/AuthForm'
import { Footer } from './layouts/footer/Footer'
import { Navbar } from './layouts/navbar/Navbar'
import { SimulationPanel } from './features/simulation/components/SimulationPanel'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="flex-grow items-center bg-slate-900">
      {/* Solo mostramos la Navbar si está logueado */}
      {isAuthenticated && <Navbar />}

      <main className="flex-grow flex items-center justify-center">
        {!isAuthenticated ? (
          // Si no está logueado, centramos el formulario en la pantalla
          <AuthForm onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          // Si está logueado, mostramos el Hero
          <main className="flex-grow">
            <Hero />
            {/* Aquí irían más secciones como 'Features' o 'Pricing' */}
            {/* Agregamos la nueva sección de simulación */}
            <div className="px-6">
               <SimulationPanel />
            </div>
          </main>
        )}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  )
}
export default App
