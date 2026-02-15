import React, { useState, useEffect } from 'react';
import { perfilAcademicoService } from '../../../backend/services/perfilAcademicoService';
import type { Usuario } from '../../../backend/models/Usuario';

interface Props {
  user: Usuario;
  onSaved?: (updatedPerfil?: any) => void;
  onCancel: () => void;
}

export const UserEdit: React.FC<Props> = ({ user, onSaved, onCancel }) => {
  const [programa, setPrograma] = useState('');
  const [semestre, setSemestre] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prefill fields when editing existing perfil academico
    if (user?.perfilAcademico) {
      setPrograma(user.perfilAcademico.programa_academico ?? '');
      setSemestre(user.perfilAcademico.semestre ?? '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!programa || !semestre) {
      alert('Complete los campos');
      return;
    }
    setLoading(true);
    try {
      const payload = { programa_academico: programa, semestre: Number(semestre) };
      let result: any = null;
      if (user?.perfilAcademico) {
        // update existing
        result = await perfilAcademicoService.update(user.id_usuario, payload);
      } else {
        // create new perfil if none exists yet
        result = await perfilAcademicoService.create(user.id_usuario, payload as any);
      }
      if (typeof onSaved === 'function') onSaved(result);
    } catch (err: any) {
      alert(err?.message ?? 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h4 className="font-semibold mb-2">Editar perfil académico: {user.nombre}</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input value={programa} onChange={e => setPrograma(e.target.value)} placeholder="Programa académico" className="w-full px-3 py-2 border rounded" />
          <input value={semestre as any} onChange={e => setSemestre(e.target.value === '' ? '' : Number(e.target.value))} type="number" placeholder="Semestre" className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button disabled={loading} onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Guardando...' : 'Guardar'}</button>
          <button onClick={onCancel} className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded">Cancelar</button>
        </div>
      </div>
    </div>
  );
};
