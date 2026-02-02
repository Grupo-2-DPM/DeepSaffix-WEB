import './App.css'
import { Hero } from './components/common/Hero'
import { Footer } from './layouts/footer/Footer'
import { Navbar } from './layouts/navbar/Navbar'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
  <body className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <h1 className="text-4xl font-bold text-sky-400 drop-shadow-lg">
          ¡Tailwind funcionando!
        </h1>
        <DashboardPage></DashboardPage>
        <Hero />
        {/* Aquí irían más secciones como 'Features' o 'Pricing' */}
      </main>
      <Footer />
    </div>
  </body>
  )
}

export default App
