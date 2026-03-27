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

    interface Diagram {
      x: number;
      y: number;
      type: "triangle" | "sine" | "graph" | "spiral" | "bell" | "matrix" | "fractal" | "polar" | "vector";
      size: number;
      speed: number;
      opacity: number;
      phase: number;
      rotation: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];
    const diagrams: Diagram[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 20,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: 12 + Math.random() * 20,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.12 + Math.random() * 0.2,
      drift: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
    });

    const diagramTypes: Diagram["type"][] = ["triangle", "sine", "graph", "spiral", "bell", "matrix", "fractal", "polar", "vector"];

    const createDiagram = (): Diagram => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 60,
      type: diagramTypes[Math.floor(Math.random() * diagramTypes.length)],
      size: 30 + Math.random() * 40,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.08 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
    });

    const drawDiagram = (d: Diagram) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.strokeStyle = `hsla(270, 70%, 65%, ${d.opacity})`;
      ctx.lineWidth = 1.2;

      switch (d.type) {
        case "triangle":
          // Sierpinski-like triangle
          ctx.beginPath();
          ctx.moveTo(0, -d.size);
          ctx.lineTo(-d.size * 0.866, d.size * 0.5);
          ctx.lineTo(d.size * 0.866, d.size * 0.5);
          ctx.closePath();
          ctx.stroke();
          // Inner triangle
          ctx.beginPath();
          ctx.moveTo(0, d.size * 0.5);
          ctx.lineTo(-d.size * 0.433, -d.size * 0.25);
          ctx.lineTo(d.size * 0.433, -d.size * 0.25);
          ctx.closePath();
          ctx.stroke();
          break;

        case "matrix":
          // Matrix/grid of dots with connecting lines
          const gridN = 4;
          const spacing = d.size * 2 / gridN;
          for (let r = 0; r <= gridN; r++) {
            for (let c = 0; c <= gridN; c++) {
              const gx = -d.size + c * spacing;
              const gy = -d.size + r * spacing;
              ctx.beginPath();
              ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(270, 70%, 65%, ${d.opacity})`;
              ctx.fill();
            }
          }
          // Diagonal lines
          ctx.beginPath();
          ctx.moveTo(-d.size, -d.size);
          ctx.lineTo(d.size, d.size);
          ctx.moveTo(d.size, -d.size);
          ctx.lineTo(-d.size, d.size);
          ctx.stroke();
          break;

        case "sine":
          // Sine wave
          ctx.beginPath();
          for (let i = -d.size; i <= d.size; i += 2) {
            const sy = Math.sin((i / d.size) * Math.PI * 2 + time * 2) * d.size * 0.4;
            if (i === -d.size) ctx.moveTo(i, sy);
            else ctx.lineTo(i, sy);
          }
          ctx.stroke();
          // Axis
          ctx.strokeStyle = `hsla(270, 70%, 65%, ${d.opacity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.stroke();
          break;

        case "graph":
          // Coordinate axes with curve
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.moveTo(0, -d.size);
          ctx.lineTo(0, d.size);
          ctx.stroke();
          // Parabola
          ctx.beginPath();
          for (let i = -d.size * 0.8; i <= d.size * 0.8; i += 2) {
            const norm = i / (d.size * 0.8);
            const py = -norm * norm * d.size * 0.7;
            if (i === -d.size * 0.8) ctx.moveTo(i, -py);
            else ctx.lineTo(i, -py);
          }
          ctx.stroke();
          break;

        case "spiral":
          // Fibonacci-like spiral
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 6; a += 0.1) {
            const r = (a / (Math.PI * 6)) * d.size;
            const sx = Math.cos(a) * r;
            const sy = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
          break;

        case "bell":
          // Bell curve / normal distribution
          ctx.beginPath();
          for (let i = -d.size; i <= d.size; i += 2) {
            const norm = i / (d.size * 0.4);
            const by = -Math.exp(-0.5 * norm * norm) * d.size * 0.8;
            if (i === -d.size) ctx.moveTo(i, -by);
            else ctx.lineTo(i, -by);
          }
          ctx.stroke();
          // Baseline
          ctx.strokeStyle = `hsla(270, 70%, 65%, ${d.opacity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.stroke();
          break;

        case "fractal":
          // Koch snowflake-like pattern
          const drawKochSide = (x1: number, y1: number, x2: number, y2: number, depth: number) => {
            if (depth === 0) {
              ctx.lineTo(x2, y2);
              return;
            }
            const dx = (x2 - x1) / 3;
            const dy = (y2 - y1) / 3;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const px = mx - dy * Math.sqrt(3) / 3;
            const py = my + dx * Math.sqrt(3) / 3;
            drawKochSide(x1, y1, x1 + dx, y1 + dy, depth - 1);
            drawKochSide(x1 + dx, y1 + dy, px, py, depth - 1);
            drawKochSide(px, py, x2 - dx, y2 - dy, depth - 1);
            drawKochSide(x2 - dx, y2 - dy, x2, y2, depth - 1);
          };
          ctx.beginPath();
          const kS = d.size * 0.8;
          ctx.moveTo(0, -kS);
          drawKochSide(0, -kS, kS * 0.866, kS * 0.5, 2);
          drawKochSide(kS * 0.866, kS * 0.5, -kS * 0.866, kS * 0.5, 2);
          drawKochSide(-kS * 0.866, kS * 0.5, 0, -kS, 2);
          ctx.stroke();
          break;

        case "polar":
          // Rose curve (rhodonea)
          ctx.beginPath();
          const petals = 5;
          for (let a = 0; a <= Math.PI * 2; a += 0.02) {
            const r = d.size * Math.cos(petals * a);
            const px2 = r * Math.cos(a);
            const py2 = r * Math.sin(a);
            if (a === 0) ctx.moveTo(px2, py2);
            else ctx.lineTo(px2, py2);
          }
          ctx.stroke();
          break;

        case "vector":
          // Vector field arrows
          const arrows = 3;
          const step = d.size * 2 / arrows;
          for (let r = 0; r < arrows; r++) {
            for (let c = 0; c < arrows; c++) {
              const ax = -d.size + c * step + step / 2;
              const ay = -d.size + r * step + step / 2;
              const angle = Math.atan2(ay, ax) + time;
              const len = step * 0.35;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              const ex = ax + Math.cos(angle) * len;
              const ey = ay + Math.sin(angle) * len;
              ctx.lineTo(ex, ey);
              // arrowhead
              ctx.lineTo(ex - Math.cos(angle - 0.5) * len * 0.3, ey - Math.sin(angle - 0.5) * len * 0.3);
              ctx.moveTo(ex, ey);
              ctx.lineTo(ex - Math.cos(angle + 0.5) * len * 0.3, ey - Math.sin(angle + 0.5) * len * 0.3);
              ctx.stroke();
            }
          }
          break;
      }

      ctx.restore();
    };

    const initParticles = () => {
      const count = Math.floor(canvas.offsetWidth / 18);
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.offsetHeight;
        particles.push(p);
      }
      // Add geometric diagrams
      const diagramCount = Math.floor(canvas.offsetWidth / 120);
      for (let i = 0; i < diagramCount; i++) {
        const d = createDiagram();
        d.y = Math.random() * canvas.offsetHeight;
        diagrams.push(d);
      }
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw symbols
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

      // Draw diagrams
      for (let i = diagrams.length - 1; i >= 0; i--) {
        const d = diagrams[i];
        d.y -= d.speed;
        d.rotation += d.rotSpeed;

        if (d.y < -80) {
          diagrams[i] = createDiagram();
          continue;
        }

        drawDiagram(d);
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
