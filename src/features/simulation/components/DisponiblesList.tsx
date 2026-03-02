import React from "react";
import { motion } from "framer-motion";
import simulationService from "../../../backend/services/simulationService";
import { type Disponible } from "../hooks/useSimulacros";

type Props = {
  disponibles: Disponible[];
};

const DisponiblesList: React.FC<Props> = ({ disponibles }) => {
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            Módulo Activo
          </p>
          <h3 className="text-xl font-semibold text-white">
            Simulacros Disponibles
          </h3>
        </div>

        <button
          onClick={() => (window.location.hash = "#/simulacrum/admin")}
          className="rounded-xl border border-white/10 px-4 py-2 text-xs tracking-wider text-neutral-300 uppercase hover:bg-white/10"
        >
          Administrar
        </button>
      </div>

      <div className="grid gap-4">
        {disponibles.map((d) => (
          <motion.div
            key={d.id}
            whileHover={{ scale: 1.02 }}
            className="hover:border-accent-cyan/40 hover:bg-accent-cyan/5 rounded-2xl border border-white/5 bg-white/5 p-5 transition-all"
          >
            <h4 className="mb-2 text-sm font-semibold text-white">
              {d.nombre}
            </h4>

            <p className="mb-4 text-xs text-neutral-400">{d.descripcion}</p>

            <button
              onClick={() => handleStart(Number(d.id))}
              className="bg-accent-cyan rounded-xl px-5 py-2 text-xs font-bold tracking-wider text-black uppercase shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all hover:scale-105"
            >
              Iniciar
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisponiblesList;
