interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarHeader: React.FC<Props> = ({
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
      {!collapsed && (
        <>
          <span
            className="bg-accent-cyan shadow-[0_0_8px_#00f2ff]s h-2.5 w-2.5 rounded-full"
            aria-hidden="true"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-widest text-neutral-100">
              DEEPSAFFIX
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              Kernel v2.4.1
            </span>
          </div>
        </>
      )}

      <button
        onClick={onToggleCollapse}
        className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none md:flex"
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-chevron-left text-neutral-400" />
      </button>
    </div>
  );
};
