import { useState } from 'react'
import './App.css'
import { Hero } from './components/common/Hero'
import { AuthForm } from './features/auth/components/AuthForm'
import { Footer } from './layouts/footer/Footer'
import { Navbar } from './layouts/navbar/Navbar'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen  bg-slate-900 flex items-center">
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
            <h1 className="text-4xl font-bold text-sky-400 drop-shadow-lg">
              ¡Tailwind funcionando!
            </h1>
            <DashboardPage></DashboardPage>
            {/* Aquí irían más secciones como 'Features' o 'Pricing' */}
          </main>
        )}
      </main>
      {isAuthenticated && <Footer />}
    </div>
  )
}
export default App
