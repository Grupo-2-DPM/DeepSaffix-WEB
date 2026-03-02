/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from "react";
import { Login } from "./Login";
import { usuariosService } from "../../../backend/services/usuariosService";
import { checkHealth } from "../../../api/http";

export const AuthForm = ({
  onLoginSuccess,
}: {
  onLoginSuccess: (user: any) => void;
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    confirmContraseña: "",
    programa_academico: "",
    semestre: "" as number | "",
  });
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  // Lógica de fuerza de contraseña
  const passwordStats = useMemo(() => {
    const pass = form.contraseña;
    if (!pass) return { score: 0, label: "Vacía", color: "bg-neutral-800" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    const config = [
      { label: "Muy Débil", color: "bg-red-500" },
      { label: "Débil", color: "bg-orange-500" },
      { label: "Media", color: "bg-yellow-500" },
      { label: "Fuerte", color: "bg-emerald-500" },
      { label: "Inviolable", color: "bg-brand-400" },
    ];
    return { score, ...config[score] };
  }, [form.contraseña]);

  const passwordsMatch = form.contraseña === form.confirmContraseña;

  useEffect(() => {
    const verify = async () => {
      setApiReady(await checkHealth());
    };
    verify();
    const interval = setInterval(async () => {
      if (!apiReady) setApiReady(await checkHealth());
    }, 10000);
    return () => clearInterval(interval);
  }, [apiReady, isRegister]);

  useEffect(() => {
    const handler = () => setIsRegister(true);
    window.addEventListener("show-register", handler);
    return () => window.removeEventListener("show-register", handler);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady || !passwordsMatch || passwordStats.score < 2) return;
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmContraseña, ...dataToSend } = form;
      await usuariosService.create(dataToSend as any);
      alert("Registro exitoso.");
      setIsRegister(false);
    } catch (err: any) {
      setError(err?.message || "Error en registro");
    } finally {
      setLoading(false);
    }
  };

  if (!isRegister) return <Login onLoginSuccess={onLoginSuccess} />;

  return (
    <div className="selection:bg-brand-500/30 flex min-h-screen w-full items-center justify-center p-6">
      <div className="animate-fade-in border-t-brand-500/20 w-full max-w-2xl rounded-2xl border border-t-2 border-neutral-800 bg-neutral-900 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 ${apiReady ? "bg-brand-500 shadow-[0_0_20px_rgba(0,115,187,0.4)]" : "bg-neutral-800"} flex items-center justify-center rounded-xl transition-all duration-500`}
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
                Crear Cuenta
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${apiReady ? "animate-pulse bg-emerald-500" : "bg-amber-500"}`}
                />
                <p className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                  {apiReady ? "Servicio Activo" : "Sincronizando..."}
                </p>
              </div>
            </div>
          </div>
        </header>

        {!apiReady && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center font-mono text-[11px] text-amber-500">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
            EL NODO CENTRAL NO RESPONDE. REINTENTANDO CONEXIÓN...
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className={`space-y-5 transition-all duration-500 ${!apiReady ? "pointer-events-none opacity-20 blur-sm" : ""}`}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Nombre
              </label>
              <input
                placeholder="Ej. Carlos"
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-all outline-none placeholder:text-neutral-700 focus:ring-1"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Apellido
              </label>
              <input
                placeholder="Ej. Pérez"
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                required
                className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-all outline-none placeholder:text-neutral-700 focus:ring-1"
              />
            </div>
          </div>

          <input
            type="email"
            placeholder="usuario@universidad.edu.co"
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            onChange={(e) =>
              setForm({ ...form, correo: e.target.value.toLowerCase() })
            }
            className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-all outline-none placeholder:text-neutral-700 focus:ring-1"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) =>
                    setForm({ ...form, contraseña: e.target.value })
                  }
                  required
                  className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 pr-14 text-white transition-all outline-none focus:ring-1"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="hover:text-brand-500 absolute top-4 right-4 text-[9px] font-black tracking-tighter text-neutral-600 uppercase transition-colors"
                >
                  {showPassword ? "OCULTAR" : "MOSTRAR"}
                </button>
              </div>

              {/* Medidor de Fuerza */}
              <div className="px-1 pt-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase">
                    Seguridad: {passwordStats.label}
                  </span>
                </div>
                <div className="flex h-1 w-full gap-0.5 overflow-hidden rounded-full bg-neutral-800">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 transition-all duration-500 ${
                        i < passwordStats.score
                          ? passwordStats.color
                          : "bg-neutral-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Confirmar
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={(e) =>
                    setForm({ ...form, confirmContraseña: e.target.value })
                  }
                  required
                  className={`w-full rounded-xl border bg-neutral-950 px-4 py-3 pr-14 text-white transition-all outline-none focus:ring-1 ${
                    form.confirmContraseña
                      ? passwordsMatch
                        ? "border-emerald-500/50 focus:ring-emerald-500"
                        : "border-red-500/50 focus:ring-red-500"
                      : "focus:border-brand-500 border-neutral-800"
                  }`}
                />
              </div>

              {form.confirmContraseña && !passwordsMatch && (
                <p className="mt-1 text-[9px] font-bold text-red-500 uppercase">
                  No coinciden
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <input
              placeholder="Programa Académico"
              onChange={(e) =>
                setForm({ ...form, programa_academico: e.target.value })
              }
              className="focus:border-brand-500 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none"
            />
            <input
              placeholder="Semestre"
              min="1"
              max="10"
              type="number"
              onChange={(e) =>
                setForm({ ...form, semestre: Number(e.target.value) })
              }
              className="focus:border-brand-500 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none"
            />
          </div>

          <button
            disabled={loading || !apiReady || !passwordsMatch}
            type="submit"
            className="group bg-brand-600 hover:bg-brand-500 shadow-brand-950/20 mt-4 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-xs font-bold tracking-[0.2em] text-white uppercase shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
            {loading ? "Sincronizando Datos..." : "Crear Perfil de Acceso"}
          </button>
        </form>

        <footer className="mt-8 border-t border-neutral-800 pt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className="group hover:text-brand-400 text-[10px] font-bold tracking-widest text-neutral-500 uppercase transition-all"
          >
            ¿Ya tienes acceso?
          </button>
        </footer>
      </div>
    </div>
  );
};
