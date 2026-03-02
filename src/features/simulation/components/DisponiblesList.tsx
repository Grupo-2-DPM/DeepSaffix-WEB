import React from "react";
import { motion } from "framer-motion";
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
    <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <p className="text-accent-cyan text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
          Módulo Activo
        </p>
        <h3 className="text-xl font-semibold text-white">
          Simulacros Disponibles
        </h3>
      </div>

      <div className="grid gap-4">
        {disponibles.map((d) => (
          <motion.div
            key={d.id}
            whileHover={{ scale: 1.02 }}
            className="group hover:border-accent-cyan/40 hover:bg-accent-cyan/5 rounded-2xl border border-white/5 bg-white/5 p-5 transition-all"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                Simulacro
              </span>
            </div>

            <h4 className="mb-2 text-sm font-semibold text-white">
              {d.nombre}
            </h4>

            <p className="mb-4 text-xs text-neutral-400">{d.descripcion}</p>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(Number(d.id))}
                className="rounded-xl bg-neutral-800 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-700"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(Number(d.id))}
                className="rounded-xl bg-red-500/20 px-4 py-2 text-xs text-red-400 hover:bg-red-500/30"
              >
                Eliminar
              </button>

              <button
                onClick={() => handleStart(Number(d.id))}
                className="bg-accent-cyan ml-auto rounded-xl px-5 py-2 text-xs font-bold tracking-wider text-black uppercase shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all hover:scale-105"
              >
                Iniciar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisponiblesList;
