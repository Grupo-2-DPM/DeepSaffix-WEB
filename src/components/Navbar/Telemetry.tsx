import { Equalizer } from "./Equializer";

export const Telemetry = () => {
  return (
    <div className="hidden lg:flex items-center gap-6 border-x border-neutral-800 px-6">
      <Equalizer />
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold tracking-widest text-neutral-500">
          Throughput
        </span>
        <span className="text-sm font-mono text-brand-400">
          2.4 Gbps
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-mono text-neutral-400">
          Online
        </span>
      </div>
    </div>
  );
};