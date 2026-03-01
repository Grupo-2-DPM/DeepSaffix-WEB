interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<Props> = ({
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-800">
      {!collapsed && (
        <>
          <span
            className="h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f2ff]"
            aria-hidden="true" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-widest text-neutral-100">
              DEEPSAFFIX
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              Kernel v2.4.1
            </span>
          </div>
        </>
      )}

      <button
        onClick={onToggleCollapse}
        className="
          hidden md:flex
          h-8 w-8
          items-center justify-center
          rounded-md
          hover:bg-neutral-800
          focus:outline-none focus:ring-2 focus:ring-cyan-500
        "
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-chevron-left text-neutral-400" />
      </button>
    </div>
  );
};