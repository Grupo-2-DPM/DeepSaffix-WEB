/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { usuariosService } from "../../../backend/services/usuariosService";
import type { Usuario } from "../../../backend/models/Usuario";
import { UserEdit } from "./UserEdit";

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
      setError(err?.message ?? "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id: number) => {
    if (!confirm("¿Desactivar este usuario?")) return;
    try {
      await usuariosService.deactivateUsuario(id);
      fetchUsers();
    } catch (err: any) {
      alert(err?.message ?? "Error al eliminar");
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = users.slice(start, start + pageSize);

  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="animate-fade-in w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:p-6">
      {/* Cabecera con estilo de consola */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-neutral-200">Usuarios</h3>
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            CONSOLE · USER MANAGEMENT
          </span>
        </div>
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-neutral-400">
          <span className="border-t-accent-cyan inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-600" />
          Sincronizando...
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-800 bg-red-950/30 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Controles superiores con estética técnica */}
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Mostrar por página
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="focus:ring-brand-500 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-300 transition-all focus:ring-1 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
              Total registros:{" "}
              <span className="text-neutral-300">{users.length}</span>
            </div>
          </div>

          {/* Tabla con scroll responsivo */}
          <div className="overflow-x-auto rounded-lg border border-neutral-800">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900">
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Correo
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr
                    key={u.id_usuario}
                    className="border-b border-neutral-800 transition-colors hover:bg-neutral-900/50"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-neutral-300">
                      {u.id_usuario}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">{u.correo}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-[10px] font-bold tracking-wider text-neutral-300">
                        {u.estado_cuenta}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="text-brand-500 hover:text-brand-400 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95"
                        >
                          Editar perfil
                        </button>
                        <button
                          onClick={() => handleDeactivate(u.id_usuario)}
                          className="text-[10px] font-bold tracking-widest text-red-500 uppercase transition-all hover:text-red-400 active:scale-95"
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
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-500">
              PÁGINA <span className="text-neutral-300">{page}</span> /{" "}
              <span className="text-neutral-300">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2 sm:ml-auto">
              <label className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                Ir a página
              </label>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="focus:ring-brand-500 w-20 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-300 transition-all focus:ring-1 focus:outline-none"
              />
            </div>
          </div>
        </>
      )}

      {editingUser && (
        <div className="animate-fade-in mt-8 border-t border-neutral-800 pt-6">
          <UserEdit
            user={editingUser}
            onSaved={() => {
              setEditingUser(null);
              fetchUsers();
            }}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}
    </div>
  );
};
