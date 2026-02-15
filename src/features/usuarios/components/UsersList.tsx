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
    <div className="p-4 sm:p-6 bg-white rounded shadow w-full overflow-hidden">
      <h3 className="text-xl font-semibold mb-4">Usuarios</h3>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Mostrar por página:</span>
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="ml-2 px-2 py-1 border rounded">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">Total: {users.length}</div>
        </div>

        <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => (
              <tr key={u.id_usuario} className="border-b">
                <td className="py-2">{u.id_usuario}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.estado_cuenta}</td>
                <td>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <button onClick={() => setEditingUser(u)} className="text-blue-600">Editar perfil</button>
                    <button onClick={() => handleDeactivate(u.id_usuario)} className="text-red-600">Desactivar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <div className="flex gap-2">
            <button disabled={page<=1} onClick={() => goToPage(page-1)} className="px-3 py-1 bg-gray-100 rounded">Anterior</button>
            <button disabled={page>=totalPages} onClick={() => goToPage(page+1)} className="px-3 py-1 bg-gray-100 rounded">Siguiente</button>
          </div>
          <span className="text-sm">Página {page} / {totalPages}</span>
          <div className="ml-auto">
            <label className="text-sm mr-2">Ir a página:</label>
            <input type="number" min={1} max={totalPages} value={page} onChange={e => goToPage(Number(e.target.value))} className="w-20 ml-2 px-2 py-1 border rounded" />
          </div>
        </div>
        </>
      )}

      {editingUser && (
        <div className="mt-6">
          <UserEdit user={editingUser} onSaved={() => { setEditingUser(null); fetchUsers(); }} onCancel={() => setEditingUser(null)} />
        </div>
      )}
    </div>
  );
};
