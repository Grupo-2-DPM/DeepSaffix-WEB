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

  useEffect(() => {
    setLoading(true);
    simulationService.list().then(list => {
      // map backend simulacros to Disponible
      const mapped = list.map(s => ({ id: String(s.id_simulacro), nombre: s.nombre, descripcion: s.descripcion }));
      setDisponibles(mapped);
    }).catch(err => {
      console.error(err);
      setError('No se pudieron cargar los simulacros');
    }).finally(() => setLoading(false));
  }, []);

  // load realizados (attempts) for current user
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
      // map attempts into Realizado model
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

  // refresh when an attempt is finished elsewhere
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
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulacros realizados */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Simulacros realizados</h4>
            <span className="text-sm text-slate-500">{realizados.length} registros</span>
          </div>

          <ul className="space-y-4">
            {realizados.map(r => (
              <li key={r.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{r.nombre}</div>
                    <div className="text-xs text-slate-500">{r.fecha} • {r.resultado}</div>
                  </div>
                  <div className="w-40">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${r.progreso}%` }} />
                    </div>
                    <div className="text-xs text-right text-slate-500 mt-1">{r.progreso}%</div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <button onClick={() => { window.location.hash = `#/simulacros/view/${r.id}`; }} className="px-3 py-1 border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-50">Ver</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Simulacros disponibles */}
        <div className="bg-white shadow-sm border border-slate-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Simulacros disponibles</h4>
            <span className="text-sm text-slate-500">{disponibles.length} disponibles</span>
          </div>

          <ul className="space-y-4">
            {disponibles.map(d => (
              <li key={d.id} className="flex items-start justify-between border border-gray-100 rounded-lg p-4">
                <div>
                  <div className="text-sm font-medium text-gray-800">{d.nombre}</div>
                  {d.descripcion && <div className="text-xs text-slate-500 mt-1">{d.descripcion}</div>}
                </div>
                <div className="flex items-center gap-3">
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
                        // navigate to run page with intento id
                        window.location.hash = `#/simulacros/run/${intento.id_intento}`;
                      } catch (err: any) {
                        console.error(err);
                        alert('Error iniciando simulacro');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-gray-500 rounded-md hover:bg-blue-700 transition-colors"
                  >Iniciar</button>
                  <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50">Detalles</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SimulationPanel;