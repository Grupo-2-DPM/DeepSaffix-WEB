/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { Login } from './Login';
import { usuariosService } from '../../../backend/services/usuariosService';
import { checkHealth } from '../../../api/http';

export const AuthForm = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', contraseña: '', confirmContraseña: '', programa_academico: '', semestre: '' as number | ''
  });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);

  // Lógica de fuerza de contraseña
  const passwordStats = useMemo(() => {
    const pass = form.contraseña;
    if (!pass) return { score: 0, label: 'Vacía', color: 'bg-neutral-800' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    const config = [
      { label: 'Muy Débil', color: 'bg-red-500' },
      { label: 'Débil', color: 'bg-orange-500' },
      { label: 'Media', color: 'bg-yellow-500' },
      { label: 'Fuerte', color: 'bg-emerald-500' },
      { label: 'Inviolable', color: 'bg-brand-400' }
    ];
    return { score, ...config[score] };
  }, [form.contraseña]);

  const passwordsMatch = form.contraseña === form.confirmContraseña;

  useEffect(() => {
    const verify = async () => { setApiReady(await checkHealth()); };
    verify();
    const interval = setInterval(async () => { if (!apiReady) setApiReady(await checkHealth()); }, 10000);
    return () => clearInterval(interval);
  }, [apiReady, isRegister]);

  useEffect(() => {
    const handler = () => setIsRegister(true);
    window.addEventListener('show-register', handler);
    return () => window.removeEventListener('show-register', handler);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady || !passwordsMatch || passwordStats.score < 2) return;
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmContraseña, ...dataToSend } = form;
      await usuariosService.create(dataToSend as any);
      alert("Registro exitoso.");
      setIsRegister(false);
    } catch (err: any) {
      setError(err?.message || 'Error en registro');
    } finally {
      setLoading(false);
    }
  };

  if (!isRegister) return <Login onLoginSuccess={onLoginSuccess} />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 selection:bg-brand-500/30">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 max-w-2xl w-full animate-fade-in border-t-brand-500/20 border-t-2">

        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 ${apiReady ? 'bg-brand-500 shadow-[0_0_20px_rgba(0,115,187,0.4)]' : 'bg-neutral-800'} rounded-xl flex items-center justify-center transition-all duration-500`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Crear Cuenta</h2>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${apiReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">{apiReady ? 'Servicio Activo' : 'Sincronizando...'}</p>
              </div>
            </div>
          </div>
        </header>

        {!apiReady && (
          <div className="bg-amber-500/5 border border-amber-500/20 text-amber-500 p-4 rounded-xl mb-6 text-[11px] font-mono text-center flex items-center justify-center gap-3">
            <div className="h-3 w-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            EL NODO CENTRAL NO RESPONDE. REINTENTANDO CONEXIÓN...
          </div>
        )}

        <form onSubmit={handleRegister} className={`space-y-5 transition-all duration-500 ${!apiReady ? 'opacity-20 pointer-events-none blur-sm' : ''}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Nombre</label>
              <input placeholder="Ej. Carlos" onChange={e => setForm({ ...form, nombre: e.target.value })} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-neutral-700" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Apellido</label>
              <input placeholder="Ej. Pérez" onChange={e => setForm({ ...form, apellido: e.target.value })} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-neutral-700" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Correo Institucional</label>
            <input type="email" placeholder="usuario@universidad.edu.co" onChange={e => setForm({ ...form, correo: e.target.value })} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all placeholder:text-neutral-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Contraseña</label>
              <input type="password" placeholder="••••••••" onChange={e => setForm({ ...form, contraseña: e.target.value })} required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all" />

              {/* Medidor de Fuerza */}
              <div className="px-1 pt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] uppercase font-bold text-neutral-500">Seguridad: {passwordStats.label}</span>
                </div>
                <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-full flex-1 transition-all duration-500 ${i < passwordStats.score ? passwordStats.color : 'bg-neutral-800'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase ml-1">Confirmar</label>
              <input type="password" placeholder="••••••••" onChange={e => setForm({ ...form, confirmContraseña: e.target.value })} required className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-white focus:ring-1 outline-none transition-all ${form.confirmContraseña ? (passwordsMatch ? 'border-emerald-500/50 focus:ring-emerald-500' : 'border-red-500/50 focus:ring-red-500') : 'border-neutral-800 focus:border-brand-500'}`} />
              {form.confirmContraseña && !passwordsMatch && <p className="text-[9px] text-red-500 font-bold uppercase mt-1">No coinciden</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <input placeholder="Programa Académico" onChange={e => setForm({ ...form, programa_academico: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" />
            <input placeholder="Semestre" type="number" onChange={e => setForm({ ...form, semestre: Number(e.target.value) })} className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-brand-500 outline-none" />
          </div>

          <button disabled={loading || !apiReady || !passwordsMatch} type="submit" className="group w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-xl mt-4 shadow-xl shadow-brand-950/20 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em] flex justify-center items-center gap-3 disabled:opacity-50 disabled:grayscale">
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
            {loading ? 'Sincronizando Datos...' : 'Crear Perfil de Acceso'}
          </button>
        </form>

        <footer className="mt-8 text-center border-t border-neutral-800 pt-6">
          <button type="button" onClick={() => setIsRegister(false)} className="group text-[10px] font-bold text-neutral-500 hover:text-brand-400 tracking-widest uppercase transition-all">
            ¿Ya tienes acceso?
          </button>
        </footer>
      </div>
    </div>
  );
};