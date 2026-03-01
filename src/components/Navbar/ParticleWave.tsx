import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  phase: number;
}

export const ParticleWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño del canvas al contenedor (ancho fijo, alto 40px)
    const width = 240; // px
    const height = 40; // px
    canvas.width = width;
    canvas.height = height;

    // Colores de la paleta (con opacidad variable)
    const colors = [
      'rgba(0, 114, 188, 0.8)',  // brand-500
      'rgba(0, 242, 255, 0.9)',  // accent-cyan
      'rgba(0, 161, 201, 0.7)',  // brand-400
    ];

    // Crear partículas
    const particles: Particle[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1, // 1-4px
        speedX: (Math.random() - 0.5) * 0.5, // movimiento horizontal lento
        speedY: (Math.random() - 0.5) * 0.2, // movimiento vertical muy lento
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2, // para la onda
      });
    }

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Dibujar un fondo muy sutil (opcional) para dar profundidad
      ctx.fillStyle = 'rgba(9, 18, 28, 0.2)'; // neutral-950 con baja opacidad
      ctx.fillRect(0, 0, width, height);

      // Actualizar y dibujar partículas
      particles.forEach(p => {
        // Movimiento base
        p.x += p.speedX;
        p.y += p.speedY;

        // Efecto de onda: añadir desplazamiento sinusoidal en Y basado en X
        const waveY = Math.sin(p.x * 0.02 + p.phase) * 4; // amplitud 4px
        const drawY = p.y + waveY;

        // Rebote en bordes (para mantenerlas dentro)
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;

        // Asegurar que estén dentro del rango
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Dibujar partícula con glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Pequeña estela (otra partícula más tenue detrás)
        ctx.shadowBlur = 5;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(p.x - p.speedX * 2, drawY - p.speedY * 2, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Restaurar alpha
        ctx.globalAlpha = 1.0;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center w-60 h-10 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/30 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Texto superpuesto opcional para dar contexto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-mono text-neutral-400/50 tracking-widest">
          SISTEMA ACTIVO
        </span>
      </div>
    </div>
  );
};