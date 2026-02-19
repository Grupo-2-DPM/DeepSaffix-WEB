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
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mt-2">Accede a tu cuenta para gestionar tus simulacros</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="login-form">
          <div>
            <label htmlFor="correo" className="sr-only">Correo electrónico</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 11 2.94 6.94z" /><path d="M18 8.2V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.2l8 4.8 8-4.8z" /></svg>
              </span>
              <input id="correo" name="correo" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" type="email" required className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
            </div>
          </div>

          <div>
            <label htmlFor="contraseña" className="sr-only">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 8a5 5 0 1110 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a1 1 0 011-1h1V8zm2 0v2h6V8a3 3 0 00-6 0z" clipRule="evenodd" /></svg>
              </span>
              <input id="contraseña" name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" type={showPassword ? 'text' : 'password'} required className="w-full pl-10 pr-14 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

              <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600">
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              ) : null}
              <span>{loading ? 'Conectando...' : 'Iniciar sesión'}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <button onClick={() => { window.dispatchEvent(new CustomEvent('show-register')); }} className="text-blue-500 hover:underline font-medium">Regístrate</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
