import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
}

const NeuralPulseBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouse = useRef({ x: -1000, y: -1000, active: false });

  // --- CONFIGURACIÓN TÉCNICA ---
  const SETTINGS = {
    density: 0.00005, // Partículas por píxel cuadrado (ajusta esto para + o - neuronas)
    maxParticles: 80,
    viscosity: 0.92,
    spring: 0.004,
    connectionDist: 150,
    mouseRadius: 160,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Función para crear/ajustar partículas según el área
    const syncParticles = (width: number, height: number) => {
      const area = width * height;
      const targetCount = Math.min(Math.floor(area * SETTINGS.density), SETTINGS.maxParticles);
      
      // Si el tamaño cambia drásticamente, regeneramos para evitar "huecos"
      if (Math.abs(particles.current.length - targetCount) > 10 || particles.current.length === 0) {
        const newParticles: Particle[] = [];
        for (let i = 0; i < targetCount; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          newParticles.push({
            x, y, originX: x, originY: y,
            vx: 0, vy: 0,
            size: Math.random() * 1.5 + 0.5,
            phase: Math.random() * Math.PI * 2
          });
        }
        particles.current = newParticles;
      }
    };

    // --- MANEJO DE TAMAÑO REAL (RESPONSIVE) ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // Ajustamos la resolución interna del canvas al tamaño real del DOM
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        // Sincronizamos partículas con el nuevo tamaño
        syncParticles(width, height);
      }
    });

    resizeObserver.observe(container);

    // --- BUCLE DE RENDERIZADO ---
    let time = 0;
    const render = () => {
      time += 0.015;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const pArr = particles.current;

      // Dibujar Conexiones primero (debajo de los nodos)
      ctx.beginPath();
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pArr.length; i++) {
        for (let j = i + 1; j < pArr.length; j++) {
          const dx = pArr[i].x - pArr[j].x;
          const dy = pArr[i].y - pArr[j].y;
          const distSq = dx * dx + dy * dy;
          const limitSq = SETTINGS.connectionDist * SETTINGS.connectionDist;

          if (distSq < limitSq) {
            const opacity = (1 - distSq / limitSq) * 0.15;
            ctx.strokeStyle = `rgba(0, 242, 255, ${opacity})`;
            ctx.moveTo(pArr[i].x, pArr[i].y);
            ctx.lineTo(pArr[j].x, pArr[j].y);
          }
        }
      }
      ctx.stroke();

      // Actualizar y Dibujar Neuronas
      pArr.forEach(p => {
        // Física de retorno
        p.vx += (p.originX - p.x) * SETTINGS.spring;
        p.vy += (p.originY - p.y) * SETTINGS.spring;

        // Interacción Mouse
        if (mouse.current.active) {
          const dxM = p.x - mouse.current.x;
          const dyM = p.y - mouse.current.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);
          if (distM < SETTINGS.mouseRadius) {
            const force = (1 - distM / SETTINGS.mouseRadius) * 0.8;
            p.vx += (dxM / distM) * force;
            p.vy += (dyM / distM) * force;
          }
        }

        p.vx *= SETTINGS.viscosity;
        p.vy *= SETTINGS.viscosity;
        p.x += p.vx;
        p.y += p.vy;

        // Dibujado Estético
        const pulse = Math.sin(time + p.phase) * 0.3 + 0.7;
        
        // Brillo sutil
        ctx.fillStyle = `rgba(0, 242, 255, ${0.8 * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow radial (solo si quieres un efecto más 'premium')
        if (pulse > 0.8) {
            ctx.fillStyle = `rgba(0, 242, 255, ${0.1 * pulse})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Eventos de Mouse
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [SETTINGS.connectionDist, SETTINGS.density, SETTINGS.maxParticles, SETTINGS.mouseRadius, SETTINGS.spring, SETTINGS.viscosity]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-900">
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
        style={{ opacity: 0.7 }}
      />
    </div>
  );
};

export default NeuralPulseBackground;