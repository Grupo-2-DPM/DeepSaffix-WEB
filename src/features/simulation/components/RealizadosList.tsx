import React from "react";
import { type Realizado } from "../../../hooks/useIntentosUsuario";

type Props = {
  realizados: Realizado[];
};

const RealizadosList: React.FC<Props> = ({ realizados }) => {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h4 className="mb-4 text-sm font-bold text-white">
        Simulacros realizados
      </h4>

      {realizados.length === 0 ? (
        <div className="py-8 text-center text-xs text-neutral-500">
          NO HAY REGISTROS
        </div>
      ) : (
        <ul className="space-y-3">
          {realizados.map((r) => (
            <li key={r.id} className="rounded-lg border border-neutral-800 p-3">
              <div className="flex justify-between">
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
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Ver
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealizadosList;
