import { useEffect, useState } from 'react';
import Login from './Login';
import { usuariosService } from '../../../backend/services/usuariosService';

interface AuthFormProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthForm = ({ onLoginSuccess }: AuthFormProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [programa, setPrograma] = useState('');
  const [semestre, setSemestre] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseError = (raw: any) => {
    try {
      const j = JSON.parse(raw);
      if (Array.isArray(j.message)) return j.message.join(', ');
      if (j.message) return typeof j.message === 'string' ? j.message : JSON.stringify(j.message);
      return raw;
    } catch {
      return raw?.toString?.() ?? 'Error desconocido';
    }
  };

  useEffect(() => {
    const handler = () => setIsRegister(true);
    window.addEventListener('show-register', handler as EventListener);
    return () => window.removeEventListener('show-register', handler as EventListener);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!nombre || !apellido || !correo || !contraseña) {
      setError('Complete los campos obligatorios');
      setLoading(false);
      return;
    }
    try {
      const payload: any = { nombre, apellido, correo, contraseña };
      if (programa) payload.programa_academico = programa;
      if (semestre !== '') payload.semestre = Number(semestre);
      await usuariosService.create(payload);
      // Auto-login después de registro
      // After successful registration, switch to login view
      setIsRegister(false);
    } catch (err: any) {
      setError(parseError(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  if (!isRegister) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crea tu cuenta</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" placeholder="Nombre" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
          <input value={apellido} onChange={e => setApellido(e.target.value)} type="text" placeholder="Apellido" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        <input value={correo} onChange={e => setCorreo(e.target.value)} type="email" placeholder="Correo electrónico" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />
        <input value={contraseña} onChange={e => setContraseña(e.target.value)} type="password" placeholder="Contraseña" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={programa} onChange={e => setPrograma(e.target.value)} type="text" placeholder="Programa académico (opcional)" className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
          <input value={semestre as any} onChange={e => setSemestre(e.target.value === '' ? '' : Number(e.target.value))} type="number" placeholder="Semestre (opcional)" min={1} max={10} className="text-gray-800 w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <p className="mt-6 text-center text-gray-600">¿Ya tienes cuenta? <button onClick={() => setIsRegister(false)} className="text-blue-600 font-bold hover:underline">Inicia sesión</button></p>
    </div>
  );
};