import React from "react";
import type { Realizado } from "../hooks/useIntentosUsuario";

type Props = {
  realizados: Realizado[];
  limit?: number;
};

const RecentAttemptsList: React.FC<Props> = ({ realizados, limit = 5 }) => {
  const recientes = realizados.slice(0, limit);

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Historial reciente</h4>
        {realizados.length > limit && (
          <button
            onClick={() => (window.location.hash = "#/simulacrum/history")}
            className="text-xs text-blue-400 hover:text-white"
          >
            Ver historial completo
          </button>
        )}
      </div>

      {recientes.length === 0 ? (
        <div className="text-xs text-neutral-500">No hay registros</div>
      ) : (
        <ul className="space-y-2">
          {recientes.map((r) => (
            <li
              key={r.id}
              className="flex justify-between rounded border border-neutral-800 p-2"
            >
              <div>
                <div className="text-sm text-white">{r.nombre}</div>
                <div className="text-xs text-neutral-500">
                  {r.fecha} • {r.resultado}
                </div>
              </div>
              <button
                onClick={() =>
                  (window.location.hash = `#/simulacrum/view/${r.id}`)
                }
                className="text-xs text-neutral-400"
              >
                Ver
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentAttemptsList;
