import React from "react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="animate-fade-in mx-auto w-full max-w-4xl p-4">
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        {/* Header */}
        <div className="bg-neutral-850 border-b border-neutral-800 p-4">
          <span className="text-accent-cyan text-[10px] font-bold tracking-widest uppercase">
            Protocolo de Privacidad y Manejo de Datos
          </span>
        </div>

        <div className="space-y-8 p-6 md:p-8">
          {/* Sección 1 */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-200">
              <span className="text-brand-500 font-mono">01.</span> Naturaleza
              del Software
            </h3>
            <p className="pl-8 text-sm leading-relaxed text-neutral-400">
              DeepSaffix es una plataforma distribuida con fines{" "}
              <span className="text-neutral-200">
                estrictamente didácticos y académicos
              </span>
              . No existe explotación comercial de ninguna naturaleza sobre los
              datos procesados en este sistema.
            </p>
          </section>

          {/* Sección 2 - Render.com */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-200">
              <span className="text-brand-500 font-mono">02.</span>{" "}
              Infraestructura de Datos (Render)
            </h3>
            <div className="border-brand-500 ml-8 border-l-2 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-400">
                La persistencia y el procesamiento de la API se ejecutan sobre
                la infraestructura de
                <span className="font-medium text-neutral-200">
                  {" "}
                  Render.com
                </span>
                . El manejo técnico, almacenamiento y cifrado de los datos en
                reposo está sujeto a las políticas de seguridad de dicho
                proveedor.
              </p>
            </div>
          </section>

          {/* Sección 3 */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-semibold text-neutral-200">
              <span className="text-brand-500 font-mono">03.</span> Recolección
              de Información
            </h3>
            <p className="pl-8 text-sm leading-relaxed text-neutral-400">
              Solo se almacenan los datos necesarios para la funcionalidad
              técnica del simulacro (intentos, respuestas y progreso). No se
              comparten datos con terceros fuera de los servicios de despliegue.
            </p>
          </section>
        </div>

        <div className="border-t border-neutral-800 bg-neutral-950/50 p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="font-mono text-[10px] text-neutral-500">
              STATUS: SECURED_ENVIRONMENT / NO_COMMERCIAL_USE
            </span>
            <button
              onClick={() => window.history.back()}
              className="bg-brand-600 hover:bg-brand-500 shadow-brand-500/10 w-full rounded-lg px-6 py-2 text-[10px] font-bold tracking-widest text-neutral-200 uppercase shadow-lg transition-all active:scale-95 md:w-auto"
            >
              Confirmar Lectura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
