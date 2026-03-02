/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import simulationService from "../../../backend/services/simulationService";

type Simulacro = {
  id: string;
  nombre: string;
  descripcion?: string;
};

const SimulacrosAdmin: React.FC = () => {
  const [simulacros, setSimulacros] = useState<Simulacro[]>([]);
  const [, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: 60,
    pool: { cantidad: 5, nivel_dificultad: "" } as any,
  });

  useEffect(() => {
    loadSimulacros();
  }, []);

  const loadSimulacros = async () => {
    try {
      setLoading(true);
      const list = await simulationService.list();
      const mapped = list.map((s: any) => ({
        id: String(s.id_simulacro),
        nombre: s.nombre,
        descripcion: s.descripcion,
      }));
      setSimulacros(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      descripcion: "",
      duracion_minutos: 60,
      pool: { cantidad: 5, nivel_dificultad: "" },
    });
    setShowForm(true);
  };

  const openEdit = (id: number) => {
    const s = simulacros.find((d) => Number(d.id) === id);
    if (!s) return alert("Simulacro no encontrado");

    setEditingId(id);
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion ?? "",
      duracion_minutos: 60,
      pool: { cantidad: 5, nivel_dificultad: "" },
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      return alert("El nombre es obligatorio");
    }

    try {
      const body: any = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion,
      };

      if (!editingId) {
        body.duracion_minutos = Number(form.duracion_minutos);
        if (Number(form.pool.cantidad) > 0) {
          body.pool = {
            cantidad: Number(form.pool.cantidad),
            nivel_dificultad: form.pool.nivel_dificultad || undefined,
          };
        }
      }

      if (editingId) {
        await simulationService.updateSimulacro(editingId, body);
        alert("Simulacro actualizado");
      } else {
        await simulationService.createSimulacro(body);
        alert("Simulacro creado");
      }

      setShowForm(false);
      await loadSimulacros();
    } catch (err: any) {
      console.error(err);
      try {
        const parsed = JSON.parse(err.message);
        const msg = parsed?.message;
        if (Array.isArray(msg)) return alert(msg.join("\n"));
        if (typeof msg === "string") return alert(msg);
      } catch {
        /* empty */
      }
      alert("Error creando/actualizando simulacro");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar simulacro? Esta acción es irreversible.")) return;

    try {
      await simulationService.deleteSimulacro(id);
      alert("Simulacro eliminado");
      await loadSimulacros();
    } catch (err) {
      console.error(err);
      alert("Error eliminando simulacro");
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Gestión de Simulacros
        </h2>

        <button
          onClick={openCreate}
          className="rounded bg-neutral-800 px-4 py-2 text-xs text-white uppercase hover:bg-neutral-700"
        >
          Nuevo simulacro
        </button>
      </div>

      <div className="space-y-4">
        {simulacros.map((s) => (
          <div
            key={s.id}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-white">{s.nombre}</div>
                {s.descripcion && (
                  <div className="mt-1 text-xs text-neutral-500">
                    {s.descripcion}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(Number(s.id))}
                  className="rounded bg-neutral-700 px-3 py-1 text-xs text-white hover:bg-neutral-600"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(Number(s.id))}
                  className="rounded bg-rose-700 px-3 py-1 text-xs text-white hover:bg-rose-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-6 rounded-lg border border-neutral-800 p-4">
          <h4 className="mb-4 text-sm text-white">
            {editingId ? "Editar simulacro" : "Crear simulacro"}
          </h4>

          <div className="grid gap-3">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre"
              className="rounded border border-neutral-800 bg-neutral-900 p-2 text-white"
            />

            <input
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
              placeholder="Descripción"
              className="rounded border border-neutral-800 bg-neutral-900 p-2 text-white"
            />

            <input
              type="number"
              max="60"
              min="10"
              value={form.duracion_minutos}
              onChange={(e) =>
                setForm({
                  ...form,
                  duracion_minutos: Number(e.target.value),
                })
              }
              disabled={!!editingId}
              placeholder="Duración (min)"
              className="rounded border border-neutral-800 bg-neutral-900 p-2 text-white"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                max="100"
                min="10"
                value={form.pool.cantidad}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pool: {
                      ...form.pool,
                      cantidad: Number(e.target.value),
                    },
                  })
                }
                disabled={!!editingId}
                placeholder="Cantidad pool"
                className="rounded border border-neutral-800 bg-neutral-900 p-2 text-white"
              />

              <select
                value={form.pool.nivel_dificultad}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pool: {
                      ...form.pool,
                      nivel_dificultad: e.target.value,
                    },
                  })
                }
                className="rounded border border-neutral-800 bg-neutral-900 p-2 text-white"
              >
                <option value="">Nivel (opcional)</option>
                <option value="BAJO">BAJO</option>
                <option value="MEDIO">MEDIO</option>
                <option value="ALTO">ALTO</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-brand-600 hover:bg-brand-500 rounded px-4 py-2 text-xs text-white uppercase"
              >
                {editingId ? "Actualizar" : "Crear"}
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="rounded bg-neutral-800 px-4 py-2 text-xs text-white uppercase hover:bg-neutral-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SimulacrosAdmin;
