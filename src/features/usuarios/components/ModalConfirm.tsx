import React from 'react';

interface ModalConfirmProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  open,
  title = 'Confirmar acción',
  description = '¿Estás seguro?',
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con animación de fade */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal con animación de entrada (escala y fade) */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl w-full max-w-md p-6 z-10 animate-scale-in transition-all">
        {/* Badge técnico */}
        <div className="mb-3">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            ⚡ ACCION REQUERIDA
          </span>
        </div>

        {/* Título con estilo de consola */}
        <h3 className="text-lg font-semibold text-neutral-200 mb-2">{title}</h3>

        {/* Descripción con texto secundario */}
        <p className="text-sm text-neutral-400 mb-6">{description}</p>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-700 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-800 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-all active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
