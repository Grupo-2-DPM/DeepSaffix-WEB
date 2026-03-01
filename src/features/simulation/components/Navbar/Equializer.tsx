import { useMemo } from "react";

export const Equalizer = () => {
  const bars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        height: 8 + i * 2,
      })),
    []
  );

  return (
    <div className="flex items-end gap-0.5 h-8" aria-hidden="true">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="w-0.75 rounded-full bg-accent-cyan/60"
          style={{ height: `${bar.height}px` }}
        />
      ))}
    </div>
  );
};