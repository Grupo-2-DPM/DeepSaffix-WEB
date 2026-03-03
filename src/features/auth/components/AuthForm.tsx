/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
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
  const [error, setError] = useState<string | null>(null); // Ahora se usa para mostrar feedback
  const [apiReady, setApiReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Lógica de fuerza de contraseña mejorada
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

  const passwordsMatch =
    form.contraseña === form.confirmContraseña && form.confirmContraseña !== "";

  // Validación de negocio: ¿Es un correo institucional?
  const isEduEmail = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.edu\.co$/.test(form.correo);
  }, [form.correo]);

  useEffect(() => {
    const verify = async () => {
      const status = await checkHealth();
      setApiReady(status);
    };
    verify();
  }, [isRegister]);

  useEffect(() => {
    const handler = () => setIsRegister(true);
    window.addEventListener("show-register", handler);
    return () => window.removeEventListener("show-register", handler);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // VALIDACIONES PRE-ENVÍO
    if (!apiReady) return setError("El servidor no está disponible.");
    if (!passwordsMatch) return setError("Las contraseñas no coinciden.");
    if (passwordStats.score < 2)
      return setError("La contraseña es demasiado débil.");
    if (!isEduEmail)
      return setError("Se requiere un correo institucional (.edu.co)");
    if (!form.programa_academico || !form.semestre)
      return setError("Complete la información académica.");

    setLoading(true);
    try {
      const { confirmContraseña, ...dataToSend } = form;
      // Sanitización final
      const cleanData = {
        ...dataToSend,
        nombre: dataToSend.nombre.trim(),
        apellido: dataToSend.apellido.trim(),
      };

      await usuariosService.create(cleanData as any);

      // Feedback de éxito y reseteo
      alert("Registro exitoso. Ahora puede iniciar sesión.");
      setIsRegister(false);
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        confirmContraseña: "",
        programa_academico: "",
        semestre: "",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Error crítico en el registro"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isRegister) return <Login onLoginSuccess={onLoginSuccess} />;

  return (
    <div className="selection:bg-brand-500/30 flex min-h-screen w-full items-center justify-center p-6">
      <div className="animate-fade-in border-t-brand-500/20 w-full max-w-2xl rounded-2xl border border-t-2 border-neutral-800 bg-neutral-900 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Cabecera... (Mismo código tuyo) */}
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

        {/* Muestra el error si existe */}
        {error && (
          <div className="animate-shake mb-6 border-l-4 border-red-500 bg-red-500/10 p-4 text-[11px] font-bold tracking-tight text-red-400 uppercase">
            {error}
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
                value={form.nombre}
                placeholder="Ej. Carlos"
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Apellido
              </label>
              <input
                value={form.apellido}
                placeholder="Ej. Pérez"
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                required
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
              Correo Institucional
            </label>
            <input
              type="email"
              value={form.correo}
              placeholder="usuario@universidad.edu.co"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  correo: e.target.value.toLowerCase().trim(),
                })
              }
              className={`w-full rounded-xl border bg-neutral-950 px-4 py-3 text-white transition-all outline-none ${
                form.correo && !isEduEmail
                  ? "border-amber-500/50"
                  : "focus:border-brand-500 border-neutral-800"
              }`}
            />
            {form.correo && !isEduEmail && (
              <p className="ml-1 text-[8px] font-bold text-amber-500 uppercase">
                Debe terminar en .edu.co
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.contraseña}
                placeholder="••••••••"
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
                required
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 pr-14 text-white transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-4 right-4 text-[9px] font-black text-neutral-600 hover:text-white"
              >
                {showPassword ? "OCULTAR" : "MOSTRAR"}
              </button>
            </div>
            {/* Medidor de Fuerza */}
            <div className="px-1 pt-1">
              <div className="flex h-1 w-full gap-0.5 overflow-hidden rounded-full bg-neutral-800">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full flex-1 transition-all duration-500 ${i < passwordStats.score ? passwordStats.color : "bg-neutral-800"}`}
                  />
                ))}
              </div>
              <p className="mt-1 text-[8px] font-bold text-neutral-500 uppercase">
                Seguridad: {passwordStats.label}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={form.confirmContraseña}
              placeholder="••••••••"
              onChange={(e) =>
                setForm({ ...form, confirmContraseña: e.target.value })
              }
              required
              className={`w-full rounded-xl border bg-neutral-950 px-4 py-3 text-white transition-all outline-none ${
                form.confirmContraseña
                  ? passwordsMatch
                    ? "border-emerald-500/50"
                    : "border-red-500/50"
                  : "focus:border-brand-500 border-neutral-800"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Programa
              </label>
              <input
                value={form.programa_academico}
                placeholder="Ingeniería..."
                onChange={(e) =>
                  setForm({ ...form, programa_academico: e.target.value })
                }
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-bold text-neutral-500 uppercase">
                Semestre
              </label>
              <input
                value={form.semestre}
                placeholder="1-10"
                min="1"
                max="12"
                type="number"
                onChange={(e) =>
                  setForm({ ...form, semestre: Number(e.target.value) })
                }
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          <button
            disabled={
              loading || !apiReady || !passwordsMatch || passwordStats.score < 2
            }
            type="submit"
            className="group bg-brand-600 hover:bg-brand-500 mt-4 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all disabled:opacity-30"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Crear Perfil de Acceso"
            )}
          </button>
        </form>

        <footer className="mt-8 border-t border-neutral-800 pt-6 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className="hover:text-brand-400 text-[10px] font-bold tracking-widest text-neutral-500 uppercase"
          >
            ¿Ya tienes acceso? Regresar al Login
          </button>
        </footer>
      </div>
    </div>
  );
};
