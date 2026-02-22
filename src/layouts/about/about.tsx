import React from 'react';
import { TEAM_MEMBERS } from './about.data'; // Se mantiene import aunque luego usemos datos propios
import { TECH_STACK } from './about.data' // Se mantiene import aunque luego usemos datos propios
import { FEATURES } from './about.data' // Se mantiene import aunque luego usemos datos propios

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Título principal */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight">
            <span className="text-accent-cyan">❯</span> DeepSaffix
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto font-mono text-sm">
            Plataforma de preparación para las pruebas Saber Pro · Grupo 2 · Diplomado MA26
          </p>
        </div>

        {/* Descripción general */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 max-w-3xl mx-auto">
          <p className="text-neutral-300 font-mono text-sm leading-relaxed">
            DeepSaffix centraliza simulacros, reportes y seguimiento académico para preparar las pruebas Saber Pro con información clara y actualizada. Realiza simulacros completos, consulta resultados detallados por componente y mejora tu puntuación con intentos adicionales.
          </p>
        </div>

        {/* Características (de la solución) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <i className={`fas ${feat.icon} text-accent-cyan text-sm`}></i>
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

        {/* Equipo */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-users text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Equipo</h2>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
              5 MIEMBROS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.nombre}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-accent-cyan font-mono text-sm border border-neutral-700">
                    {member.nombre.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-mono text-sm font-medium truncate">
                      {member.nombre}
                    </h3>
                    <p className="text-accent-cyan font-mono text-[10px] tracking-widest uppercase">
                      {member.rol}
                    </p>
                    <p className="text-neutral-500 font-mono text-[9px] mt-1">
                      {member.especialidad}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[8px] font-mono tracking-wider text-neutral-400 border border-neutral-800 px-1.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tecnología */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <i className="fas fa-code text-accent-cyan text-sm"></i>
            <h2 className="text-white font-mono text-sm tracking-widest uppercase">Stack Tecnológico</h2>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
              4 TECNOLOGÍAS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TECH_STACK.map((cat) => (
              <div key={cat.categoria} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
                <h3 className="text-white font-mono text-xs tracking-widest uppercase mb-3">
                  {cat.categoria}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono tracking-wider text-neutral-300 border border-neutral-700 bg-neutral-800/50 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;