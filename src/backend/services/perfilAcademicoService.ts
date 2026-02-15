import { http } from '../../api/http';

export interface CreatePerfilDto {
  programa_academico: string;
  semestre: number;
}

export interface UpdatePerfilDto {
  programa_academico?: string;
  semestre?: number;
}

export const perfilAcademicoService = {
  async create(id_usuario: number, payload: CreatePerfilDto) {
    return http(`/perfil-academico/${id_usuario}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(id_usuario: number, payload: UpdatePerfilDto) {
    return http(`/perfil-academico/${id_usuario}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async getByUser(id_usuario: number) {
    return http(`/perfil-academico/${id_usuario}`);
  },

  async delete(id_usuario: number) {
    return http(`/perfil-academico/${id_usuario}`, { method: 'DELETE' });
  },
};
