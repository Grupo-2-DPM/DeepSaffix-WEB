import React, { useEffect, useRef } from 'react';

export const NeuralPulse: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar tamaño del canvas al contenedor (será 240x40 en la navbar)
    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Parámetros de la animación
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];
    const PARTICLE_COUNT = 30;
    const CONNECTION_DISTANCE = 60;

    // Inicializar partículas
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: 0.5 + Math.random() * 0.5,
      });
    }

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar partículas
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Limitar al área
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      }

      // Dibujar conexiones
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)'; // --color-accent-cyan con baja opacidad
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2ff';
        ctx.shadowColor = '#00f2ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        // reset shadow para no afectar a otros dibujos
        ctx.shadowBlur = 0;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="relative h-10 w-64 md:w-80 overflow-hidden rounded-full border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm">
      {/* Fondo con gradiente móvil */}
      <div className="absolute inset-0 bg-linear-to-r from-brand-500/5 via-accent-cyan/5 to-brand-500/5 animate-gradient-x" />
      
      {/* Canvas para partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Texto superpuesto (opcional) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono text-neutral-400 tracking-widest">
          <span className="text-accent-cyan">NEURAL</span> PULSE
        </span>
      </div>
    </div>
  );
};