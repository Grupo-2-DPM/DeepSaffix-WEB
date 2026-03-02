import React from "react";
import { useIntentosUsuario } from "../../../hooks/useIntentosUsuario";

const SimulationHistory: React.FC = () => {
  const { realizados } = useIntentosUsuario();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Historial completo de simulacros
      </h2>

      {realizados.length === 0 ? (
        <div className="text-sm text-neutral-500">No existen registros.</div>
      ) : (
        <div className="space-y-4">
          {realizados.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{r.nombre}</div>
                  <div className="text-xs text-neutral-500">
                    {r.fecha} • {r.resultado}
                  </div>
                </div>

                <div className="flex gap-4 text-xs">
                  <button
                    onClick={() =>
                      (window.location.hash = `#/simulacrum/view/${r.id}`)
                    }
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationHistory;
