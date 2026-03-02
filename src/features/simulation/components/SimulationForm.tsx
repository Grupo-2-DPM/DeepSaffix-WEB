/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import simulationService from "../../../backend/services/simulationService";

type Props = {
  editingId: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

const SimulationForm: React.FC<Props> = ({ editingId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: 60,
    pool: { cantidad: 5, nivel_dificultad: "" },
  });

  const handleSubmit = async () => {
    if (!form.nombre.trim()) return alert("Nombre obligatorio");

    const body: any = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion,
    };

    if (!editingId) {
      body.duracion_minutos = Number(form.duracion_minutos);
      body.pool = {
        cantidad: Number(form.pool.cantidad),
        nivel_dificultad: form.pool.nivel_dificultad || undefined,
      };
    }

    if (editingId) {
      await simulationService.updateSimulacro(editingId, body);
    } else {
      await simulationService.createSimulacro(body);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="mt-4 rounded border border-neutral-800 p-4">
      <input
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
      />
      <input
        placeholder="Descripción"
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />
      {!editingId && (
        <>
          <input
            type="number"
            placeholder="Duración"
            onChange={(e) =>
              setForm({
                ...form,
                duracion_minutos: Number(e.target.value),
              })
            }
          />
        </>
      )}
      <button onClick={handleSubmit}>
        {editingId ? "Actualizar" : "Crear"}
      </button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default SimulationForm;
