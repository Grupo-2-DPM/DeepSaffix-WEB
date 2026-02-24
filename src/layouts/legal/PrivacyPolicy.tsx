import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-neutral-850 border-b border-neutral-800 p-4">
          <span className="text-[10px] font-bold tracking-widest text-accent-cyan uppercase">
            Protocolo de Privacidad y Manejo de Datos
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Sección 1 */}
          <section className="space-y-3">
            <h3 className="text-neutral-200 font-semibold flex items-center gap-2">
              <span className="text-brand-500 font-mono">01.</span> Naturaleza del Software
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed pl-8">
              DeepSaffix es una plataforma distribuida con fines <span className="text-neutral-200">estrictamente didácticos y académicos</span>. 
              No existe explotación comercial de ninguna naturaleza sobre los datos procesados en este sistema.
            </p>
          </section>

          {/* Sección 2 - Render.com */}
          <section className="space-y-3">
            <h3 className="text-neutral-200 font-semibold flex items-center gap-2">
              <span className="text-brand-500 font-mono">02.</span> Infraestructura de Datos (Render)
            </h3>
            <div className="bg-neutral-950 border-l-2 border-brand-500 p-4 ml-8">
              <p className="text-sm text-neutral-400">
                La persistencia y el procesamiento de la API se ejecutan sobre la infraestructura de 
                <span className="text-neutral-200 font-medium"> Render.com</span>. El manejo técnico, 
                almacenamiento y cifrado de los datos en reposo está sujeto a las políticas de seguridad 
                de dicho proveedor.
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h3 className="text-neutral-200 font-semibold flex items-center gap-2">
              <span className="text-brand-500 font-mono">03.</span> Recolección de Información
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed pl-8">
              Solo se almacenan los datos necesarios para la funcionalidad técnica del simulacro (intentos, 
              respuestas y progreso). No se comparten datos con terceros fuera de los servicios de despliegue.
            </p>
          </section>
        </div>

        <div className="bg-neutral-950/50 p-6 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-[10px] font-mono text-neutral-500">
              STATUS: SECURED_ENVIRONMENT / NO_COMMERCIAL_USE
            </span>
            <button 
              onClick={() => window.history.back()}
              className="w-full md:w-auto px-6 py-2 bg-brand-600 hover:bg-brand-500 text-neutral-200 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all active:scale-95 shadow-lg shadow-brand-500/10"
            >
              Confirmar Lectura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};