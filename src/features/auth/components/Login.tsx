/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import type { LoginDto } from '../../../backend/services/authService';
import { authService } from '../../../backend/services/authService';
import { checkHealth } from '../../../api/http';

export const Login: React.FC<{ onLoginSuccess: (user: any) => void }> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState<LoginDto>({ correo: '', contraseña: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLocal, setIsLocal] = useState(() => localStorage.getItem('api_preference') === 'local');
  const [apiReady, setApiReady] = useState<boolean>(false);
  const [checkingApi, setCheckingApi] = useState<boolean>(true);

  useEffect(() => {
    const verify = async () => {
      setCheckingApi(true);
      setApiReady(await checkHealth());
      setCheckingApi(false);
    };
    verify();
  }, [isLocal]);

  const toggleApiMode = () => {
    const nextMode = !isLocal;
    setIsLocal(nextMode);
    localStorage.setItem('api_preference', nextMode ? 'local' : 'online');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady) return;
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(form);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Identidad no verificada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center  selection:bg-brand-500/30">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-10 max-w-md w-full animate-fade-in border-b-brand-500/10 border-b-4">

        
        <header className="flex justify-between items-start mb-12">
          <div className="border-l-4 border-brand-500 pl-5">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
              Deep <span className="text-brand-500">Saffix</span>
            </h1>
            <p className="text-[9px] text-neutral-500 font-mono mt-2 tracking-[0.3em] font-bold">ACCESO CENTRAL V2.0</p>
          </div>

          <button type="button" onClick={toggleApiMode} className="group text-right">
            <p className="text-[7px] font-black text-neutral-600 uppercase mb-1 tracking-tighter group-hover:text-neutral-400 transition-colors">Entorno de Datos</p>
            <div className={`px-2 py-1 rounded-md text-[9px] font-bold border transition-all ${isLocal ? 'bg-amber-500/5 border-amber-500/40 text-amber-500' : 'bg-emerald-500/5 border-emerald-500/40 text-emerald-500'}`}>
              {isLocal ? 'NODO_LOCAL' : 'API_REMOTA'}
            </div>
          </button>
        </header>

        {(!apiReady || checkingApi) && (
          <div className={`p-4 rounded-xl mb-8 text-[10px] font-mono border flex items-center gap-4 animate-pulse ${checkingApi ? 'bg-brand-500/5 border-brand-500/20 text-brand-400' : 'bg-amber-500/5 border-amber-500/20 text-amber-500'}`}>
            <div className="h-2 w-2 rounded-full bg-current animate-ping" />
            {checkingApi ? 'INICIALIZANDO ENLACE DE RENDER...' : 'SIN CONEXIÓN: ESPERANDO RESPUESTA DEL SERVIDOR'}
          </div>
        )}

        {error && <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 mb-8 text-xs font-bold uppercase tracking-tight animate-shake">{error}</div>}

        <form onSubmit={handleSubmit} className={`space-y-7 ${!apiReady ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">ID de Credencial</label>
            <input name="correo" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} type="email" required placeholder="usuario@institucion.edu.co" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-brand-500 outline-none transition-all placeholder:text-neutral-800" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Llave de Seguridad</label>
            <div className="relative">
              <input name="contraseña" value={form.contraseña} onChange={e => setForm({ ...form, contraseña: e.target.value })} type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:border-brand-500 outline-none transition-all placeholder:text-neutral-800" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-[9px] font-black text-neutral-600 hover:text-brand-500 transition-colors uppercase tracking-tighter">
                {showPassword ? 'OCULTAR' : 'MOSTRAR'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || !apiReady} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(0,115,187,0.3)] transition-all active:scale-[0.97] disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-3 border-b-4 border-brand-800 active:border-b-0 uppercase text-xs tracking-[0.2em]">
            {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {loading ? 'Autenticando...' : 'Autorizar Ingreso'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-neutral-800/50 text-center">
          <button onClick={() => window.dispatchEvent(new CustomEvent('show-register'))} className="text-[10px] font-black text-brand-500 hover:text-white transition-all uppercase tracking-[0.2em] italic">
            + Solicitar Nuevo Protocolo de Acceso
          </button>
        </div>
      </div>
    </div>
  );
};