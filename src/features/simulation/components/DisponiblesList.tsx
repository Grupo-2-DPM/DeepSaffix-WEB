import React from "react";
import simulationService from "../../../backend/services/simulationService";
import { type Disponible } from "../hooks/useSimulacros";

type Props = {
  disponibles: Disponible[];
  onEdit: (id: number) => void;
  onRefresh: () => void;
};

const DisponiblesList: React.FC<Props> = ({
  disponibles,
  onEdit,
  onRefresh,
}) => {
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar simulacro?")) return;
    await simulationService.deleteSimulacro(id);
    onRefresh();
  };

  const handleStart = async (id: number) => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;

    const user = JSON.parse(userRaw);
    const userId = user.id_usuario ?? user.id ?? user.userId;
    if (!userId) return;

    const intento = await simulationService.startAttempt(id, Number(userId));
    window.location.hash = `#/simulacrum/run/${intento.id_intento}`;
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <h4 className="mb-4 text-sm font-bold text-white">
        Simulacros disponibles
      </h4>

      <ul className="space-y-3">
        {disponibles.map((d) => (
          <li key={d.id} className="rounded-lg border border-neutral-800 p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-white">{d.nombre}</div>
                <div className="text-xs text-neutral-500">{d.descripcion}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(Number(d.id))}>Editar</button>
                <button onClick={() => handleDelete(Number(d.id))}>
                  Eliminar
                </button>
                <button onClick={() => handleStart(Number(d.id))}>
                  Iniciar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisponiblesList;
