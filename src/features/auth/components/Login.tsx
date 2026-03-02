/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { LoginDto } from "../../../backend/services/authService";
import { authService } from "../../../backend/services/authService";
import { checkHealth } from "../../../api/http";

export const Login: React.FC<{ onLoginSuccess: (user: any) => void }> = ({
  onLoginSuccess,
}) => {
  const [form, setForm] = useState<LoginDto>({ correo: "", contraseña: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLocal, setIsLocal] = useState(
    () => localStorage.getItem("api_preference") === "local"
  );
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
    localStorage.setItem("api_preference", nextMode ? "local" : "online");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady) return;
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(form);

      // VALIDACIÓN CRÍTICA:
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        onLoginSuccess(user);
      } else {
        throw new Error("El servidor devolvió un usuario vacío");
      }
    } catch (err: any) {
      setError(err?.message || "Identidad no verificada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection:bg-brand-500/30 flex min-h-screen w-full items-center justify-center">
      <div className="animate-fade-in border-b-brand-500/10 w-full max-w-md rounded-2xl border border-b-4 border-neutral-800 bg-neutral-900 p-10 shadow-2xl">
        <header className="mb-12 flex items-start justify-between">
          <div className="border-brand-500 border-l-4 pl-5">
            <h1 className="text-3xl leading-none font-black tracking-tighter text-white uppercase">
              Deep <span className="text-brand-500">Saffix</span>
            </h1>
            <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.3em] text-neutral-500">
              ACCESO CENTRAL V2.0
            </p>
          </div>

          <button
            type="button"
            onClick={toggleApiMode}
            className="group text-right"
          >
            <p className="mb-1 text-[7px] font-black tracking-tighter text-neutral-600 uppercase transition-colors group-hover:text-neutral-400">
              Entorno de Datos
            </p>
            <div
              className={`rounded-md border px-2 py-1 text-[9px] font-bold transition-all ${isLocal ? "border-amber-500/40 bg-amber-500/5 text-amber-500" : "border-emerald-500/40 bg-emerald-500/5 text-emerald-500"}`}
            >
              {isLocal ? "NODO_LOCAL" : "API_REMOTA"}
            </div>
          </button>
        </header>

        {(!apiReady || checkingApi) && (
          <div
            className={`mb-8 flex animate-pulse items-center gap-4 rounded-xl border p-4 font-mono text-[10px] ${checkingApi ? "bg-brand-500/5 border-brand-500/20 text-brand-400" : "border-amber-500/20 bg-amber-500/5 text-amber-500"}`}
          >
            <div className="h-2 w-2 animate-ping rounded-full bg-current" />
            {checkingApi
              ? "INICIALIZANDO ENLACE DE RENDER..."
              : "SIN CONEXIÓN: ESPERANDO RESPUESTA DEL SERVIDOR"}
          </div>
        )}

        {error && (
          <div className="animate-shake mb-8 border-l-4 border-red-500 bg-red-500/10 p-4 text-xs font-bold tracking-tight text-red-400 uppercase">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`space-y-7 ${!apiReady ? "pointer-events-none opacity-30 grayscale" : ""}`}
        >
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
              Correo electronico
            </label>

            <input
              name="correo"
              value={form.correo}
              type="email"
              required
              placeholder="usuario@institucion.edu.co"
              onChange={(e) =>
                setForm({ ...form, correo: e.target.value.toLowerCase() })
              }
              className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-white transition-all outline-none placeholder:text-neutral-800"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="contraseña"
                value={form.contraseña}
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-white transition-all outline-none placeholder:text-neutral-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-brand-500 absolute top-4 right-4 text-[9px] font-black tracking-tighter text-neutral-600 uppercase transition-colors"
              >
                {showPassword ? "OCULTAR" : "MOSTRAR"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !apiReady}
            className="bg-brand-600 hover:bg-brand-500 border-brand-800 flex w-full items-center justify-center gap-3 rounded-xl border-b-4 py-4 text-xs font-black tracking-[0.2em] text-white uppercase shadow-[0_10px_30px_rgba(0,115,187,0.3)] transition-all active:scale-[0.97] active:border-b-0 disabled:opacity-30 disabled:shadow-none"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : null}
            {loading ? "Autenticando..." : "Autorizar Ingreso"}
          </button>
        </form>

        <div className="mt-12 border-t border-neutral-800/50 pt-8 text-center">
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("show-register"))
            }
            className="text-brand-500 text-[10px] font-black tracking-[0.2em] uppercase italic transition-all hover:text-white"
          >
            + Solicitar Nuevo Protocolo de Acceso
          </button>
        </div>
      </div>
    </div>
  );
};
