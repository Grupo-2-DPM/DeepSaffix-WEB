/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { LoginDto } from "../../../backend/services/authService";
import { authService } from "../../../backend/services/authService";
import { checkHealth } from "../../../api/http";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  externalApiReady: boolean; // Recibido del padre
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  externalApiReady,
}) => {
  const [form, setForm] = useState<LoginDto>({ correo: "", contraseña: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLocal, setIsLocal] = useState(
    () => localStorage.getItem("api_preference") === "local"
  );

  // Sincronización de API
  const [apiReady, setApiReady] = useState(externalApiReady);
  const [checkingApi, setCheckingApi] = useState(!externalApiReady);

  useEffect(() => {
    const verify = async () => {
      setCheckingApi(true);
      const status = await checkHealth();
      setApiReady(status);
      setCheckingApi(false);
    };

    // Si el padre dice que no está lista, o si cambiamos de local/remoto, verificamos
    if (
      !externalApiReady ||
      isLocal !== (localStorage.getItem("api_preference") === "local")
    ) {
      verify();
    } else {
      setApiReady(true);
      setCheckingApi(false);
    }
  }, [isLocal, externalApiReady]);

  const toggleApiMode = () => {
    const nextMode = !isLocal;
    setIsLocal(nextMode);
    localStorage.setItem("api_preference", nextMode ? "local" : "online");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady) return;
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(form);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err?.message || "Identidad no verificada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection:bg-brand-500/30 flex min-h-screen w-full items-center justify-center">
      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-b-4 border-neutral-800 bg-neutral-900 p-10 shadow-2xl">
        <header className="mb-12 flex items-start justify-between">
          <div className="border-brand-500 border-l-4 pl-5">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              Deep <span className="text-brand-500">Saffix</span>
            </h1>
            <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-neutral-500">
              ACCESO CENTRAL V2.0
            </p>
          </div>

          <button
            type="button"
            onClick={toggleApiMode}
            className="group text-right"
          >
            <p className="text-[7px] font-black text-neutral-600 uppercase group-hover:text-neutral-400">
              Entorno
            </p>
            <div
              className={`rounded-md border px-2 py-1 text-[9px] font-bold ${isLocal ? "border-amber-500/40 text-amber-500" : "border-emerald-500/40 text-emerald-500"}`}
            >
              {isLocal ? "LOCAL" : "REMOTO"}
            </div>
          </button>
        </header>

        {/* Status de Conexión: Solo bloquea si REALMENTE está chequeando y no hay respuesta */}
        {(!apiReady || checkingApi) && (
          <div
            className={`mb-8 animate-pulse rounded-xl border p-4 font-mono text-[10px] ${checkingApi ? "border-brand-500/20 text-brand-400" : "border-amber-500/20 text-amber-500"}`}
          >
            {checkingApi ? "ESTABLECIENDO VÍNCULO..." : "SERVIDOR NO DETECTADO"}
          </div>
        )}

        {error && (
          <div className="animate-shake mb-8 border-l-4 border-red-500 bg-red-500/10 p-4 text-xs font-bold text-red-400 uppercase">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`space-y-7 transition-all ${!apiReady && checkingApi ? "pointer-events-none opacity-30" : "opacity-100"}`}
        >
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={form.correo}
              required
              placeholder="usuario@institucion.edu.co"
              onChange={(e) =>
                setForm({ ...form, correo: e.target.value.toLowerCase() })
              }
              className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-white transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.contraseña}
                required
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-white transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-brand-500 absolute top-4 right-4 text-[9px] font-black text-neutral-600 uppercase"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button
            disabled={loading || !apiReady}
            className="bg-brand-600 border-brand-800 w-full rounded-xl border-b-4 py-4 text-xs font-black tracking-[0.2em] text-white uppercase shadow-lg transition-all active:scale-95 active:border-b-0 disabled:opacity-30"
          >
            {loading ? "AUTENTICANDO..." : "AUTORIZAR INGRESO"}
          </button>
        </form>

        <div className="mt-12 border-t border-neutral-800/50 pt-8 text-center">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("show-register"))
            }
            className="text-brand-500 text-[10px] font-black tracking-widest uppercase italic transition-all hover:text-white"
          >
            + SOLICITAR NUEVO PROTOCOLO DE ACCESO
          </button>
        </div>
      </div>
    </div>
  );
};
