import React, { useEffect, useRef, useMemo } from "react";
import { useUserStats } from "../../hooks/useUserStats";

interface Metric {
  label: string;
  value: number | string;
  unit?: string;
  status: "healthy" | "warning" | "critical";
  icon: string;
}

export const SystemHealth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stats, loading } = useUserStats();

  const metrics: Metric[] = useMemo(() => {
    if (!stats) {
      return [
        {
          label: "Eficiencia",
          value: 0,
          unit: "%",
          status: "critical",
          icon: "fa-chart-line",
        },
        {
          label: "Correctas",
          value: 0,
          status: "critical",
          icon: "fa-check-circle",
        },
        {
          label: "Errores",
          value: 0,
          status: "critical",
          icon: "fa-xmark-circle",
        },
      ];
    }

    const eficiencia = stats.eficiencia ?? 0;
    const correctas = stats.totalCorrectas ?? 0;
    const incorrectas = stats.totalIncorrectas ?? 0;
    const promedio = stats.promedioPuntaje ?? 0;

    const getStatus = (val: number) => {
      if (val >= 75) return "healthy";
      if (val >= 50) return "warning";
      return "critical";
    };

    return [
      {
        label: "Eficiencia",
        value: eficiencia,
        unit: "%",
        status: getStatus(eficiencia),
        icon: "fa-chart-line",
      },
      {
        label: "Correctas",
        value: correctas,
        status: "healthy",
        icon: "fa-check-circle",
      },
      {
        label: "Errores",
        value: incorrectas,
        status: incorrectas > correctas ? "warning" : "healthy",
        icon: "fa-xmark-circle",
      },
      {
        label: "Promedio",
        value: promedio,
        status: getStatus(eficiencia),
        icon: "fa-star",
      },
    ];
  }, [stats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 300;
    const height = 50;
    canvas.width = width;
    canvas.height = height;

    const particles: Array<{ x: number; y: number; vx: number; vy: number }> =
      [];

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
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
        ctx.fillStyle = "rgba(0, 242, 255, 0.08)";
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
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative inline-flex items-center gap-6 rounded-full border border-neutral-800 bg-neutral-950/40 px-8 py-3 shadow-2xl backdrop-blur-xl">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full rounded-full"
        />

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6">
          {loading ? (
            <span className="font-mono text-xs text-neutral-500">
              Sincronizando métricas...
            </span>
          ) : (
            metrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 font-mono text-sm"
              >
                <i
                  className={`fa-solid ${metric.icon} ${getStatusColor(
                    metric.status
                  )}`}
                />

                <span className="text-brand-400 font-bold">
                  {metric.value}
                  {metric.unit}
                </span>

                <span className="hidden text-[10px] tracking-wider text-neutral-500 uppercase sm:inline">
                  {metric.label}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
