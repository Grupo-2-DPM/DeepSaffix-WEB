import React from "react";
import { motion } from "framer-motion";
import type { Realizado } from "../hooks/useIntentosUsuario";

type Props = {
  realizados: Realizado[];
  limit?: number;
};

const RecentAttemptsList: React.FC<Props> = ({ realizados, limit = 5 }) => {
  const recientes = realizados.slice(0, limit);

  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            Registro
          </p>
          <h3 className="text-lg font-semibold text-white">
            Historial Reciente
          </h3>
        </div>

        {realizados.length > limit && (
          <button
            onClick={() => (window.location.hash = "#/simulacrum/history")}
            className="text-accent-cyan text-[11px] font-bold tracking-widest uppercase opacity-70 hover:opacity-100"
          >
            Ver todo →
          </button>
        )}
      </div>

      {recientes.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-xs text-neutral-600">
          Sin registros
        </div>
      ) : (
        <div className="space-y-3">
          {recientes.map((r) => (
            <motion.div
              key={r.id}
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-white/20"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-sm font-medium text-white">
                    {r.nombre}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {r.fecha} • {r.resultado}
                  </div>
                </div>

                <button
                  onClick={() =>
                    (window.location.hash = `#/simulacrum/view/${r.id}`)
                  }
                  className="text-accent-cyan text-xs font-bold tracking-wide uppercase hover:opacity-70"
                >
                  Ver
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAttemptsList;
