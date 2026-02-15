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

  if (!user) return <p className="text-gray-800">No hay sesión activa.</p>;
  if (loading) return <p className="text-gray-800">Cargando perfil...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <>
      <ProfileCard
        user={profile ?? { id_usuario: user.id_usuario, nombre: user.nombre ?? '', apellido: user.apellido ?? '', correo: user.correo ?? '', fecha_registro: user.fecha_registro ?? new Date().toISOString(), estado_cuenta: (user.estado_cuenta as any) ?? 'ACTIVO', perfilAcademico: (profile && profile.perfilAcademico) ?? null }}
        onDelete={handleDelete}
        onProfileUpdated={fetchProfile}
      />
    </>
  );
};
