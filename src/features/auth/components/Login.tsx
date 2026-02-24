/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import type { LoginDto } from '../../../backend/services/authService';
import { authService } from '../../../backend/services/authService';
import { REMOTE_API_URL, LOCAL_API_URL } from '../../../api/http';

export type LoginFormData = LoginDto;

interface Props {
  onLoginSuccess: (user: unknown) => void;
}

export const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState<LoginFormData>({ correo: '', contraseña: '' });
  const [loading, setLoading] = useState(false);
  const [slowApi, setSlowApi] = useState(false); // <--- Nuevo estado
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [isLocal, setIsLocal] = useState(() => localStorage.getItem('api_preference') === 'local');

  // Lógica para detectar carga lenta
  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setSlowApi(true), 2000);
    } else {
      setSlowApi(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const toggleApiMode = () => {
    const nextMode = !isLocal;
    setIsLocal(nextMode);
    localStorage.setItem('api_preference', nextMode ? 'local' : 'online');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const parseError = (raw: any) => {
    try {
      const j = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(j.message)) return j.message.join(', ');
      if (j.message) return typeof j.message === 'string' ? j.message : JSON.stringify(j.message);
      return raw?.toString?.() ?? 'Error desconocido';
    } catch {
      return raw?.toString?.() ?? 'Error desconocido';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(form);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setError(parseError(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">

        <div className="flex justify-between items-start mb-10">
          <div className="border-l-4 border-brand-500 pl-4">
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Deep <span className="text-brand-400">Saffix</span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">SIMULACROS V2.0</p>
          </div>

          <button type="button" onClick={toggleApiMode} className="group flex flex-col items-end gap-1 transition-opacity hover:opacity-80">
            <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-tighter">Entorno de Datos</span>
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold border ${isLocal ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'}`}>
              {isLocal ? '● LOCALHOST:3000' : '● CLOUD API'}
            </div>
          </button>
        </div>

        {/* MENSAJE DE CARGA LENTA */}
        {slowApi && !error && (
          <div className="bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-lg p-3 mb-6 text-[10px] font-mono leading-relaxed animate-pulse">
            LA API ESTÁ TARDANDO EN RESPONDER... <br />
            Si es el primer acceso, el servidor remoto puede tardar hasta 30s en "despertar". Por favor, espera.
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-3 mb-6 text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-1">
            <label htmlFor="correo" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Identificación</label>
            <input id="correo" name="correo" value={form.correo} onChange={handleChange} type="email" required placeholder="usuario@institucion.edu.co" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
          </div>

          <div className="space-y-1">
            <label htmlFor="contraseña" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Clave</label>
            <div className="relative">
              <input id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange} type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-3 text-[10px] font-bold text-neutral-600 hover:text-brand-400">
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 border-b-2 border-brand-800">
              {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              <span className="tracking-widest uppercase text-sm">{loading ? 'Procesando...' : 'Ejecutar Ingreso'}</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <button onClick={() => window.dispatchEvent(new CustomEvent('show-register'))} className="text-xs font-bold text-brand-400 hover:text-accent-cyan transition-colors italic">
            + SOLICITAR NUEVA CUENTA
          </button>
        </div>
        <p className="text-[9px] text-center mt-4 text-neutral-700 font-mono italic">
          Destino: {isLocal ? LOCAL_API_URL : REMOTE_API_URL}
        </p>
      </div>
    </div>
  );
};