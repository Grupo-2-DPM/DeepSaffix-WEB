interface UserMenuProps {
  user?: {
    nombre?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onLogout}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-[12px] text-neutral-400 transition hover:border-red-500 hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
      >
        {" "}
        Salir
        <i className="fas fa-power-off text-neutral-400" aria-hidden="true" />
      </button>
      <div className="hidden flex-col text-left sm:flex">
        <span className="text-brand-400 font-mono text-xs">
          {user.nombre ?? "root"}
        </span>
      </div>
    </div>
  );
};
