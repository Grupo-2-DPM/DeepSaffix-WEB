/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { usuariosService } from '../../../backend/services/usuariosService';
import type { Usuario } from '../../../backend/models/Usuario';
import { UserEdit } from './UserEdit';

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usuariosService.list();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message ?? 'Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id: number) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    try {
      await usuariosService.deactivateUsuario(id);
      fetchUsers();
    } catch (err: any) {
      alert(err?.message ?? 'Error al eliminar');
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = users.slice(start, start + pageSize);

  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 rounded-xl w-full overflow-hidden animate-fade-in">
      {/* Cabecera con estilo de consola */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-neutral-200">Usuarios</h3>
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            CONSOLE · USER MANAGEMENT
          </span>
        </div>
      </div>

      {loading && (
        <p className="text-neutral-400 text-sm flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-neutral-600 border-t-accent-cyan rounded-full animate-spin" />
          Sincronizando...
        </p>
      )}
      {error && <p className="text-red-400 bg-red-950/30 border border-red-800 rounded-lg p-3 text-sm">{error}</p>}

      {!loading && !error && (
        <>
          {/* Controles superiores con estética técnica */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Mostrar por página
              </span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Total registros: <span className="text-neutral-300">{users.length}</span>
            </div>
          </div>

          {/* Tabla con scroll responsivo */}
          <div className="overflow-x-auto rounded-lg border border-neutral-800">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900">
                  <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">ID</th>
                  <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Nombre</th>
                  <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Correo</th>
                  <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Estado</th>
                  <th className="py-3 px-4 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(u => (
                  <tr key={u.id_usuario} className="border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 text-neutral-300 font-mono text-sm">{u.id_usuario}</td>
                    <td className="py-3 px-4 text-neutral-300">{u.nombre} {u.apellido}</td>
                    <td className="py-3 px-4 text-neutral-300">{u.correo}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {u.estado_cuenta}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="text-[10px] font-bold tracking-widest uppercase text-brand-500 hover:text-brand-400 transition-all active:scale-95"
                        >
                          Editar perfil
                        </button>
                        <button
                          onClick={() => handleDeactivate(u.id_usuario)}
                          className="text-[10px] font-bold tracking-widest uppercase text-red-500 hover:text-red-400 transition-all active:scale-95"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación con estilo de terminal */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all active:scale-95"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all active:scale-95"
              >
                Siguiente
              </button>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500">
              PÁGINA <span className="text-neutral-300">{page}</span> / <span className="text-neutral-300">{totalPages}</span>
            </span>
            <div className="sm:ml-auto flex items-center gap-2">
              <label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Ir a página
              </label>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={e => goToPage(Number(e.target.value))}
                className="w-20 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-300 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>
        </>
      )}

      {editingUser && (
        <div className="mt-8 border-t border-neutral-800 pt-6 animate-fade-in">
          <UserEdit
            user={editingUser}
            onSaved={() => { setEditingUser(null); fetchUsers(); }}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}
    </div>
  );
};
