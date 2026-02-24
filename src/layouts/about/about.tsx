import React from 'react';
import { TECH_STACK } from './about.data' // Se mantiene import aunque luego usemos datos propios
import { FEATURES } from './about.data' // Se mantiene import aunque luego usemos datos propios

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Cabecera con badges */}
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-900 px-3 py-1.5 rounded-full">
              ⚡ ESTADO: EN DESARROLLO
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-900 px-3 py-1.5 rounded-full">
              🛡️ LICENCIA: MIT
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-900 px-3 py-1.5 rounded-full">
              📦 VERSIÓN: 1.0.0
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
            <span className="text-accent-cyan animate-pulse">❯</span> DeepSaffix
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto font-mono text-sm border border-neutral-800 bg-neutral-900/50 p-4 rounded-lg">
            Optimización Inteligente para Pruebas Saber Pro · Grupo 2 · Diplomado MA26
          </p>
        </div>

        {/* Visión del Producto */}
        <section className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-eye text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Visión del Producto</h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-neutral-700 transition-all">
            <p className="text-neutral-300 font-mono text-sm leading-relaxed">
              <span className="text-accent-cyan font-bold">DeepSaffix</span> es una herramienta diseñada para agilizar y estructurar el proceso de preparación para la prueba <strong className="text-white">Saber Pro</strong>. A diferencia de los métodos tradicionales, nuestra plataforma especializada analiza resultados y refuerza actividades de alto impacto, optimizando el tiempo de estudio y haciendo más eficiente el esfuerzo del estudiante para alcanzar la excelencia académica.
            </p>
          </div>
        </section>

        {/* Planteamiento del Problema */}
        <section className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-exclamation-triangle text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Planteamiento del Problema</h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 hover:border-neutral-700 transition-all">
            <blockquote className="text-neutral-400 font-mono text-sm italic border-l-4 border-accent-cyan pl-4 mb-6">
              “La presentación de las pruebas Saber Pro es un requisito fundamental para titularse en Colombia. Alcanzar un alto desempeño requiere que el estudiante refuerce sus conocimientos, realice simulacros y analice sistemáticamente sus resultados. Sin embargo, actualmente no existe una plataforma especializada que acompañe al estudiante en estas actividades de forma estructurada y eficiente.”
            </blockquote>
            <ul className="space-y-3 text-neutral-300 font-mono text-xs">
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span><strong className="text-white">Falta de Centralización:</strong> Los recursos están dispersos, dificultando el estudio autónomo.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span><strong className="text-white">Procesos no Optimizados:</strong> Los estudiantes invierten tiempo ineficiente en temas que no dominan.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span><strong className="text-white">Ausencia de Seguimiento:</strong> No hay herramientas que permitan un análisis sistemático de los simulacros.</span>
              </li>
            </ul>
            <p className="mt-6 text-neutral-400 font-mono text-sm border-t border-neutral-800 pt-4">
              <span className="text-accent-cyan font-bold">Nuestra Solución:</span> DeepSaffix agiliza y estructura el proceso de preparación analizando resultados y reforzando actividades de alto impacto.
            </p>
          </div>
        </section>

        {/* Características (usando FEATURES array) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-cubes text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Características Clave</h2>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
              {FEATURES.length} MÓDULOS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <i className={`fas ${feat.icon} text-accent-cyan text-lg group-hover:scale-110 transition-transform`}></i>
                  <h3 className="text-white font-mono text-xs tracking-widest uppercase">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-neutral-400 font-mono text-[10px] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stack Tecnológico (usando TECH_STACK) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-code text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Stack Tecnológico</h2>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
              {TECH_STACK.reduce((acc, cat) => acc + cat.items.length, 0)} TECNOLOGÍAS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TECH_STACK.map((cat) => (
              <div key={cat.categoria} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all">
                <h3 className="text-white font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-accent-cyan rounded-full"></span>
                  {cat.categoria}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono tracking-wider text-neutral-300 border border-neutral-700 bg-neutral-800/50 px-2 py-1 rounded hover:bg-brand-600/20 hover:border-brand-600 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo de Desarrollo (estático, con enlaces a GitHub) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-users text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Equipo de Desarrollo (Grupo 2)</h2>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
              5 MIEMBROS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Daniel Lasso */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 transition-all group">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://avatars.githubusercontent.com/Gerbetwo"
                  alt="Daniel Lasso"
                  className="w-20 h-20 rounded-full border-2 border-neutral-700 group-hover:border-accent-cyan transition-all"
                />
                <div className="flex-1">
                  <h3 className="text-white font-mono text-lg font-medium">Daniel Alejandro Lasso</h3>
                  <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-2">Backend Developer</p>
                  <p className="text-neutral-400 font-mono text-sm mb-3">
                    Especialista Backend (Node.js & Django). Desarrollador con dominio en TypeScript, JavaScript y Python. Especializado en crear aplicaciones robustas y manejo experto de bases de datos relacionales (PostgreSQL, MySQL) y administración de Linux.
                  </p>
                  <a
                    href="https://github.com/Gerbetwo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    <i className="fab fa-github"></i> Gerbetwo
                  </a>
                </div>
              </div>
            </div>

            {/* Henry Guillen */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 transition-all group">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://github.com/Ryse-08.png"
                  alt="Henry Guillen"
                  className="w-20 h-20 rounded-full border-2 border-neutral-700 group-hover:border-accent-cyan transition-all"
                />
                <div className="flex-1">
                  <h3 className="text-white font-mono text-lg font-medium">Henry Fabian Guillen</h3>
                  <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-2">Backend</p>
                  <p className="text-neutral-400 font-mono text-sm mb-3">
                    Desarrollador de software con enfoque en Backend e Inteligencia Artificial. Trabajo principalmente con Python, Java y PostgreSQL. Interesado en diseñar soluciones escalables, eficientes y basadas en datos.
                  </p>
                  <a
                    href="https://github.com/Ryse-08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    <i className="fab fa-github"></i> Ryse-08
                  </a>
                </div>
              </div>
            </div>

            {/* Omar Hualpa */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 transition-all group">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://github.com/jhonomar1403.png"
                  alt="Omar Hualpa"
                  className="w-20 h-20 rounded-full border-2 border-neutral-700 group-hover:border-accent-cyan transition-all"
                />
                <div className="flex-1">
                  <h3 className="text-white font-mono text-lg font-medium">Omar Jhon Hualpa</h3>
                  <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-2">Software Developer</p>
                  <p className="text-neutral-400 font-mono text-sm mb-3">
                    Interés en aplicaciones web y arquitectura de sistemas. Experiencia en C#, .NET y SQL. Enfocado en soluciones modulares, eficientes y mantenibles, integrando buenas prácticas de desarrollo colaborativo.
                  </p>
                  <a
                    href="https://github.com/jhonomar1403"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    <i className="fab fa-github"></i> jhonomar1403
                  </a>
                </div>
              </div>
            </div>

            {/* Marily Botina */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 transition-all group">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://github.com/Marily123.png"
                  alt="Marily Botina"
                  className="w-20 h-20 rounded-full border-2 border-neutral-700 group-hover:border-accent-cyan transition-all"
                />
                <div className="flex-1">
                  <h3 className="text-white font-mono text-lg font-medium">Marily Yojana Botina</h3>
                  <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-2">Frontend Focus</p>
                  <p className="text-neutral-400 font-mono text-sm mb-3">
                    Enfoque principal en Frontend. Conocimientos básicos en Python y PostgreSQL. Motivada por fortalecer habilidades técnicas y profundizar en metodologías ágiles para mejorar la calidad y organización del desarrollo.
                  </p>
                  <a
                    href="https://github.com/Marily123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    <i className="fab fa-github"></i> Marily123
                  </a>
                </div>
              </div>
            </div>

            {/* Nidia Muñoz */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-brand-600 transition-all group">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="https://github.com/Nidiia08.png"
                  alt="Nidia Muñoz"
                  className="w-20 h-20 rounded-full border-2 border-neutral-700 group-hover:border-accent-cyan transition-all"
                />
                <div className="flex-1">
                  <h3 className="text-white font-mono text-lg font-medium">Nidia Jael Muñoz</h3>
                  <p className="text-accent-cyan font-mono text-xs tracking-widest uppercase mb-2">Software Developer</p>
                  <p className="text-neutral-400 font-mono text-sm mb-3">
                    Entusiasta del desarrollo de software con conocimientos en Python, JavaScript, TypeScript y PostgreSQL. Interesada en fortalecer habilidades a través de proyectos prácticos.
                  </p>
                  <a
                    href="https://github.com/Nidiia08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-mono text-neutral-400 border border-neutral-800 bg-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-all"
                  >
                    <i className="fab fa-github"></i> Nidiia08
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-600 font-mono text-[10px] tracking-widest">
            © 2024 DeepSaffix · Grupo 2 · Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;