import React, { useEffect, useRef, useMemo } from "react";
import { useUserStats } from "../../hooks/useUserStats";

interface Metric {
  label: string;
  value: number | string;
  unit?: string;
  status: "healthy" | "warning" | "critical";
}

export const SystemHealth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stats, loading } = useUserStats();

  const metrics: Metric[] = useMemo(() => {
    if (!stats) {
      return [
        { label: "ACC", value: 0, unit: "%", status: "critical" },
        { label: "QST", value: 0, unit: "", status: "critical" },
        { label: "AVG", value: 0, unit: "", status: "critical" },
      ];
    }

    const eficiencia = stats.eficiencia ?? 0;
    const totalPreguntas =
      (stats.totalCorrectas ?? 0) + (stats.totalIncorrectas ?? 0);
    const promedio = stats.promedioPuntaje ?? 0;

    const getStatusFromEfficiency = (val: number) => {
      if (val >= 75) return "healthy";
      if (val >= 50) return "warning";
      return "critical";
    };

    return [
      {
        label: "ACC",
        value: eficiencia,
        unit: "%",
        status: getStatusFromEfficiency(eficiencia),
      },
      {
        label: "QST",
        value: totalPreguntas,
        unit: "",
        status: totalPreguntas > 0 ? "healthy" : "warning",
      },
      {
        label: "AVG",
        value: promedio,
        unit: "",
        status: getStatusFromEfficiency(eficiencia),
      },
    ];
  }, [stats]);

  // Canvas decorativo (igual que antes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 300;
    const height = 40;
    canvas.width = width;
    canvas.height = height;

    const particles: Array<{ x: number; y: number; vx: number; vy: number }> =
      [];

    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.05,
      });
    }

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 242, 255, 0.1)";
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  return (
    <div className="relative flex h-10 w-full items-center overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/30 px-4 backdrop-blur-sm">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex w-full flex-wrap items-center justify-center gap-4 sm:justify-start">
        {loading ? (
          <span className="font-mono text-xs text-neutral-500">
            Syncing data...
          </span>
        ) : (
          metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="relative flex items-center justify-center">
                <div
                  className={`absolute h-2 w-2 animate-ping rounded-full ${getStatusColor(
                    metric.status
                  )} opacity-75`}
                />
                <div
                  className={`relative h-1.5 w-1.5 rounded-full ${getStatusColor(
                    metric.status
                  )}`}
                />
              </div>

              <span className="text-brand-400 font-mono text-xs">
                {metric.value}
                {metric.unit && (
                  <span className="ml-0.5 text-[0.6rem] text-neutral-500">
                    {metric.unit}
                  </span>
                )}
              </span>

              <span className="hidden text-[0.6rem] tracking-wider text-neutral-500 uppercase sm:inline">
                {metric.label}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
