import React from "react";
import { TECH_STACK } from "./about.data";
import { FEATURES } from "./about.data";

export const About: React.FC = () => {
  return (
    <div className="animate-fade-in min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Cabecera con badges */}
        <div className="space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-neutral-400">
              ⚡ ESTADO: EN PRODUCCION
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-neutral-400">
              🛡️ LICENCIA: MIT
            </span>
            <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-neutral-400">
              📦 VERSIÓN: 1.0.0
            </span>
          </div>
          <h1 className="font-mono text-5xl font-bold tracking-tight text-white md:text-6xl">
            <span className="text-accent-cyan animate-pulse">❯</span> DeepSaffix
          </h1>
          <p className="mx-auto max-w-2xl rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 font-mono text-sm text-neutral-400">
            Optimización Inteligente para Pruebas Saber Pro · Grupo 2 ·
            Diplomado MA26
          </p>
        </div>

        {/* Visión del Producto */}
        <section className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-eye text-accent-cyan text-sm"></i>
            <h2 className="font-mono text-sm tracking-widest text-white uppercase">
              Visión del Producto
            </h2>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 transition-all hover:border-neutral-700">
            <p className="font-mono text-sm leading-relaxed text-neutral-300">
              <span className="text-accent-cyan font-bold">DeepSaffix</span> es
              una herramienta diseñada para agilizar y estructurar el proceso de
              preparación para la prueba{" "}
              <strong className="text-white">Saber Pro</strong>. A diferencia de
              los métodos tradicionales, nuestra plataforma especializada
              analiza resultados y refuerza actividades de alto impacto,
              optimizando el tiempo de estudio y haciendo más eficiente el
              esfuerzo del estudiante para alcanzar la excelencia académica.
            </p>
          </div>
        </section>

        {/* Planteamiento del Problema */}
        <section className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-exclamation-triangle text-accent-cyan text-sm"></i>
            <h2 className="font-mono text-sm tracking-widest text-white uppercase">
              Planteamiento del Problema
            </h2>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 transition-all hover:border-neutral-700">
            <blockquote className="border-accent-cyan mb-6 border-l-4 pl-4 font-mono text-sm text-neutral-400 italic">
              “La presentación de las pruebas Saber Pro es un requisito
              fundamental para titularse en Colombia. Alcanzar un alto desempeño
              requiere que el estudiante refuerce sus conocimientos, realice
              simulacros y analice sistemáticamente sus resultados. Sin embargo,
              actualmente no existe una plataforma especializada que acompañe al
              estudiante en estas actividades de forma estructurada y
              eficiente.”
            </blockquote>
            <ul className="space-y-3 font-mono text-xs text-neutral-300">
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span>
                  <strong className="text-white">
                    Falta de Centralización:
                  </strong>{" "}
                  Los recursos están dispersos, dificultando el estudio
                  autónomo.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span>
                  <strong className="text-white">
                    Procesos no Optimizados:
                  </strong>{" "}
                  Los estudiantes invierten tiempo ineficiente en temas que no
                  dominan.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-cyan mt-1">⨯</span>
                <span>
                  <strong className="text-white">
                    Ausencia de Seguimiento:
                  </strong>{" "}
                  No hay herramientas que permitan un análisis sistemático de
                  los simulacros.
                </span>
              </li>
            </ul>
            <p className="mt-6 border-t border-neutral-800 pt-4 font-mono text-sm text-neutral-400">
              <span className="text-accent-cyan font-bold">
                Nuestra Solución:
              </span>{" "}
              DeepSaffix agiliza y estructura el proceso de preparación
              analizando resultados y reforzando actividades de alto impacto.
            </p>
          </div>
        </section>

        {/* Características (usando FEATURES array) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-cubes text-accent-cyan text-sm"></i>
            <h2 className="font-mono text-sm tracking-widest text-white uppercase">
              Características Clave
            </h2>
            <span className="ml-auto rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
              {FEATURES.length} MÓDULOS
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="group hover:border-brand-600 rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4 flex items-center gap-3">
                  <i
                    className={`fas ${feat.icon} text-accent-cyan text-lg transition-transform group-hover:scale-110`}
                  ></i>
                  <h3 className="font-mono text-xs tracking-widest text-white uppercase">
                    {feat.title}
                  </h3>
                </div>
                <p className="font-mono text-[10px] leading-relaxed text-neutral-400">
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
            <h2 className="font-mono text-sm tracking-widest text-white uppercase">
              Stack Tecnológico
            </h2>
            <span className="ml-auto rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
              {TECH_STACK.reduce((acc, cat) => acc + cat.items.length, 0)}{" "}
              TECNOLOGÍAS
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {TECH_STACK.map((cat) => (
              <div
                key={cat.categoria}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-neutral-700"
              >
                <h3 className="mb-4 flex items-center gap-2 font-mono text-xs tracking-widest text-white uppercase">
                  <span className="bg-accent-cyan h-4 w-1 rounded-full"></span>
                  {cat.categoria}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="hover:bg-brand-600/20 hover:border-brand-600 rounded border border-neutral-700 bg-neutral-800/50 px-2 py-1 font-mono text-[9px] tracking-wider text-neutral-300 transition-all"
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
            <h2 className="font-mono text-sm tracking-widest text-white uppercase">
              Equipo de Desarrollo (Grupo 2)
            </h2>
            <span className="ml-auto rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-500">
              5 MIEMBROS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Daniel Lasso */}
            <div className="hover:border-brand-600 group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src="https://avatars.githubusercontent.com/Gerbetwo"
                  alt="Daniel Lasso"
                  className="group-hover:border-accent-cyan h-20 w-20 rounded-full border-2 border-neutral-700 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-medium text-white">
                    Daniel Alejandro Lasso
                  </h3>
                  <p className="text-accent-cyan mb-2 font-mono text-xs tracking-widest uppercase">
                    Full Stack Developer
                  </p>
                  <p className="mb-3 font-mono text-sm text-neutral-400">
                    Especialista Backend (Node.js & Django). Desarrollador con
                    dominio en TypeScript, JavaScript y Python. Especializado en
                    crear aplicaciones robustas y administración de Linux.
                  </p>
                  <a
                    href="https://github.com/Gerbetwo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
                  >
                    <i className="fab fa-github"></i> Gerbetwo
                  </a>
                </div>
              </div>
            </div>

            {/* Henry Guillen */}
            <div className="hover:border-brand-600 group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src="https://github.com/Ryse-08.png"
                  alt="Henry Guillen"
                  className="group-hover:border-accent-cyan h-20 w-20 rounded-full border-2 border-neutral-700 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-medium text-white">
                    Henry Fabian Guillen
                  </h3>
                  <p className="text-accent-cyan mb-2 font-mono text-xs tracking-widest uppercase">
                    Backend
                  </p>
                  <p className="mb-3 font-mono text-sm text-neutral-400">
                    Desarrollador de software con enfoque en Backend e
                    Inteligencia Artificial. Trabajo principalmente con Python,
                    Java y PostgreSQL. Interesado en diseñar soluciones
                    escalables, eficientes y basadas en datos.
                  </p>
                  <a
                    href="https://github.com/Ryse-08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
                  >
                    <i className="fab fa-github"></i> Ryse-08
                  </a>
                </div>
              </div>
            </div>

            {/* Omar Hualpa */}
            <div className="hover:border-brand-600 group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src="https://github.com/jhonomar1403.png"
                  alt="Omar Hualpa"
                  className="group-hover:border-accent-cyan h-20 w-20 rounded-full border-2 border-neutral-700 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-medium text-white">
                    Omar Jhon Hualpa
                  </h3>
                  <p className="text-accent-cyan mb-2 font-mono text-xs tracking-widest uppercase">
                    Software Developer
                  </p>
                  <p className="mb-3 font-mono text-sm text-neutral-400">
                    Interés en aplicaciones web y arquitectura de sistemas.
                    Enfocado en soluciones modulares, eficientes y mantenibles,
                    integrando buenas prácticas de desarrollo colaborativo.
                  </p>
                  <a
                    href="https://github.com/jhonomar1403"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
                  >
                    <i className="fab fa-github"></i> jhonomar1403
                  </a>
                </div>
              </div>
            </div>

            {/* Marily Botina */}
            <div className="hover:border-brand-600 group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src="https://github.com/Marily123.png"
                  alt="Marily Botina"
                  className="group-hover:border-accent-cyan h-20 w-20 rounded-full border-2 border-neutral-700 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-medium text-white">
                    Marily Yojana Botina
                  </h3>
                  <p className="text-accent-cyan mb-2 font-mono text-xs tracking-widest uppercase">
                    Frontend Focus
                  </p>
                  <p className="mb-3 font-mono text-sm text-neutral-400">
                    Enfoque principal en Frontend. Conocimientos básicos en
                    Python y PostgreSQL. Motivada por fortalecer habilidades
                    técnicas y profundizar en metodologías ágiles para mejorar
                    la calidad y organización del desarrollo.
                  </p>
                  <a
                    href="https://github.com/Marily123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
                  >
                    <i className="fab fa-github"></i> Marily123
                  </a>
                </div>
              </div>
            </div>

            {/* Nidia Muñoz */}
            <div className="hover:border-brand-600 group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-all">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <img
                  src="https://github.com/Nidiia08.png"
                  alt="Nidia Muñoz"
                  className="group-hover:border-accent-cyan h-20 w-20 rounded-full border-2 border-neutral-700 transition-all"
                />
                <div className="flex-1">
                  <h3 className="font-mono text-lg font-medium text-white">
                    Nidia Jael Muñoz
                  </h3>
                  <p className="text-accent-cyan mb-2 font-mono text-xs tracking-widest uppercase">
                    Software Developer
                  </p>
                  <p className="mb-3 font-mono text-sm text-neutral-400">
                    Entusiasta del desarrollo de software con conocimientos en
                    Python, JavaScript, TypeScript y PostgreSQL. Interesada en
                    fortalecer habilidades a través de proyectos prácticos.
                  </p>
                  <a
                    href="https://github.com/Nidiia08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[10px] text-neutral-400 transition-all hover:bg-neutral-800 hover:text-white"
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
          <p className="font-mono text-[10px] tracking-widest text-neutral-600">
            © 2026 DeepSaffix · Grupo 2 · Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;
