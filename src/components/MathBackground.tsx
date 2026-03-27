import React, { useEffect, useRef } from "react";

const MathBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const symbols = [
      "∫", "∑", "∂", "π", "∞", "√", "Δ", "∇", "∈", "∀",
      "σ", "μ", "λ", "θ", "φ", "Ω", "α", "β", "γ", "ε",
      "P(x)", "E[X]", "dx", "lim", "→", "≈", "±", "×",
      "f(x)", "∮", "ℝ", "ℤ", "∝", "≡", "⊂", "∪"
    ];

    interface Particle {
      x: number;
      y: number;
      symbol: string;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
      phase: number;
    }

    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 20,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: 10 + Math.random() * 16,
      speed: 0.15 + Math.random() * 0.35,
      opacity: 0.04 + Math.random() * 0.1,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    });

    const initParticles = () => {
      const count = Math.floor(canvas.offsetWidth / 40);
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.offsetHeight;
        particles.push(p);
      }
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.speed;
        p.x += Math.sin(time + p.phase) * p.drift;

        if (p.y < -30) {
          particles[i] = createParticle();
          continue;
        }

        ctx.font = `${p.size}px 'Courier New', monospace`;
        ctx.fillStyle = `hsla(270, 70%, 65%, ${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
      }

      // Draw subtle grid lines
      ctx.strokeStyle = "hsla(270, 50%, 50%, 0.03)";
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.offsetHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.offsetWidth, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
};

export default MathBackground;
