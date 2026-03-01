export const Brand = () => {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00f2ff]"
        aria-hidden="true"
      />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-widest text-neutral-100">
          DEEPSAFFIX
        </span>
        <span className="text-[10px] font-mono text-neutral-500">
          Kernel v2.4.1
        </span>
      </div>
    </div>
  );
};