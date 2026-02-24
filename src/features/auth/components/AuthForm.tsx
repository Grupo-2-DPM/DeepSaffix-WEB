/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Login } from '../components/Login';
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
  const [slowApi, setSlowApi] = useState(false); // <--- Nuevo estado
  const [error, setError] = useState<string | null>(null);

  // Timer para carga lenta en Registro
  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setSlowApi(true), 2000);
    } else {
      setSlowApi(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const parseError = (raw: any) => {
    try {
      const j = typeof raw === 'string' ? JSON.parse(raw) : raw;
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
      setIsRegister(false);
      alert("Registro exitoso. Ya puedes iniciar sesión.");
    } catch (err: any) {
      setError(parseError(err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  if (!isRegister) return <Login onLoginSuccess={onLoginSuccess} />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-fade-in">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,115,187,0.4)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Registro de Perfil</h2>
              <p className="text-[10px] text-neutral-500 font-mono italic uppercase">Establishing protocol</p>
            </div>
          </div>
        </div>

        {/* MENSAJE DE CARGA LENTA EN REGISTRO */}
        {slowApi && !error && (
          <div className="bg-brand-500/10 border border-brand-500/30 text-brand-400 rounded-lg p-3 mb-6 text-[10px] font-mono text-center animate-pulse">
            SINCRONIZANDO CON EL SERVIDOR... EL DESPERTAR DE LA API PUEDE TARDAR UN MOMENTO.
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase">Nombre</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" placeholder="John" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase">Apellido</label>
              <input value={apellido} onChange={e => setApellido(e.target.value)} type="text" placeholder="Doe" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase">Correo Institucional</label>
            <input value={correo} onChange={e => setCorreo(e.target.value)} type="email" placeholder="email@dominio.com" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase">Contraseña Maestra</label>
            <input value={contraseña} onChange={e => setContraseña(e.target.value)} type="password" placeholder="••••••••" required className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase">Programa Académico</label>
              <input value={programa} onChange={e => setPrograma(e.target.value)} type="text" placeholder="Ingeniería..." className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase">Semestre</label>
              <input value={semestre as any} onChange={e => setSemestre(e.target.value === '' ? '' : Number(e.target.value))} type="number" min={1} max={10} placeholder="1" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-brand-50 outline-none focus:border-brand-500 transition-all" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-lg mt-4 shadow-lg shadow-brand-900/50 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em] flex justify-center items-center gap-3">
            {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'SINCRONIZANDO...' : 'Finalizar Configuración'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-[10px] font-mono text-center uppercase tracking-widest">{error}</p>}

        <p className="mt-8 text-center border-t border-neutral-800 pt-6">
          <button onClick={() => setIsRegister(false)} className="text-[10px] font-bold text-neutral-500 hover:text-brand-400 tracking-widest uppercase transition-colors">
            ¿YA TIENES ACCESO? <span className="text-brand-500 ml-1">VOLVER AL LOGIN</span>
          </button>
        </p>
      </div>
    </div>
  );
};