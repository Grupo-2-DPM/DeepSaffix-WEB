/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import simulationService from '../../../backend/services/simulationService';

type Realizado = {
  id: string;
  nombre: string;
  fecha: string;
  progreso: number; // 0-100
  resultado?: string;
  guardado?: boolean;
};

type Disponible = {
  id: string;
  nombre: string;
  descripcion?: string;
};

const disponiblesSeed: Disponible[] = [];

export const SimulationPanel: React.FC = () => {
  const [realizados, setRealizados] = useState<Realizado[]>([]);
  const [disponibles, setDisponibles] = useState<Disponible[]>(disponiblesSeed);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', duracion_minutos: 60, pool: { cantidad: 5, nivel_dificultad: '' } as any });

  useEffect(() => {
    setLoading(true);
    simulationService.list().then(list => {
      const mapped = list.map(s => ({ id: String(s.id_simulacro), nombre: s.nombre, descripcion: s.descripcion }));
      setDisponibles(mapped);
    }).catch(err => {
      console.error(err);
      setError('No se pudieron cargar los simulacros');
    }).finally(() => setLoading(false));
  }, []);

  const refreshDisponibles = async () => {
    try {
      const list = await simulationService.list();
      const mapped = list.map(s => ({ id: String(s.id_simulacro), nombre: s.nombre, descripcion: s.descripcion }));
      setDisponibles(mapped);
    } catch (err) { console.error(err); }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ nombre: '', descripcion: '', duracion_minutos: 60, pool: { cantidad: 5, nivel_dificultad: '' } });
    setShowForm(true);
  };

  const openEdit = (id: number) => {
    const s = (disponibles.find(d => Number(d.id) === id));
    if (!s) return alert('Simulacro no encontrado');
    setEditingId(id);
    setForm({ nombre: s.nombre, descripcion: s.descripcion ?? '', duracion_minutos: 60, pool: { cantidad: 5, nivel_dificultad: '' } });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    // Validación cliente
    if (!form.nombre || String(form.nombre).trim().length === 0) {
      return alert('El nombre del simulacro es obligatorio');
    }

    try {
      // When editing, do not allow changing duration or pool cantidad; only update name/description
      const body: any = { nombre: String(form.nombre).trim(), descripcion: form.descripcion };
      if (!editingId) {
        body.duracion_minutos = Number(form.duracion_minutos);
        // if pool cantidad provided, include pool for create
        if (form.pool && Number(form.pool.cantidad) > 0) body.pool = { cantidad: Number(form.pool.cantidad), nivel_dificultad: form.pool.nivel_dificultad || undefined };
      }

      if (editingId) {
        await simulationService.updateSimulacro(editingId, body);
        alert('Simulacro actualizado');
      } else {
        await simulationService.createSimulacro(body);
        alert('Simulacro creado');
      }
      setShowForm(false);
      await refreshDisponibles();
    } catch (err: any) {
      console.error(err);
      // intentar parsear respuesta del servidor que viene como JSON en err.message
      try {
        const parsed = JSON.parse(err.message);
        const msg = parsed?.message;
        if (Array.isArray(msg)) return alert(msg.join('\n'));
        if (typeof msg === 'string') return alert(msg);
        return alert('Error creando/actualizando simulacro');
      } catch (e) {
        return alert('Error creando/actualizando simulacro');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar simulacro? Esta acción es irreversible.')) return;
    try {
      await simulationService.deleteSimulacro(id);
      alert('Simulacro eliminado');
      await refreshDisponibles();
    } catch (err) {
      console.error(err);
      alert('Error eliminando simulacro');
    }
  };

  useEffect(() => {
    const userRaw = localStorage.getItem('user');
    if (!userRaw) return;
    let userId: number | null = null;
    try {
      const user = JSON.parse(userRaw);
      userId = Number(user.id_usuario ?? user.id ?? user.userId ?? null);
    } catch (err) {
      console.warn('User parse error', err);
    }
    if (!userId) return;

    setLoading(true);
    simulationService.listAttemptsByUser(userId).then(list => {
      const mapped = list.map(a => ({
        id: String(a.id_intento),
        nombre: a.simulacro?.nombre ?? `Simulacro ${a.id_simulacro}`,
        fecha: a.fecha_inicio ? new Date(a.fecha_inicio).toLocaleDateString() : '-',
        progreso: a.puntaje_total !== undefined && a.puntaje_total !== null ? 100 : (a.tiempo_utilizado ? Math.min(100, Math.round((a.tiempo_utilizado / (a.simulacro?.duracion_minutos ?? 1)) * 100)) : 0),
        resultado: a.puntaje_total !== undefined && a.puntaje_total !== null ? `${a.puntaje_total} pts` : 'Pendiente',
        guardado: (a.respuestas && a.respuestas.length > 0) ? true : false,
      } as Realizado));
      setRealizados(mapped);
    }).catch(err => {
      console.error('No se pudieron cargar intentos del usuario', err);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) return;
        const user = JSON.parse(userRaw);
        const userId = Number(user.id_usuario ?? user.id ?? user.userId ?? null);
        if (!userId) return;
        setLoading(true);
        simulationService.listAttemptsByUser(userId).then(list => {
          const mapped = list.map(a => ({
            id: String(a.id_intento),
            nombre: a.simulacro?.nombre ?? `Simulacro ${a.id_simulacro}`,
            fecha: a.fecha_inicio ? new Date(a.fecha_inicio).toLocaleDateString() : '-',
            progreso: a.puntaje_total !== undefined && a.puntaje_total !== null ? 100 : (a.tiempo_utilizado ? Math.min(100, Math.round((a.tiempo_utilizado / (a.simulacro?.duracion_minutos ?? 1)) * 100)) : 0),
            resultado: a.puntaje_total !== undefined && a.puntaje_total !== null ? `${a.puntaje_total} pts` : 'Pendiente',
            guardado: (a.respuestas && a.respuestas.length > 0) ? true : false,
          } as Realizado));
          setRealizados(mapped);
        }).catch(err => console.error('refresh attempts failed', err)).finally(() => setLoading(false));
      } catch (err) { console.warn(err); }
    };

    window.addEventListener('attemptFinished', handler as EventListener);
    return () => { window.removeEventListener('attemptFinished', handler as EventListener); };
  }, []);

  return (
    <section className="w-full bg-neutral-950 p-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulacros realizados */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-history text-accent-cyan text-sm"></i>
              <h4 className="text-white font-mono text-sm tracking-widest uppercase">Simulacros realizados</h4>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded">
              {realizados.length} REGISTROS
            </span>
          </div>

          {realizados.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs font-mono">
              <i className="fas fa-database mr-1 text-neutral-600"></i> NO HAY REGISTROS
            </div>
          ) : (
            <ul className="space-y-3">
              {realizados.map(r => (
                <li key={r.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 hover:border-neutral-700 transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.nombre}</div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                        <span><i className="far fa-calendar mr-1 text-accent-cyan"></i>{r.fecha}</span>
                        <span><i className="far fa-clock mr-1 text-accent-cyan"></i>{r.resultado}</span>
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${r.progreso}%` }} />
                      </div>
                      <div className="text-right text-[10px] font-mono text-neutral-500 mt-1">{r.progreso}%</div>
                    </div>
                    <button
                      onClick={() => { window.location.hash = `#/simulacros/view/${r.id}`; }}
                      className="text-[10px] font-mono tracking-widest text-neutral-400 hover:text-accent-cyan transition-all active:scale-95 uppercase border border-neutral-800 px-2 py-1 rounded"
                    >
                      Ver
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Simulacros disponibles */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-end mb-4">
            <button onClick={openCreate} className="text-[10px] font-mono tracking-widest bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded transition-all active:scale-95 uppercase">Nuevo simulacro</button>
          </div>
          <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-play-circle text-accent-cyan text-sm"></i>
              <h4 className="text-white font-mono text-sm tracking-widest uppercase">Simulacros disponibles</h4>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded">
              {disponibles.length} DISPONIBLES
            </span>
          </div>

          {disponibles.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs font-mono">
              <i className="fas fa-box-open mr-1 text-neutral-600"></i> NO HAY SIMULACROS DISPONIBLES
            </div>
          ) : (
            <ul className="space-y-3">
              {disponibles.map(d => (
                <li key={d.id} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-all">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{d.nombre}</div>
                      {d.descripcion && (
                        <div className="text-[10px] font-mono text-neutral-500 mt-1 line-clamp-2">{d.descripcion}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(Number(d.id))}
                        className="text-[10px] font-mono tracking-widest bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1.5 rounded transition-all active:scale-95 uppercase"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(Number(d.id))}
                        className="text-[10px] font-mono tracking-widest bg-rose-700 hover:bg-rose-600 text-white px-2 py-1.5 rounded transition-all active:scale-95 uppercase"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={async () => {
                          const userRaw = localStorage.getItem('user');
                          if (!userRaw) return window.location.hash = '#/';
                          const user = JSON.parse(userRaw);
                          const userId = user.id_usuario ?? user.id ?? user.userId;
                          if (!userId) return alert('Usuario no identificado');

                          try {
                            const simId = Number(d.id);
                            const intento = await simulationService.startAttempt(simId, Number(userId));
                            window.location.hash = `#/simulacros/run/${intento.id_intento}`;
                          } catch (err: any) {
                            console.error(err);
                            alert('Error iniciando simulacro');
                          }
                        }}
                        className="text-[10px] font-mono tracking-widest bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded transition-all active:scale-95 uppercase"
                      >
                        Iniciar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {showForm && (
            <div className="mt-4 bg-neutral-950 border border-neutral-800 rounded-lg p-4">
              <h5 className="text-white text-sm font-mono mb-2">{editingId ? 'Editar simulacro' : 'Crear simulacro'}</h5>
              <div className="grid grid-cols-1 gap-2">
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" className="p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm" />
                <input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" className="p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm" />
                <input type="number" value={form.duracion_minutos} onChange={e => setForm({ ...form, duracion_minutos: Number(e.target.value) })} placeholder="Duración (min)" className="p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm" disabled={!!editingId} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={form.pool.cantidad} onChange={e => setForm({ ...form, pool: { ...form.pool, cantidad: Number(e.target.value) } })} placeholder="Cantidad desde pool" className="p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm" disabled={!!editingId} />
                  <select value={form.pool.nivel_dificultad} onChange={e => setForm({ ...form, pool: { ...form.pool, nivel_dificultad: e.target.value } })} className="p-2 bg-neutral-900 border border-neutral-800 rounded text-white text-sm">
                    <option value="">Nivel (opcional)</option>
                    <option value="BAJO">BAJO</option>
                    <option value="MEDIO">MEDIO</option>
                    <option value="ALTO">ALTO</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSubmit} className="text-[10px] font-mono tracking-widest bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded transition-all active:scale-95 uppercase">{editingId ? 'Actualizar' : 'Crear'}</button>
                  <button onClick={() => setShowForm(false)} className="text-[10px] font-mono tracking-widest bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded transition-all active:scale-95 uppercase">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimulationPanel;