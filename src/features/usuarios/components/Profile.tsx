/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { usuariosService } from '../../../backend/services/usuariosService';
import type { Usuario } from '../../../backend/models/Usuario';
import ProfileCard from './ProfileCard';

interface Props {
  user: any | null;
  onLogout: () => void;
}

export const Profile: React.FC<Props> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user?.id_usuario) return;
    setLoading(true);
    setError(null);
    try {
      const data = await usuariosService.get(user.id_usuario);
      setProfile(data);
    } catch (err: any) {
      setError(err?.message ?? 'Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const handleDelete = async (id: number) => {
    try {
      await usuariosService.deactivateUsuario(id);
      onLogout();
      alert('Cuenta desactivada.');
    } catch (err: any) {
      alert(err?.message ?? 'Error al desactivar cuenta');
    }
  };

  // Si no hay sesión activa
  if (!user) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center animate-fade-in">
        <p className="text-neutral-500 text-sm font-mono tracking-widest">
          <span className="text-accent-cyan">➜</span> No hay sesión activa.
        </p>
      </div>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2">
          <i className="fas fa-spinner fa-spin text-accent-cyan text-sm"></i>
          <p className="text-neutral-400 text-sm font-mono tracking-widest">
            CARGANDO_PERFIL...
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 text-center animate-fade-in">
        <p className="text-red-400 text-sm font-mono tracking-widest">
          <span className="text-red-400">⚠</span> {error}
        </p>
      </div>
    );
  }

  // Perfil cargado correctamente
  return (
    <div className="w-full h-full flex flex-col items-center justify-start py-4 animate-fade-in">
      {/* Contenedor que permite que la tarjeta crezca si es necesario */}
      <div className="w-full max-w-5xl">
        <ProfileCard
          user={profile ?? {
            id_usuario: user.id_usuario,
            nombre: user.nombre ?? '',
            apellido: user.apellido ?? '',
            correo: user.correo ?? '',
            fecha_registro: user.fecha_registro ?? new Date().toISOString(),
            estado_cuenta: (user.estado_cuenta as any) ?? 'ACTIVO',
            perfilAcademico: (profile) ?? null
          }}
          onDelete={handleDelete}
          onProfileUpdated={fetchProfile}
        />
      </div>
    </div>
  );
};