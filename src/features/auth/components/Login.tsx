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
  
  // Estado de salud de la API
  const [apiReady, setApiReady] = useState<boolean>(false);
  const [checkingApi, setCheckingApi] = useState<boolean>(true);

  useEffect(() => {
    const verify = async () => {
      setCheckingApi(true);
      const healthy = await checkHealth();
      setApiReady(healthy);
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
      setError(err?.message || 'Error de acceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8 max-w-md w-full">
        
        <div className="flex justify-between items-start mb-10">
          <div className="border-l-4 border-brand-500 pl-4">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Deep <span className="text-brand-400">Saffix</span></h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">SIMULACROS V2.0</p>
          </div>

          <button type="button" onClick={toggleApiMode} className="flex flex-col items-end gap-1">
            <span className="text-[8px] font-bold text-neutral-500 uppercase">Entorno</span>
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold border ${isLocal ? 'border-amber-500 text-amber-500' : 'border-emerald-500 text-emerald-500'}`}>
              {isLocal ? '● LOCAL' : '● CLOUD'}
            </div>
          </button>
        </div>

        {/* Mensaje dinámico basado en salud real, no en timers */}
        {!apiReady && (
          <div className={`p-3 rounded-lg mb-6 text-[10px] font-mono border animate-pulse ${checkingApi ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
            {checkingApi ? 'SINCROIZANDO NODO...' : '⚠️ EL SERVIDOR ESTÁ DESPERTANDO, POR FAVOR ESPERE...'}
          </div>
        )}

        {error && <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-3 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className={`space-y-6 ${!apiReady ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase">Identificación</label>
            <input name="correo" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} type="email" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase">Clave</label>
            <div className="relative">
              <input name="contraseña" value={form.contraseña} onChange={e => setForm({...form, contraseña: e.target.value})} type={showPassword ? 'text' : 'password'} required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[10px] text-neutral-600 uppercase font-bold">{showPassword ? 'HIDE' : 'SHOW'}</button>
            </div>
          </div>

          <button type="submit" disabled={loading || !apiReady} className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-lg border-b-2 border-brand-800 disabled:opacity-50">
            {loading ? 'PROCESANDO...' : 'EJECUTAR INGRESO'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <button onClick={() => window.dispatchEvent(new CustomEvent('show-register'))} className="text-xs font-bold text-brand-400 italic">+ SOLICITAR NUEVA CUENTA</button>
        </div>
      </div>
    </div>
  );
};