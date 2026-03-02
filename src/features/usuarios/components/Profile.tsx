/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { usuariosService } from "../../../backend/services/usuariosService";
import type { Usuario } from "../../../backend/models/Usuario";
import ProfileCard from "./ProfileCard";

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
      setError(err?.message ?? "Error cargando perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      await usuariosService.deactivateUsuario(id);
      onLogout();
      alert("Cuenta desactivada.");
    } catch (err: any) {
      alert(err?.message ?? "Error al desactivar cuenta");
    }
  };

  // Si no hay sesión activa
  if (!user) {
    return (
      <div className="animate-fade-in rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
        <p className="font-mono text-sm tracking-widest text-neutral-500">
          <span className="text-accent-cyan">➜</span> No hay sesión activa.
        </p>
      </div>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="animate-fade-in rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <i className="fas fa-spinner fa-spin text-accent-cyan text-sm"></i>
          <p className="font-mono text-sm tracking-widest text-neutral-400">
            CARGANDO_PERFIL...
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="animate-fade-in rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-center">
        <p className="font-mono text-sm tracking-widest text-red-400">
          <span className="text-red-400">⚠</span> {error}
        </p>
      </div>
    );
  }

  // Perfil cargado correctamente
  return (
    <div className="animate-fade-in flex h-full w-full flex-col items-center justify-start py-4">
      {/* Contenedor que permite que la tarjeta crezca si es necesario */}
      <div className="w-full max-w-5xl">
        <ProfileCard
          user={
            profile ?? {
              id_usuario: user.id_usuario,
              nombre: user.nombre ?? "",
              apellido: user.apellido ?? "",
              correo: user.correo ?? "",
              fecha_registro: user.fecha_registro ?? new Date().toISOString(),
              estado_cuenta: (user.estado_cuenta as any) ?? "ACTIVO",
              perfilAcademico: profile ?? null,
            }
          }
          onDelete={handleDelete}
          onProfileUpdated={fetchProfile}
        />
      </div>
    </div>
  );
};
