import { http } from '../../api/http';

export interface LoginDto {
  correo: string;
  contraseña: string;
}

export interface UsuarioSafe {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fecha_registro: string;
  estado_cuenta: string;
}

export const authService = {
  async login(dto: LoginDto): Promise<UsuarioSafe> {
    return http<UsuarioSafe>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
};
