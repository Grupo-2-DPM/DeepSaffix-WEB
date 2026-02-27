/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Login } from './Login';
import { usuariosService } from '../../../backend/services/usuariosService';
import { checkHealth } from '../../../api/http';

export const AuthForm = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', contraseña: '', programa: '', semestre: '' as number | '' });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  
  // Salud de la API
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const healthy = await checkHealth();
      setApiReady(healthy);
    };
    verify();
    // Re-verificar cada 10 segundos si está offline para habilitar el form automáticamente
    const interval = setInterval(async () => {
        if(!apiReady) {
            const healthy = await checkHealth();
            setApiReady(healthy);
        }
    }, 10000);
    return () => clearInterval(interval);
  }, [apiReady, isRegister]);

  useEffect(() => {
    const handler = () => setIsRegister(true);
    window.addEventListener('show-register', handler);
    return () => window.removeEventListener('show-register', handler);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady) return;
    setLoading(true);
    setError(null);
    try {
      await usuariosService.create(form);
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
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl w-full">
        
        <div className="flex items-center gap-4 mb-8">
          <div className={`h-2 w-2 rounded-full ${apiReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Registro de Perfil</h2>
        </div>

        {!apiReady && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-3 rounded-lg mb-6 text-[10px] font-mono text-center">
            ESPERANDO RESPUESTA DEL NODO CENTRAL... LOS CAMPOS SE ACTIVARÁN AL CONECTAR.
          </div>
        )}

        <form onSubmit={handleRegister} className={`space-y-4 ${!apiReady ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* ... Inputs de nombre, apellido, etc (Mismo diseño de antes) ... */}
          <div className="grid grid-cols-2 gap-4">
              <input placeholder="Nombre" onChange={e => setForm({...form, nombre: e.target.value})} className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white" required />
              <input placeholder="Apellido" onChange={e => setForm({...form, apellido: e.target.value})} className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white" required />
          </div>
          <input placeholder="Correo Institucional" type="email" onChange={e => setForm({...form, correo: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white" required />
          <input placeholder="Contraseña Maestra" type="password" onChange={e => setForm({...form, contraseña: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded-lg text-white" required />
          
          <button disabled={loading || !apiReady} type="submit" className="w-full bg-brand-600 text-white font-bold py-4 rounded-lg uppercase text-xs tracking-widest flex justify-center items-center gap-2">
            {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'SINCRONIZANDO...' : 'Finalizar Configuración'}
          </button>
        </form>

        <p className="mt-8 text-center border-t border-neutral-800 pt-6">
          <button onClick={() => setIsRegister(false)} className="text-[10px] font-bold text-neutral-500 uppercase">VOLVER AL LOGIN</button>
        </p>
      </div>
    </div>
  );
};