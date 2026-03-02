import { useEffect, useState } from "react";
import simulationService, {
  type IntentoDTO,
} from "../backend/services/simulationService";

export interface UserStats {
  totalIntentos: number;
  totalCorrectas: number;
  totalIncorrectas: number;
  totalPreguntas: number;
  promedioPuntaje: number;
  promedioTiempo: number; // en minutos
  eficiencia: number; // %
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
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
      const attempts: IntentoDTO[] =
        await simulationService.listAttemptsByUser(userId);

      // ⚠ Aquí depende de tu backend.
      // Asumimos que:
      // - puntaje_total = número de respuestas correctas
      // - respuestas.length = total respondidas

      let totalCorrectas = 0;
      let totalPreguntas = 0;
      let totalTiempo = 0;
      let totalPuntaje = 0;
      let intentosFinalizados = 0;

      attempts.forEach((a) => {
        if (a.puntaje_total != null) {
          intentosFinalizados++;
          totalCorrectas += a.puntaje_total;
          totalPuntaje += a.puntaje_total;
        }

        if (a.respuestas) {
          totalPreguntas += a.respuestas.length;
        }

        if (a.tiempo_utilizado) {
          totalTiempo += a.tiempo_utilizado;
        }
      });

      const totalIncorrectas = totalPreguntas - totalCorrectas;

      const eficiencia =
        totalPreguntas > 0
          ? Math.round((totalCorrectas / totalPreguntas) * 100)
          : 0;

      setStats({
        totalIntentos: attempts.length,
        totalCorrectas,
        totalIncorrectas,
        totalPreguntas,
        promedioPuntaje:
          intentosFinalizados > 0
            ? Math.round(totalPuntaje / intentosFinalizados)
            : 0,
        promedioTiempo:
          attempts.length > 0 ? Math.round(totalTiempo / attempts.length) : 0,
        eficiencia,
      });
    } catch (e) {
      console.error("Error cargando estadísticas", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { stats, loading, refreshStats: load };
};
