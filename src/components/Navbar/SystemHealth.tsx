import React, { useEffect, useRef, useState } from "react";

interface Metric {
  label: string;
  value: number | string;
  unit?: string;
  status: "healthy" | "warning" | "critical";
}

export const SystemHealth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "LAT", value: 24, unit: "ms", status: "healthy" },
    { label: "ACT", value: 1432, unit: "", status: "healthy" },
    { label: "UPT", value: "99.9", unit: "%", status: "healthy" },
  ]);

  // Simular cambios periódicos en las métricas (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.label === "LAT") {
            const newVal = Math.floor(Math.random() * 30) + 10;
            return {
              ...m,
              value: newVal,
              status: newVal > 25 ? "warning" : "healthy",
            };
          }
          if (m.label === "ACT") {
            const newVal = Math.floor(Math.random() * 500) + 1200;
            return { ...m, value: newVal };
          }
          return m;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Canvas de partículas de fondo (muy sutil)
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

  // Función para obtener el color del indicador de estado
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
    <div className="relative flex h-10 items-center overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/30 px-4 backdrop-blur-sm">
      {/* Canvas de partículas de fondo */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
      />

      {/* Contenido: métricas */}
      <div className="relative z-10 flex items-center gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {/* Indicador de estado con ping */}
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

            {/* Valor y unidad */}
            <span className="text-brand-400 font-mono text-xs">
              {metric.value}
              {metric.unit && (
                <span className="ml-0.5 text-[0.6rem] text-neutral-500">
                  {metric.unit}
                </span>
              )}
            </span>

            {/* Etiqueta (opcional, para desktop) */}
            <span className="hidden text-[0.6rem] tracking-wider text-neutral-500 uppercase sm:inline">
              {metric.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
