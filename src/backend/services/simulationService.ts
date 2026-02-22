import { http } from '../../api/http';

export interface SimulacroDTO {
  id_simulacro: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos?: number;
}

export interface IntentoDTO {
  id_intento: number;
  id_usuario: number;
  id_simulacro: number;
  fecha_inicio: string;
  fecha_fin?: string;
  tiempo_utilizado?: number;
  puntaje_total?: number;
  simulacro?: SimulacroDTO;
  respuestas?: { id_pregunta: number; id_opcion: number }[];
}

export const simulationService = {
  async list(): Promise<SimulacroDTO[]> {
    return http<SimulacroDTO[]>('/simulacros');
  },

  async startAttempt(simId: number, id_usuario: number): Promise<IntentoDTO> {
    return http<IntentoDTO>(`/simulacros/${simId}/intentos`, {
      method: 'POST',
      body: JSON.stringify({ id_usuario }),
    });
  },

  async getAttempt(attemptId: number): Promise<IntentoDTO> {
    return http<IntentoDTO>(`/simulacros/intentos/${attemptId}`);
  },

  async listAttemptsByUser(id_usuario: number): Promise<IntentoDTO[]> {
    return http<IntentoDTO[]>(`/simulacros/usuarios/${id_usuario}/intentos`);
  },

  async finishAttempt(attemptId: number): Promise<IntentoDTO> {
    return http<IntentoDTO>(`/simulacros/intentos/${attemptId}/finalizar`, { method: 'POST' });
  },

  async getSimulacro(simId: number): Promise<SimulacroDTO> {
    return http<SimulacroDTO>(`/simulacros/${simId}`);
  },

  async submitAnswers(attemptId: number, optionIds: number[]): Promise<{ inserted: number }> {
    return http<{ inserted: number }>(`/simulacros/intentos/${attemptId}/respuestas`, {
      method: 'POST',
      body: JSON.stringify({ selected_option_ids: optionIds }),
    });
  },
};

export default simulationService;
