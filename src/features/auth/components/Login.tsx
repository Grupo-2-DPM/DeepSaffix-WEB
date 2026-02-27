/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { authService } from '../../../backend/services/authService';
import { checkHealth, REMOTE_API_URL, LOCAL_API_URL } from '../../../api/http';

export const Login: React.FC<{ onLoginSuccess: (user: any) => void }> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ correo: '', contraseña: '' });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [isLocal, setIsLocal] = useState(() => localStorage.getItem('api_preference') === 'local');
  
  // NUEVOS ESTADOS DE CONEXIÓN
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verificar salud de la API al montar o cambiar de red
  useEffect(() => {
    const verifyApi = async () => {
      setApiStatus('checking');
      const isAlive = await checkHealth();
      setApiStatus(isAlive ? 'online' : 'offline');
    };
    verifyApi();
  }, [isLocal]);

  const toggleApiMode = () => {
    const nextMode = !isLocal;
    setIsLocal(nextMode);
    localStorage.setItem('api_preference', nextMode ? 'local' : 'online');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apiStatus !== 'online') return; // Bloquear si la API no responde
    
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(form);
      localStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 max-w-md w-full">
        
        {/* Selector de API y Estado */}
        <div className="flex justify-between items-start mb-8">
          <div className="border-l-4 border-brand-500 pl-4">
            <h1 className="text-xl font-black text-white uppercase italic">Deep Saffix</h1>
            <div className="flex items-center gap-2 mt-1">
               <div className={`h-2 w-2 rounded-full ${
                 apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 
                 apiStatus === 'checking' ? 'bg-amber-500' : 'bg-red-500'
               }`} />
               <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                 {apiStatus === 'online' ? 'Sistema Listo' : 
                  apiStatus === 'checking' ? 'Verificando Nodo...' : 'Servidor No Disponible'}
               </span>
            </div>
          </div>
          
          <button type="button" onClick={toggleApiMode} className="text-right">
            <div className={`px-2 py-1 rounded text-[9px] font-bold border ${isLocal ? 'border-amber-500 text-amber-500' : 'border-emerald-500 text-emerald-500'}`}>
              {isLocal ? 'LOCALHOST' : 'CLOUD API'}
            </div>
          </button>
        </div>

        {/* Mensajes de Advertencia Dinámicos */}
        {apiStatus === 'checking' && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-3 rounded-lg mb-6 text-[10px] font-mono">
             ⌛ CONECTANDO CON EL SERVIDOR... ESPERE POR FAVOR.
          </div>
        )}

        {apiStatus === 'offline' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-[10px] font-mono text-center">
             🚫 LA API NO RESPONDE EN: <br/> 
             <span className="text-white">{isLocal ? LOCAL_API_URL : REMOTE_API_URL}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo"
            disabled={apiStatus !== 'online'}
            onChange={(e) => setForm({...form, correo: e.target.value})}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white disabled:opacity-30"
          />
          <input 
            type="password" 
            placeholder="Clave"
            disabled={apiStatus !== 'online'}
            onChange={(e) => setForm({...form, contraseña: e.target.value})}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white disabled:opacity-30"
          />

          <button 
            type="submit" 
            disabled={loading || apiStatus !== 'online'}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-lg disabled:bg-neutral-800 disabled:text-neutral-600 transition-all uppercase text-xs tracking-widest"
          >
            {loading ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};