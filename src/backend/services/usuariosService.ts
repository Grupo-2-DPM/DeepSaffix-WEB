import { http } from '../../api/http';
import type { Usuario } from '../models/Usuario';

export const usuariosService = {
  async list(): Promise<Usuario[]> {
    return http<Usuario[]>('/usuarios');
  },

  async get(id: number): Promise<Usuario> {
    return http<Usuario>(`/usuarios/${id}`);
  },

  async create(payload: Partial<Usuario>): Promise<Usuario> {
    return http<Usuario>('/usuarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deactivateUsuario(id: number): Promise<void> {
    return http<void>(`/usuarios/${id}/eliminar`, {
      method: 'PATCH',
    });
  },
};
