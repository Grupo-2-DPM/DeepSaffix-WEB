import React, { useState } from 'react';
import type { LoginDto } from '../../../backend/services/authService';
import { authService } from '../../../backend/services/authService';

export type LoginFormData = LoginDto

interface Props {
  onLoginSuccess: (user: unknown) => void;
}

export const Login: React.FC<Props> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState<LoginFormData>({ correo: '', contraseña: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseError = (raw: any) => {
    try {
      const j = JSON.parse(raw);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(parseError(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
        <div className="mb-10 text-left border-l-4 border-brand-500 pl-4">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">
            Deep <span className="text-brand-400">Saffix</span>
          </h1>
          <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">SISTEMA DE SIMULACROS V2.0</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-3 mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="correo" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Identificación de Usuario</label>
            <div className="relative">
              <input
                id="correo" name="correo" value={form.correo} onChange={handleChange}
                type="email" required placeholder="usuario@institucion.edu.co"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 placeholder:text-neutral-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="contraseña" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Clave de Acceso</label>
            <div className="relative">
              <input
                id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange}
                type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 placeholder:text-neutral-700 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <button
                type="button" onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-3 text-[10px] font-bold text-neutral-600 hover:text-brand-400 transition-colors"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 border-b-2 border-brand-800"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span className="tracking-widest uppercase text-sm">Ejecutar Ingreso</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('show-register'))}
            className="text-xs font-bold text-brand-400 hover:text-accent-cyan transition-colors"
          >
            + SOLICITAR NUEVA CUENTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
