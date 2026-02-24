/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { perfilAcademicoService } from '../../../backend/services/perfilAcademicoService';
import { usuariosService } from '../../../backend/services/usuariosService';
import type { Usuario } from '../../../backend/models/Usuario';

interface Props {
  user: Usuario;
  onSaved?: (updatedPerfil?: any) => void;
  onCancel: () => void;
}

export const UserEdit: React.FC<Props> = ({ user, onSaved, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [programa, setPrograma] = useState('');
  const [semestre, setSemestre] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prefill fields when editing existing perfil academico
    setNombre(user?.nombre ?? '');
    setApellido(user?.apellido ?? '');
    if (user?.perfilAcademico) {
      setPrograma(user.perfilAcademico.programa_academico ?? '');
      setSemestre(user.perfilAcademico.semestre ?? '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!nombre || !apellido || !programa || !semestre) {
      alert('Complete los campos');
      return;
    }
    setLoading(true);
    try {
      await usuariosService.updatePerfil(user.id_usuario, { nombre, apellido });
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
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 animate-fade-in">
      {/* Encabezado con estilo consola */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-4">
        <i className="fas fa-user-edit text-accent-cyan text-sm"></i>
        <h4 className="text-white font-mono text-sm tracking-widest uppercase">
          Editar perfil
        </h4>
        <span className="text-[10px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded ml-auto">
          {user.nombre}
        </span>
      </div>

      <div className="space-y-4">
        {/* Fila: Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Nombre
            </label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ingrese nombre"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-300 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Apellido
            </label>
            <input
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              placeholder="Ingrese apellido"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-300 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all"
            />
          </div>
        </div>

        {/* Fila: Programa y Semestre */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Programa académico
            </label>
            <input
              value={programa}
              onChange={e => setPrograma(e.target.value)}
              placeholder="Ej: Ingeniería de Sistemas"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-300 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Semestre
            </label>
            <input
              value={semestre as any}
              onChange={e => setSemestre(e.target.value === '' ? '' : Number(e.target.value))}
              type="number"
              placeholder="Ej: 5"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-300 font-mono text-sm placeholder:text-neutral-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            disabled={loading}
            onClick={handleSave}
            className={`
          flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
          font-mono text-[10px] tracking-widest uppercase transition-all active:scale-95
          ${loading
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/20'
              }
        `}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin text-accent-cyan"></i>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-save text-accent-cyan"></i>
                <span>Guardar cambios</span>
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-transparent border border-neutral-700 text-neutral-400 font-mono text-[10px] tracking-widest uppercase hover:bg-neutral-800 hover:text-accent-cyan transition-all active:scale-95"
          >
            <i className="fas fa-times"></i>
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
