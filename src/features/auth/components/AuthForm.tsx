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
  const [apiReady, setApiReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    confirmContraseña: "",
    programa_academico: "",
    semestre: "" as number | "",
  });

  // Verificación constante de la API
  useEffect(() => {
    const verify = async () => {
      const status = await checkHealth();
      setApiReady(status);
    };
    verify();
    const interval = setInterval(verify, 15000); // Reintentar cada 15s
    return () => clearInterval(interval);
  }, []);

  // Escuchar evento para mostrar registro
  useEffect(() => {
    const handler = () => {
      setError(null);
      setIsRegister(true);
    };
    window.addEventListener("show-register", handler);
    return () => window.removeEventListener("show-register", handler);
  }, []);

  // Lógica de validaciones
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
  const isEduEmail = /^[^\s@]+@[^\s@]+\.edu\.co$/.test(form.correo);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiReady) return setError("Sin conexión con el servidor");
    if (!passwordsMatch) return setError("Las contraseñas no coinciden");
    if (!isEduEmail) return setError("Use un correo .edu.co");

    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmContraseña, ...dataToSend } = form;
      await usuariosService.create(dataToSend as any);
      alert("Registro exitoso. Inicie sesión.");
      setIsRegister(false); // Regresar al login
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Error en registro"
      );
    } finally {
      setLoading(false);
    }
  };

  // SI NO ESTÁ EN MODO REGISTRO, MOSTRAR LOGIN
  if (!isRegister) {
    return (
      <Login onLoginSuccess={onLoginSuccess} externalApiReady={apiReady} />
    );
  }

  return (
    <div className="selection:bg-brand-500/30 flex min-h-screen w-full items-center justify-center p-6">
      <div className="animate-fade-in w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
            Crear Cuenta
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${apiReady ? "animate-pulse bg-emerald-500" : "bg-red-500"}`}
            />
            <span className="font-mono text-[10px] text-neutral-500 uppercase">
              {apiReady ? "En línea" : "Desconectado"}
            </span>
          </div>
        </header>

        {error && (
          <div className="animate-shake mb-6 border-l-4 border-red-500 bg-red-500/10 p-4 text-xs font-bold text-red-400 uppercase">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className={`space-y-4 ${!apiReady ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Nombre"
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="focus:border-brand-500 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
              required
            />
            <input
              placeholder="Apellido"
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="focus:border-brand-500 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
              required
            />
          </div>

          <input
            type="email"
            placeholder="correo@institucion.edu.co"
            onChange={(e) =>
              setForm({ ...form, correo: e.target.value.toLowerCase() })
            }
            className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
            required
          />

          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
                className="focus:border-brand-500 w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-4 text-[10px] text-neutral-500"
              >
                {showPassword ? "OCULTAR" : "MOSTRAR"}
              </button>
            </div>
            <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-neutral-800">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 transition-colors ${i < passwordStats.score ? passwordStats.color : "bg-neutral-800"}`}
                />
              ))}
            </div>
          </div>

          <input
            type="password"
            placeholder="Confirmar Contraseña"
            onChange={(e) =>
              setForm({ ...form, confirmContraseña: e.target.value })
            }
            className={`w-full rounded-xl border bg-neutral-950 p-3 text-white outline-none ${passwordsMatch ? "border-emerald-500/50" : "border-neutral-800"}`}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Programa"
              onChange={(e) =>
                setForm({ ...form, programa_academico: e.target.value })
              }
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
              required
            />
            <input
              type="number"
              placeholder="Semestre"
              onChange={(e) =>
                setForm({ ...form, semestre: Number(e.target.value) })
              }
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-white outline-none"
              required
            />
          </div>

          <button
            disabled={
              loading || !apiReady || !passwordsMatch || passwordStats.score < 2
            }
            className="bg-brand-600 hover:bg-brand-500 w-full rounded-xl py-4 font-bold tracking-widest text-white uppercase transition-all disabled:opacity-20"
          >
            {loading ? "Procesando..." : "Registrar Acceso"}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(false)}
          className="mt-6 w-full text-[10px] font-bold text-neutral-500 uppercase transition-colors hover:text-white"
        >
          ¿Ya tienes cuenta? Regresar al login
        </button>
      </div>
    </div>
  );
};
