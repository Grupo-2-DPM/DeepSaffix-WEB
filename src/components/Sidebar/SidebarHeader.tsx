export const SidebarHeader = () => {
  return (
    <div className="px-6 py-6 border-b border-neutral-800">
      <div className="flex items-center gap-2">
        <i className="fas fa-terminal text-accent-cyan text-sm" aria-hidden="true" />
        <span className="text-white font-mono text-lg tracking-wide">
          DeepSaffix
        </span>
        <span className="text-[10px] font-semibold text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded">
          v1.0.0
        </span>
      </div>
    </div>
  );
};