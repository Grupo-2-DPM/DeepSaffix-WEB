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

// Nueva interfaz para la respuesta completa del Login
export interface LoginResponse {
  token: string;       // El JWT
  user: UsuarioSafe;   // Los datos del usuario
}

export const authService = {
  // Ahora el Promise devuelve LoginResponse en lugar de solo UsuarioSafe
  async login(dto: LoginDto): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
};
