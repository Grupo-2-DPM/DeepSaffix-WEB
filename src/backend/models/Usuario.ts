export type EstadoCuenta = 'ACTIVO' | 'INACTIVO' | 'ELIMINADO';

export interface PerfilAcademico {
  id_perfil: number;
  programa_academico: string;
  semestre: number;
  fecha_actualizacion: string;
  id_usuario: number;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  fecha_registro: string;
  estado_cuenta: EstadoCuenta;
  perfilAcademico?: PerfilAcademico | null;
}
