/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { Usuario } from '../../../backend/models/Usuario';
import ModalConfirm from './ModalConfirm';
import { UserEdit } from './UserEdit';

export type User = Usuario;

interface ProfileCardProps {
  user: User | null;
  onDelete: (id: number) => Promise<void>;
  onProfileUpdated?: () => void;
}

function initials(name: string | undefined, apellido?: string | undefined) {
  if (!name) return 'U';
  const first = name.trim().split(' ')[0] || name;
  const a = apellido ?? '';
  const second = a.trim().split(' ')[0] || '';
  const i = (first[0] ?? '').toUpperCase();
  const j = (second[0] ?? '').toUpperCase();
  return (i + j).slice(0, 2);
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onDelete, onProfileUpdated }) => {
  const [, setMounted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [localUser, setLocalUser] = useState<User | null>(user);
  useEffect(() => { setLocalUser(user); }, [user]);
  useEffect(() => { setMounted(true); }, []);

  const displayUser = localUser ?? user;
  if (!displayUser) return null;

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!displayUser) return;
    await onDelete(displayUser.id_usuario);
  };

  const formattedDate = displayUser.fecha_registro ? new Date(displayUser.fecha_registro).toLocaleString() : '-';

  return (
    <div className="bg-neutral-900 w-full rounded-2xl border border-neutral-800 shadow-2xl p-6 md:p-10 animate-fade-in relative overflow-hidden">
      <div className="flex flex-col items-center text-center">
        {/* Avatar con iniciales, estilo consola */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-linear-to-r from-brand-600 to-brand-500 mb-4 border-2 border-accent-cyan/50">
          <span className="text-white font-mono font-bold text-xl">{initials(displayUser.nombre, displayUser.apellido)}</span>
        </div>

        {/* Nombre y correo con tipografía técnica */}
        <h2 className="text-2xl font-mono font-bold text-white">
          {displayUser.nombre} {displayUser.apellido}
        </h2>
        <p className="text-sm font-mono text-neutral-500 mt-1 mb-4">
          <span className="text-accent-cyan">➜</span> {displayUser.correo}
        </p>

        {/* Línea divisoria */}
        <div className="w-full border-t border-neutral-800 my-6"></div>

        {/* Grid de información */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-left">
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Registrado</div>
            <div className="text-sm font-mono text-neutral-300">{formattedDate}</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Estado</div>
            <div className="mt-1">
              {displayUser.estado_cuenta === 'ACTIVO' ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-mono text-brand-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                  ACTIVO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-mono text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  INACTIVO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perfil académico */}
        <div className="w-full border-t border-neutral-800 pt-4 mt-4">
          <div className="mb-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex items-center gap-1">
            <i className="fas fa-graduation-cap text-accent-cyan text-xs"></i>
            Perfil académico
          </div>
          {displayUser.perfilAcademico ? (
            <div className="text-sm font-mono text-neutral-300 space-y-1">
              <div><span className="text-neutral-500">PROGRAMA:</span> {displayUser.perfilAcademico.programa_academico ?? '-'}</div>
              <div><span className="text-neutral-500">SEMESTRE:</span> {displayUser.perfilAcademico.semestre ?? '-'}</div>
            </div>
          ) : (
            <div className="text-sm font-mono text-neutral-500">No hay información académica registrada.</div>
          )}

          {/* Botones de acción con estilo técnico */}
          <div className="mt-3 flex gap-2 justify-center">
            <button
              onClick={() => setEditing(e => !e)}
              className="px-3 py-1 bg-transparent border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-accent-cyan rounded text-[10px] font-mono tracking-widest uppercase transition-all active:scale-95"
            >
              {editing ? 'Cerrar' : 'Editar perfil'}
            </button>
          </div>

          {/* Componente de edición (UserEdit) - se mantiene igual */}
          {editing && displayUser && (
            <div className="mt-3">
              <UserEdit
                user={displayUser}
                onSaved={async (updated) => {
                  setEditing(false);
                  if (updated) setLocalUser(prev => ({ ...(prev ?? displayUser), perfilAcademico: updated } as any));
                  if (typeof onProfileUpdated === 'function') await onProfileUpdated();
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          )}

          {/* Botón de desactivar cuenta con estilo danger */}
          <div className="w-full flex justify-center mt-6">
            <button
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg text-xs font-mono tracking-widest uppercase transition-all active:scale-95"
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