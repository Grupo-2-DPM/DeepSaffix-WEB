import React from "react";

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
  title = "Confirmar acción",
  description = "¿Estás seguro?",
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con animación de fade */}
      <div
        className="animate-fade-in absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal con animación de entrada (escala y fade) */}
      <div className="animate-scale-in relative z-10 w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl transition-all">
        {/* Badge técnico */}
        <div className="mb-3">
          <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            ⚡ ACCION REQUERIDA
          </span>
        </div>

        {/* Título con estilo de consola */}
        <h3 className="mb-2 text-lg font-semibold text-neutral-200">{title}</h3>

        {/* Descripción con texto secundario */}
        <p className="mb-6 text-sm text-neutral-400">{description}</p>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-700 active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg border border-red-800 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
