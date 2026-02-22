/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import simulationService from '../../../backend/services/simulationService';

const parseHashAttemptId = (): { id: string | null; mode: string } => {
  const h = window.location.hash || '';
  const parts = h.split('/');
  return { id: parts.length >= 4 ? parts[3] : null, mode: parts[2] ?? 'run' };
};

export const SimulationRun: React.FC = () => {
  const [attempt, setAttempt] = useState<any | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('Iniciando...');
  const intervalRef = useRef<number | null>(null);
  const finishLockRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pausedAccumRef = useRef<number>(0);

  const [selected, setSelected] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<number | null>(null);
  const [formClosed, setFormClosed] = useState(false);

  useEffect(() => {
    const parsed = parseHashAttemptId();
    if (!parsed.id) return;
    const attemptId = Number(parsed.id);
    setViewOnly(parsed.mode === 'view');
    simulationService.getAttempt(attemptId).then(a => {
      setAttempt(a);
      setStatus(parsed.mode === 'view' ? 'Visualizando' : 'En ejecución');
    }).catch(err => {
      console.error(err);
      setStatus('Error al cargar intento');
    });
  }, []);

  // load simulacro preguntas if available
  useEffect(() => {
    if (!attempt) return;
    const simId = attempt?.id_simulacro ?? attempt?.simulacro?.id_simulacro ?? attempt?.simulacro?.id;
    if (!simId) return;
    simulationService.getSimulacro(Number(simId)).then(s => {
      // attach preguntas to attempt for rendering
      setAttempt((prev: any) => ({ ...prev, simulacro: s }));
      // if we're in view-only mode, populate selected answers from attempt.respuestas
      if (viewOnly && attempt?.respuestas) {
        const map: Record<number, number> = {};
        try {
          attempt.respuestas.forEach((r: any) => {
            const opcion = r.opcion;
            if (opcion && opcion.id_pregunta && opcion.id_opcion) {
              map[opcion.id_pregunta] = opcion.id_opcion;
            }
          });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) { /* ignore */ }
        setSelected(map);
        // keep questions visible but read-only
        setFormClosed(false);
      }
    }).catch(err => {
      console.warn('No se pudieron cargar preguntas del simulacro', err);
    });
  }, [attempt, viewOnly]);

  // Progress should reflect elapsed time relative to simulacro.duracion_minutos when available.
  useEffect(() => {
    if (!running) return;
    // If we have a simulacro duration and a start time, drive progress and a live timer by real time
    const fechaInicio = attempt?.fecha_inicio ? new Date(attempt.fecha_inicio) : null;
    const duracionMin = attempt?.simulacro?.duracion_minutos;

    if (fechaInicio && typeof duracionMin === 'number' && duracionMin > 0) {
      const totalMs = duracionMin * 60 * 1000;

      // if we were paused, accumulate paused duration so elapsed excludes paused time
      if (pausedAtRef.current) {
        pausedAccumRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = null;
      }

      // progress updater (every 1s)
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - fechaInicio.getTime() - pausedAccumRef.current;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setProgress(pct);
        setStatus(elapsed >= totalMs ? 'Tiempo agotado' : 'En ejecución');
      }, 1000);

      // live remaining timer (every 1s)
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = now - fechaInicio.getTime() - pausedAccumRef.current;
        const remaining = totalMs - elapsed;
        if (remaining <= 0) {
          // clear intervals and trigger auto-finish once
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRunning(false);
          setProgress(100);
          setStatus('Tiempo agotado');
          (async () => {
            if (finishLockRef.current) return;
            finishLockRef.current = true;
            setSaving(true);
            try {
              // submit current answers if any
              const optionIds = Object.values(selected).map(Number).filter(Boolean);
              if (optionIds.length && attempt?.id_intento) {
                await simulationService.submitAnswers(attempt.id_intento, optionIds);
              }
              if (attempt?.id_intento) {
                const result = await simulationService.finishAttempt(attempt.id_intento);
                setAttempt(result);
                // dispatch event so panels can refresh
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                try { window.dispatchEvent(new CustomEvent('attemptFinished', { detail: { id_intento: attempt.id_intento } })); } catch (e) { /* ignore */ }
              }
              // close form and notify user
              setFormClosed(true);
              alert('El tiempo se acabó. Se enviaron las respuestas y se finalizó el intento.');
            } catch (err) {
              console.error('Auto-finish error', err);
              alert('El tiempo se acabó pero hubo un error al enviar la prueba.');
            } finally {
              setSaving(false);
            }
          })();
        }
      }, 1000);
    } else {
      // Fallback: slow simulated progress
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          const next = Math.min(100, p + Math.random() * 3 + 1);
          if (next >= 100) {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
            setRunning(false);
            setStatus('Completado (simulado)');
            return 100;
          }
          return Math.round(next);
        });
      }, 1500);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, attempt, selected]);

  const handleStop = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timerRef.current) window.clearInterval(timerRef.current);
    // mark paused time start
    pausedAtRef.current = Date.now();
    setRunning(false);
    setStatus('Detenido por usuario');
  };


  const formatRemaining = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSelect = (pregId: number, opcionId: number) => {
    if (viewOnly) return; // prevent selecting in view mode
    setSelected(prev => ({ ...prev, [pregId]: opcionId }));
  };

  // Auto-save selected answers with debounce
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (!attempt || !attempt.id_intento) return;
    saveTimer.current = window.setTimeout(async () => {
      const optionIds = Object.values(selected).map(Number).filter(Boolean);
      if (!optionIds.length) return;
      setSaving(true);
      try {
        await simulationService.submitAnswers(attempt.id_intento, optionIds);
        setSavedAt(Date.now());
      } catch (err) {
        console.error('Auto-save failed', err);
      } finally {
        setSaving(false);
      }
    }, 1500) as unknown as number;

    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [selected, attempt]);

  const handleSubmitAnswers = async () => {
    if (!attempt) return alert('No hay intento cargado');
    const optionIds = Object.values(selected).map(Number).filter(Boolean);
    if (!optionIds.length) return alert('Selecciona al menos una opción');
    try {
      if (finishLockRef.current) return;
      finishLockRef.current = true;
      setSaving(true);
      // submit answers
      await simulationService.submitAnswers(attempt.id_intento, optionIds);
      setSavedAt(Date.now());
      // finish attempt immediately after submitting
      const result = await simulationService.finishAttempt(attempt.id_intento);
      setAttempt(result);
      setStatus('Finalizado');
      setProgress(100);
      // Close form
      setFormClosed(true);
      // notify other components that this attempt finished
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      try { window.dispatchEvent(new CustomEvent('attemptFinished', { detail: { id_intento: attempt.id_intento } })); } catch (e) { /* empty */ }
      alert('Respuestas guardadas y intento finalizado');
    } catch (err) {
      console.error(err);
      alert('Error enviando respuestas');
    } finally {
      setSaving(false);
      finishLockRef.current = false;
    }
  };

  const handleBack = () => { window.location.hash = '#/simulacros'; };

  // compute correct/incorrect from attempt respuestas (useful for view-only)
  const respuestas = attempt?.respuestas ?? [];
  const correctCount = Array.isArray(respuestas) ? respuestas.filter((r: any) => {
    const opcion = r?.opcion;
    return !!(opcion && (opcion.es_correcta ?? opcion.esCorrecta ?? false));
  }).length : 0;
  const incorrectCount = Array.isArray(respuestas) ? respuestas.filter((r: any) => {
    const opcion = r?.opcion;
    // count as incorrect only if there is an opcion and it's marked incorrect
    return !!(opcion && !(opcion.es_correcta ?? opcion.esCorrecta ?? false));
  }).length : 0;
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-lg shadow-md border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{attempt?.simulacro?.nombre ?? attempt?.id_simulacro ? `Simulacro ${attempt.id_simulacro}` : 'Simulación'}</h2>
          <button onClick={handleBack} className="text-sm text-slate-600 hover:underline">Volver a simulacros</button>
        </div>

        {!viewOnly && (
          <div className="mt-4">
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-slate-600 italic">{status}</div>
              <div className="text-sm text-slate-600">{progress}%</div>
            </div>
            {/* Show duration and remaining time when available */}
            {attempt?.simulacro?.duracion_minutos && (
              <div className="mt-2 text-sm text-slate-500 flex items-center justify-between">
                <div>Duración: {attempt.simulacro.duracion_minutos} min</div>
                <div>
                  Tiempo restante:{' '}
                  {(() => {
                    const fechaInicio = attempt?.fecha_inicio ? new Date(attempt.fecha_inicio).getTime() : Date.now();
                    const totalMs = attempt.simulacro.duracion_minutos * 60 * 1000;
                    const elapsed = Date.now() - fechaInicio;
                    return formatRemaining(totalMs - elapsed);
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {!viewOnly && (
          <div className="mt-6 flex gap-3">
            <button onClick={() => setRunning(true)} disabled={running || progress >= 100} className="px-4 py-2 bg-blue-600 text-gray-500 rounded hover:bg-blue-700 disabled:opacity-60">Continuar</button>
            <button onClick={handleStop} disabled={!running} className="px-4 py-2 bg-red-600 text-gray-500 rounded hover:bg-red-700 disabled:opacity-60">Detener</button>
          </div>
        )}
        {/* Guardado automático indicador */}
        {!viewOnly && (
          <div className="mt-3">
            {saving ? <div className="text-sm text-slate-500">Guardando respuestas...</div> : savedAt ? <div className="text-sm text-slate-500">Guardado {new Date(savedAt).toLocaleTimeString()}</div> : null}
          </div>
        )}

        {/* Resumen de resultado cuando esté disponible */}
        {attempt && (attempt.puntaje_total !== undefined && attempt.puntaje_total !== null) && (
          <div className="mt-6 bg-slate-50 border border-slate-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Resumen del intento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700">
              <div><strong>Puntaje:</strong> {attempt.puntaje_total ?? '-'} pts</div>
              <div><strong>Tiempo usado:</strong> {attempt.tiempo_utilizado ?? '-'} min</div>
              <div><strong>Respuestas:</strong> {attempt.respuestas ? attempt.respuestas.length : 0}</div>
              <div><strong>Aciertos:</strong> {correctCount}</div>
              <div><strong>Fallos:</strong> {incorrectCount}</div>
            </div>
            {attempt.fecha_inicio && <div className="mt-2 text-xs text-slate-500">Inicio: {new Date(attempt.fecha_inicio).toLocaleString()}</div>}
            {attempt.fecha_fin && <div className="text-xs text-slate-500">Fin: {new Date(attempt.fecha_fin).toLocaleString()}</div>}
          </div>
        )}
        
        {/* Preguntas */}
        {!formClosed && attempt?.simulacro?.preguntas && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Preguntas</h3>
            <ul className="space-y-6">
              {attempt.simulacro.preguntas.map((p: any, idx: number) => (
                <li key={p.id_pregunta ?? p.id ?? idx} className="border border-gray-100 rounded-lg p-4">
                  <div className="mb-3 font-medium text-gray-800">{idx + 1}. {p.enunciado ?? p.texto ?? 'Pregunta'}</div>
                  <div className="space-y-2">
                    {(p.opciones ?? p.opcion ?? []).map((o: any) => {
                      const optionId = o.id_opcion ?? o.id;
                      const qId = p.id_pregunta ?? p.id ?? idx;
                      const isSelected = selected[qId] === optionId;
                      const isCorrect = !!(o.es_correcta ?? o.esCorrecta ?? false);
                      const base = 'flex items-center gap-3 p-2 rounded';
                      let extra = '';
                      if (viewOnly) {
                        if (isCorrect) extra = ' bg-emerald-50 border border-emerald-200';
                        else if (isSelected && !isCorrect) extra = ' bg-red-50 border border-red-200';
                      } else {
                        extra = ' hover:bg-slate-50';
                      }
                      return (
                        <label key={optionId} className={`${base}${extra}`}>
                          <input type="radio" name={`preg-${qId}`} disabled={viewOnly} checked={isSelected} onChange={() => handleSelect(qId, optionId)} />
                          <span className="text-sm text-slate-700">
                            {o.texto_opcion ?? o.texto ?? o.label}
                            {viewOnly && isCorrect && <span className="ml-2 text-emerald-700"> ✓</span>}
                            {viewOnly && isSelected && !isCorrect && <span className="ml-2 text-red-700"> ✕</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-3">
              <button onClick={handleSubmitAnswers} className="px-4 py-2 bg-indigo-600 text-gray-500 rounded hover:bg-indigo-700">Enviar respuestas</button>
            </div>
          </div>
        )}

        {/* Message when form closed */}
        {formClosed && (
          <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-emerald-800">
            Respuestas guardadas. El formulario está cerrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationRun;
