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

  const _handleStop = () => {
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

  const _handleBack = () => { window.location.hash = '#/simulacros'; };
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const confirmLeave = async () => {
    setShowLeaveConfirm(false);
    try {
      if (!attempt || !attempt.id_intento) {
        window.location.hash = '#/simulacros';
        return;
      }

      const optionIds = Object.values(selected).map(Number).filter(Boolean);
      if (optionIds.length) {
        await simulationService.submitAnswers(attempt.id_intento, optionIds);
      }

      // navigate back after sending answers
      window.location.hash = '#/simulacros';
    } catch (err) {
      console.error('Error enviando respuestas al salir', err);
      alert('Hubo un error al enviar las respuestas. Intenta nuevamente o revisa tu conexión.');
    }
  };

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
    <div className="max-w-3xl mx-auto w-full animate-fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8 shadow-xl">
        {/* Cabecera con badge técnico */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              ⚡ SIMULACRO • MODO {viewOnly ? 'LECTURA' : 'ACTIVO'}
            </span>
            <h2 className="text-xl font-semibold text-neutral-200 mt-1">
              {attempt?.simulacro?.nombre ?? attempt?.id_simulacro ? `Simulacro ${attempt.id_simulacro}` : 'Simulación'}
            </h2>
          </div>
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-accent-cyan transition-colors active:scale-95"
          >
            ← Volver a simulacros
          </button>
        </div>

        {/* Sección de progreso (solo si no es viewOnly) */}
        {!viewOnly && (
          <div className="mt-2 space-y-4">
            {/* Barra de progreso técnica */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  PROGRESO
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{progress}%</span>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Estado y tiempo restante en dos columnas */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${running ? 'bg-accent-cyan' : 'bg-neutral-500'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${running ? 'bg-accent-cyan' : 'bg-neutral-500'}`}></span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  {status || (running ? 'EJECUTANDO' : 'PAUSADO')}
                </span>
              </div>

              {attempt?.simulacro?.duracion_minutos && (
                <div className="text-[10px] font-mono text-neutral-400">
                  <span className="text-neutral-500">Duración:</span> {attempt.simulacro.duracion_minutos} min •{' '}
                  <span className="text-accent-cyan">
                    {(() => {
                      const fechaInicio = attempt?.fecha_inicio ? new Date(attempt.fecha_inicio).getTime() : Date.now();
                      const totalMs = attempt.simulacro.duracion_minutos * 60 * 1000;
                      const elapsed = Date.now() - fechaInicio;
                      return formatRemaining(totalMs - elapsed);
                    })()}
                  </span>
                </div>
              )}
            </div>

            {/* Botones de control */}
            <div className="flex gap-3">
              {/* El botón 'Continuar' fue removido por requerimiento */}
            </div>

            {/* Indicador de guardado automático */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
              {saving ? (
                <>
                  <span className="inline-block h-3 w-3 border-2 border-neutral-600 border-t-accent-cyan rounded-full animate-spin" />
                  <span>Guardando respuestas...</span>
                </>
              ) : savedAt ? (
                <>
                  <i className="fas fa-check-circle text-accent-cyan text-[10px]"></i>
                  <span>Guardado {new Date(savedAt).toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Resumen del intento (si existe puntaje) */}
        {attempt && (attempt.puntaje_total !== undefined && attempt.puntaje_total !== null) && (
          <div className="mt-8 bg-neutral-950/50 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-clipboard-list text-accent-cyan text-[10px]"></i>
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">RESUMEN DEL INTENTO</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">PUNTAJE</span>
                <span className="text-neutral-200 font-semibold">{attempt.puntaje_total ?? '-'} pts</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">TIEMPO USADO</span>
                <span className="text-neutral-200">{attempt.tiempo_utilizado ?? '-'} min</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">RESPUESTAS</span>
                <span className="text-neutral-200">{attempt.respuestas ? attempt.respuestas.length : 0}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">ACIERTOS</span>
                <span className="text-emerald-400">{correctCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block">FALLOS</span>
                <span className="text-red-400">{incorrectCount}</span>
              </div>
            </div>
            {attempt.fecha_inicio && (
              <div className="mt-3 text-[10px] font-mono text-neutral-600 border-t border-neutral-800 pt-2">
                <span className="text-neutral-500">INICIO:</span> {new Date(attempt.fecha_inicio).toLocaleString()} •{' '}
                {attempt.fecha_fin && <><span className="text-neutral-500">FIN:</span> {new Date(attempt.fecha_fin).toLocaleString()}</>}
              </div>
            )}
          </div>
        )}

        {/* Lista de preguntas */}
        {!formClosed && attempt?.simulacro?.preguntas && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-question-circle text-accent-cyan text-[10px]"></i>
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">PREGUNTAS</span>
              <span className="text-[10px] font-mono text-neutral-600 ml-auto">{attempt.simulacro.preguntas.length} ítems</span>
            </div>

            <ul className="space-y-5">
              {attempt.simulacro.preguntas.map((p: any, idx: number) => {
                const qId = p.id_pregunta ?? p.id ?? idx;
                return (
                  <li key={qId} className="border border-neutral-800 rounded-lg p-5 bg-neutral-950/20">
                    <div className="flex gap-3 mb-3">
                      <span className="text-[10px] font-mono text-neutral-500 w-6 h-6 flex items-center justify-center border border-neutral-800 rounded-full bg-neutral-900">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-neutral-300 font-medium">{p.enunciado ?? p.texto ?? 'Pregunta'}</span>
                    </div>

                    <div className="space-y-2 ml-9">
                      {(p.opciones ?? p.opcion ?? []).map((o: any) => {
                        const optionId = o.id_opcion ?? o.id;
                        const isSelected = selected[qId] === optionId;
                        const isCorrect = !!(o.es_correcta ?? o.esCorrecta ?? false);

                        // Estilo base para opciones
                        let optionClasses = "flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ";
                        if (viewOnly) {
                          if (isCorrect) optionClasses += "bg-emerald-950/30 border-emerald-800 ";
                          else if (isSelected && !isCorrect) optionClasses += "bg-red-950/30 border-red-800 ";
                          else optionClasses += "border-neutral-800 hover:border-neutral-700 ";
                        } else {
                          optionClasses += "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50 ";
                        }

                        return (
                          <label key={optionId} className={optionClasses}>
                            <input
                              type="radio"
                              name={`preg-${qId}`}
                              disabled={viewOnly}
                              checked={isSelected}
                              onChange={() => handleSelect(qId, optionId)}
                              className="sr-only" // Ocultamos el radio nativo
                            />
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-brand-500 bg-brand-500/20' : 'border-neutral-700'}`}>
                              {isSelected && <span className="w-2 h-2 rounded-full bg-brand-500"></span>}
                            </span>
                            <span className="text-sm text-neutral-300 flex-1">
                              {o.texto_opcion ?? o.texto ?? o.label}
                              {viewOnly && isCorrect && <span className="ml-2 text-emerald-400">✓</span>}
                              {viewOnly && isSelected && !isCorrect && <span className="ml-2 text-red-400">✕</span>}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Botón enviar respuestas */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitAnswers}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-neutral-200 text-sm font-medium rounded-lg border border-brand-400/30 transition-all active:scale-95 flex items-center gap-2"
              >
                <i className="fas fa-paper-plane text-[10px]"></i> Enviar respuestas
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de formulario cerrado */}
        {formClosed && (
          <div className="mt-6 bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 text-neutral-300 text-sm flex items-center gap-2">
            <i className="fas fa-lock text-accent-cyan text-[10px]"></i>
            Respuestas guardadas. El formulario está cerrado.
          </div>
        )}
      </div>

      {/* Modal confirmación salir */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-[90%] max-w-lg">
            <h3 className="text-white text-lg font-semibold mb-2">Confirmar salida</h3>
            <p className="text-sm text-neutral-400 mb-4">Si sales ahora, se enviarán las respuestas tal como están en el simulacro. ¿Deseas continuar?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLeaveConfirm(false)} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded">Cancelar</button>
              <button onClick={confirmLeave} className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded">Enviar y salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationRun;
