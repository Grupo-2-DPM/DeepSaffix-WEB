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
  const [mounted, setMounted] = useState(false);
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
    <div className={`min-h-screen flex items-center justify-center bg-slate-900  ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
            <span className="text-gray-500 font-semibold text-xl">{initials(displayUser.nombre, displayUser.apellido)}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{displayUser.nombre} {displayUser.apellido}</h2>
          <p className="text-sm text-gray-500 mt-1 mb-4">{displayUser.correo}</p>

          <div className="w-full border-t my-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 font-medium text-sm">Registrado</div>
                <div className="text-gray-800 text-sm">{formattedDate}</div>
              </div>
              <div className="flex items-center sm:justify-end">
                <div>
                  <div className="text-gray-600 font-medium text-sm">Estado</div>
                  <div className="mt-2">
                    {displayUser.estado_cuenta === 'ACTIVO' ? (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">ACTIVO</span>
                    ) : (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">INACTIVO</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Perfil académico */}
          <div className="w-full border-t pt-4 mt-4">
            <div className="mb-2 text-sm text-gray-600 font-medium">Perfil académico</div>
            {displayUser.perfilAcademico ? (
              <div className="text-sm text-gray-800">
                <div><strong>Programa:</strong> {displayUser.perfilAcademico.programa_academico ?? '-'}</div>
                <div><strong>Semestre:</strong> {displayUser.perfilAcademico.semestre ?? '-'}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No hay información académica registrada.</div>
            )}

            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(e => !e)} className="px-3 py-1 bg-blue-600 text-gray-500 rounded text-sm">{editing ? 'Cerrar' : 'Editar perfil'}</button>
            </div>
            {editing && displayUser && (
              <div className="mt-3">
                <UserEdit user={displayUser} onSaved={async (updated) => { setEditing(false); if (updated) setLocalUser(prev => ({ ...(prev ?? displayUser), perfilAcademico: updated } as any)); if (typeof onProfileUpdated === 'function') await onProfileUpdated(); }} onCancel={() => setEditing(false)} />
              </div>
            )}

            <div className="w-full flex justify-center mt-6">
              <button onClick={() => setConfirmOpen(true)} className="bg-red-500 hover:bg-red-600 text-gray-500 px-4 py-2 rounded-lg transition-colors">Desactivar cuenta</button>
            </div>
          </div>
        </div>

        <ModalConfirm open={confirmOpen} title="Desactivar cuenta" description="¿Confirma que desea desactivar su cuenta?" onConfirm={handleConfirm} onCancel={() => setConfirmOpen(false)} confirmLabel="Desactivar" cancelLabel="Cancelar" />
      </div>
    </div>
  );
};

export default ProfileCard;
