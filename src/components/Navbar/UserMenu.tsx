interface UserMenuProps {
  user?: {
    nombre?: string;
    role?: string;
  } | null;
  onLogout?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onLogout,
}) => {
  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onLogout}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900
                   hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500
                   transition text-neutral-400 hover:text-red-500 text-[12px]"
      > Salir
        <i
          className="fas fa-power-off text-neutral-400"
          aria-hidden="true"
        />
      </button>
      <div className="hidden sm:flex flex-col text-left">
        <span className="text-xs font-mono text-neutral-400">
          {user.nombre ?? "root"}
        </span>
        <span className="text-[10px] text-brand-400 font-medium">
          {user.role ?? "Level 2"}
        </span>
      </div>


    </div>
  );
};