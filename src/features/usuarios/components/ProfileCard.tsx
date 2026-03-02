/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Usuario } from "../../../backend/models/Usuario";
import ModalConfirm from "./ModalConfirm";
import { UserEdit } from "./UserEdit";

export type User = Usuario;

interface ProfileCardProps {
  user: User | null;
  onDelete: (id: number) => Promise<void>;
  onProfileUpdated?: () => void;
}

function initials(name: string | undefined, apellido?: string | undefined) {
  if (!name) return "U";
  const first = name.trim().split(" ")[0] || name;
  const a = apellido ?? "";
  const second = a.trim().split(" ")[0] || "";
  const i = (first[0] ?? "").toUpperCase();
  const j = (second[0] ?? "").toUpperCase();
  return (i + j).slice(0, 2);
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onDelete,
  onProfileUpdated,
}) => {
  const [, setMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [localUser, setLocalUser] = useState<User | null>(user);
  useEffect(() => {
    setLocalUser(user);
  }, [user]);
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayUser = localUser ?? user;
  if (!displayUser) return null;

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!displayUser) return;
    await onDelete(displayUser.id_usuario);
  };

  const formattedDate = displayUser.fecha_registro
    ? new Date(displayUser.fecha_registro).toLocaleString()
    : "-";

  return (
    <div className="animate-fade-in relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl md:p-10">
      <div className="flex flex-col items-center text-center">
        {/* Avatar con iniciales, estilo consola */}
        <div className="from-brand-600 to-brand-500 border-accent-cyan/50 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 bg-linear-to-r">
          <span className="font-mono text-xl font-bold text-white">
            {initials(displayUser.nombre, displayUser.apellido)}
          </span>
        </div>

        {/* Nombre y correo con tipografía técnica */}
        <h2 className="font-mono text-2xl font-bold text-white">
          {displayUser.nombre} {displayUser.apellido}
        </h2>
        <p className="mt-1 mb-4 font-mono text-sm text-neutral-500">
          <span className="text-accent-cyan">➜</span> {displayUser.correo}
        </p>

        {/* Línea divisoria */}
        <div className="my-6 w-full border-t border-neutral-800"></div>

        {/* Grid de información */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-left">
            <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              Registrado
            </div>
            <div className="font-mono text-sm text-neutral-300">
              {formattedDate}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              Estado
            </div>
            <div className="mt-1">
              {displayUser.estado_cuenta === "ACTIVO" ? (
                <span className="border-brand-500/30 bg-brand-500/10 text-brand-400 inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs">
                  <span className="bg-brand-400 h-1.5 w-1.5 animate-pulse rounded-full"></span>
                  ACTIVO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  INACTIVO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perfil académico */}
        <div className="mt-4 w-full border-t border-neutral-800 pt-4">
          <div className="mb-2 flex items-center gap-1 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            <i className="fas fa-graduation-cap text-accent-cyan text-xs"></i>
            Perfil académico
          </div>
          {displayUser.perfilAcademico ? (
            <div className="space-y-1 font-mono text-sm text-neutral-300">
              <div>
                <span className="text-neutral-500">PROGRAMA:</span>{" "}
                {displayUser.perfilAcademico.programa_academico ?? "-"}
              </div>
              <div>
                <span className="text-neutral-500">SEMESTRE:</span>{" "}
                {displayUser.perfilAcademico.semestre ?? "-"}
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm text-neutral-500">
              No hay información académica registrada.
            </div>
          )}

          {/* Botones de acción con estilo técnico */}
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={() => setEditing((e) => !e)}
              className="hover:text-accent-cyan rounded border border-neutral-700 bg-transparent px-3 py-1 font-mono text-[10px] tracking-widest text-neutral-400 uppercase transition-all hover:bg-neutral-800 active:scale-95"
            >
              {editing ? "Cerrar" : "Editar perfil"}
            </button>
          </div>

          {/* Componente de edición (UserEdit) - se mantiene igual */}
          {editing && displayUser && (
            <div className="mt-3">
              <UserEdit
                user={displayUser}
                onSaved={async (updated) => {
                  setEditing(false);
                  if (updated)
                    setLocalUser(
                      (prev) =>
                        ({
                          ...(prev ?? displayUser),
                          perfilAcademico: updated,
                        }) as any
                    );
                  if (typeof onProfileUpdated === "function")
                    await onProfileUpdated();
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          )}

          {/* Botón de desactivar cuenta con estilo danger */}
          <div className="mt-6 flex w-full justify-center">
            <button
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg border border-red-500/50 bg-transparent px-4 py-2 font-mono text-xs tracking-widest text-red-400 uppercase transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95"
            >
              <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
              Desactivar cuenta
            </button>
          </div>
        </div>
      </div>

      {/* ModalConfirm se mantiene igual, pero debería también tener estilo oscuro; asumimos que ya está adaptado o se adaptará después */}
      <ModalConfirm
        open={confirmOpen}
        title="Desactivar cuenta"
        description="¿Confirma que desea desactivar su cuenta?"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Desactivar"
        cancelLabel="Cancelar"
      />
    </div>
  );
};

export default ProfileCard;
