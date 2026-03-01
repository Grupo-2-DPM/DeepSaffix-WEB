/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import simulationService from '../../../backend/services/simulationService';

const parseHashAttemptId = (): { id: string | null; mode: string } => {
  const h = window.location.hash || '';
  const parts = h.split('/');
  return { id: parts.length >= 4 ? parts[3] : null, mode: parts[2] ?? 'run' };
};

export const SimulationRun: React.FC = () => {
  // --- ESTADOS TÉCNICOS ---
  const [attempt, setAttempt] = useState<any | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setProgress] = useState<number>(0);
  const [running, ] = useState<boolean>(true);
  const [, setStatus] = useState<string>('Iniciando...');
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [, setSavedAt] = useState<number | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // --- REFS PARA LÓGICA DE TIEMPO Y BLOQUEOS ---
  const intervalRef = useRef<number | null>(null);

  const finishLockRef = useRef(false);
  const saveTimer = useRef<number | null>(null);
  const pausedAccumRef = useRef<number>(0);


  // 1. CARGA INICIAL DEL INTENTO
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

  // 2. CARGA DE PREGUNTAS DEL SIMULACRO
  useEffect(() => {
    if (!attempt) return;
    const simId = attempt?.id_simulacro ?? attempt?.simulacro?.id_simulacro ?? attempt?.simulacro?.id;
    if (!simId) return;
    simulationService.getSimulacro(Number(simId)).then(s => {
      setAttempt((prev: any) => ({ ...prev, simulacro: s }));
      if (viewOnly && attempt?.respuestas) {
        const map: Record<number, number> = {};
        attempt.respuestas.forEach((r: any) => {
          const opcion = r.opcion;
          if (opcion && opcion.id_pregunta && opcion.id_opcion) {
            map[opcion.id_pregunta] = opcion.id_opcion;
          }
        });
        setSelected(map);
      }
    }).catch(err => {
      console.warn('No se pudieron cargar preguntas', err);
    });
  }, [attempt?.id_intento, viewOnly]);

  // 3. LÓGICA DE CRONÓMETRO Y AUTOFINISH
  useEffect(() => {
    if (!running || !attempt) return;
    const fechaInicio = attempt?.fecha_inicio ? new Date(attempt.fecha_inicio) : null;
    const duracionMin = attempt?.simulacro?.duracion_minutos;

    if (fechaInicio && typeof duracionMin === 'number' && duracionMin > 0) {
      const totalMs = duracionMin * 60 * 1000;
      
      const updateClocks = () => {
        const now = Date.now();
        const elapsed = now - fechaInicio.getTime() - pausedAccumRef.current;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setProgress(pct);
        
        if (elapsed >= totalMs) {
          handleAutoFinish();
        }
      };

      intervalRef.current = window.setInterval(updateClocks, 1000);
      return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
    }
  }, [running, attempt]);

  const handleAutoFinish = async () => {
    if (finishLockRef.current) return;
    finishLockRef.current = true;
    const optionIds = Object.values(selected).map(Number).filter(Boolean);
    try {
      if (optionIds.length) await simulationService.submitAnswers(attempt.id_intento, optionIds);
      await simulationService.finishAttempt(attempt.id_intento);
      alert('Tiempo agotado. El examen se ha enviado automáticamente.');
      window.location.hash = '#/overview';
    } catch (e) { console.error(e); }
  };

  // 4. LÓGICA DE AUTOGUARDADO (Debounce 1.5s)
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (!attempt || !attempt.id_intento || viewOnly) return;

    saveTimer.current = window.setTimeout(async () => {
      const optionIds = Object.values(selected).map(Number).filter(Boolean);
      if (!optionIds.length) return;
      setSaving(true);
      try {
        await simulationService.submitAnswers(attempt.id_intento, optionIds);
        setSavedAt(Date.now());
      } catch (err) { console.error('Auto-save failed', err); }
      finally { setSaving(false); }
    }, 1500) as unknown as number;

    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [selected, attempt.id_intento, viewOnly, attempt]);

  // --- ACCIONES DE UI ---
  const handleSubmitAnswers = async () => {
    if (!attempt) return alert('No hay intento cargado');
    const optionIds = Object.values(selected).map(Number).filter(Boolean);
    try {
      if (finishLockRef.current) return;
      finishLockRef.current = true;
      setSaving(true);
      if (optionIds.length) await simulationService.submitAnswers(attempt.id_intento, optionIds);
      await simulationService.finishAttempt(attempt.id_intento);
      try { window.dispatchEvent(new CustomEvent('attemptFinished', { detail: { id_intento: attempt.id_intento } })); } catch (e) { /* empty */ }
      window.location.hash = '#/overview'; 
    } catch {
      alert('Error al finalizar la prueba');
      finishLockRef.current = false;
    } finally { setSaving(false); }
  };

  const formatTime = () => {
    if (!attempt?.simulacro?.duracion_minutos) return '00:00';
    const totalMs = attempt.simulacro.duracion_minutos * 60 * 1000;
    const elapsed = Date.now() - new Date(attempt.fecha_inicio).getTime() - pausedAccumRef.current;
    const remaining = Math.max(0, totalMs - elapsed);
    const m = Math.floor(remaining / 60000).toString().padStart(2, '0');
    const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const preguntas = attempt?.simulacro?.preguntas ?? [];
  const currentPregunta = preguntas[currentIndex];

  const handleNext = () => currentIndex < preguntas.length - 1 && setCurrentIndex(currentIndex + 1);
  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-2 md:p-4">
      <div className="bg-neutral-900/80 border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
        
        {/* HEADER */}
        <header className="py-4 px-6 md:px-8 flex items-center justify-between border-b border-white/5 bg-neutral-900/40">
          <div className="flex items-center gap-4">
            <button onClick={() => (window.location.hash = '#/simulacrum')} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-accent-cyan uppercase opacity-70">
                {viewOnly ? 'REVISIÓN' : 'EJECUCIÓN'} • {currentIndex + 1} de {preguntas.length}
              </p>
              <h2 className="text-sm font-semibold text-neutral-300 truncate max-w-50 md:max-w-md">
                {attempt?.simulacro?.nombre || 'Cargando Simulacro...'}
              </h2>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-3 text-accent-cyan font-mono font-bold text-lg">
               <i className="far fa-clock"></i> {viewOnly ? 'FINALIZADO' : formatTime()}
            </div>
            {saving && <span className="text-[9px] text-accent-cyan animate-pulse">Guardando...</span>}
          </div>
        </header>

        {/* ÁREA DE PREGUNTA */}
        <main className="flex-1 p-6 md:p-12 min-h-112.5">
          <AnimatePresence mode="wait">
            {!currentPregunta ? (
              <motion.div key="loader" className="flex items-center justify-center h-full font-mono text-neutral-600">CARGANDO...</motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto w-full space-y-8"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest">
                    <i className="fas fa-question-circle"></i> Pregunta Actual
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                    {currentPregunta.enunciado ?? currentPregunta.texto}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {(currentPregunta.opciones ?? currentPregunta.opcion ?? []).map((o: any) => {
                    const oId = o.id_opcion ?? o.id;
                    const pId = currentPregunta.id_pregunta ?? currentPregunta.id;
                    const isSelected = selected[pId] === oId;
                    const isCorrect = !!(o.es_correcta ?? o.esCorrecta);

                    return (
                      <button
                        key={oId}
                        disabled={viewOnly}
                        onClick={() => setSelected(prev => ({ ...prev, [pId]: oId }))}
                        className={`group flex items-center p-4 rounded-xl border transition-all duration-200 text-left
                          ${isSelected 
                            ? (viewOnly && !isCorrect ? 'bg-red-500/10 border-red-500 text-white' : 'bg-accent-cyan/10 border-accent-cyan text-white')
                            : (viewOnly && isCorrect ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:border-white/20')
                          }
                        `}
                      >
                        <div className={`w-6 h-6 shrink-0 rounded-full border flex items-center justify-center mr-4 transition-all
                          ${isSelected ? 'bg-accent-cyan border-accent-cyan text-black' : (viewOnly && isCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-600')}
                        `}>
                          {(isSelected || (viewOnly && isCorrect)) && <i className={`fas ${viewOnly && isCorrect ? 'fa-check' : (viewOnly && isSelected && !isCorrect ? 'fa-times' : 'fa-check')} text-[10px]`}></i>}
                        </div>
                        <span className="text-sm md:text-base">{o.texto_opcion ?? o.texto}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <footer className="py-4 px-6 md:px-8 border-t border-white/5 bg-neutral-950/20 flex items-center justify-between">
          <div className="flex gap-3">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 disabled:opacity-30 hover:bg-neutral-700 transition-all">
              <i className="fas fa-chevron-left"></i> <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Anterior</span>
            </button>
            <button onClick={handleNext} disabled={currentIndex === preguntas.length - 1} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 disabled:opacity-30 hover:bg-neutral-700 transition-all">
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Siguiente</span> <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div>
            {currentIndex === preguntas.length - 1 && !viewOnly && (
              <button onClick={() => setShowLeaveConfirm(true)} className="flex items-center gap-2 px-6 py-2.5 bg-accent-cyan text-black font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">
                <span className="text-xs uppercase tracking-wider">Finalizar</span> <i className="fas fa-paper-plane"></i>
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* MODAL CONFIRMACIÓN */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-cyan text-2xl"><i className="fas fa-flag-checkered"></i></div>
              <h3 className="text-white text-xl font-bold mb-2">¿Terminar ahora?</h3>
              <p className="text-neutral-400 text-sm mb-6">Se enviarán tus respuestas y serás redirigido al panel principal.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowLeaveConfirm(false)} className="py-2 bg-neutral-800 text-neutral-300 rounded-xl">Revisar</button>
                <button onClick={handleSubmitAnswers} className="py-2 bg-accent-cyan text-black font-bold rounded-xl">Sí, enviar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimulationRun;