/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import simulationService from "../backend/services/simulationService";

export type Realizado = {
  id: string;
  nombre: string;
  fecha: string;
  progreso: number;
  resultado?: string;
  guardado?: boolean;
};

export const useIntentosUsuario = () => {
  const [realizados, setRealizados] = useState<Realizado[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;

    let userId: number | null = null;
    try {
      const user = JSON.parse(userRaw);
      userId = Number(user.id_usuario ?? user.id ?? user.userId ?? null);
    } catch {
      return;
    }

    if (!userId) return;

    setLoading(true);
    try {
      const list = await simulationService.listAttemptsByUser(userId);

      const mapped = list.map((a: any) => ({
        id: String(a.id_intento),
        nombre: a.simulacro?.nombre ?? `Simulacro ${a.id_simulacro}`,
        fecha: a.fecha_inicio
          ? new Date(a.fecha_inicio).toLocaleDateString()
          : "-",
        progreso:
          a.puntaje_total !== undefined && a.puntaje_total !== null
            ? 100
            : a.tiempo_utilizado
              ? Math.min(
                  100,
                  Math.round(
                    (a.tiempo_utilizado /
                      (a.simulacro?.duracion_minutos ?? 1)) *
                      100
                  )
                )
              : 0,
        resultado:
          a.puntaje_total !== undefined && a.puntaje_total !== null
            ? `${a.puntaje_total} pts`
            : "Pendiente",
        guardado: !!(a.respuestas && a.respuestas.length > 0),
      }));

      setRealizados(mapped);
    } catch (err) {
      console.error("Error cargando intentos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const handler = () => load();
    window.addEventListener("attemptFinished", handler);
    return () => window.removeEventListener("attemptFinished", handler);
  }, []);

  return {
    realizados,
    loading,
    refreshIntentos: load,
  };
};
