/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import simulationService from "../backend/services/simulationService";

export type Disponible = {
  id: string;
  nombre: string;
  descripcion?: string;
};

export const useSimulacros = () => {
  const [disponibles, setDisponibles] = useState<Disponible[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list = await simulationService.list();
      const mapped = list.map((s: any) => ({
        id: String(s.id_simulacro),
        nombre: s.nombre,
        descripcion: s.descripcion,
      }));
      setDisponibles(mapped);
    } catch (err) {
      console.error("Error cargando simulacros", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    disponibles,
    loading,
    refreshDisponibles: load,
  };
};
