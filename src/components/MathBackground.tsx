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
      type: "triangle" | "circle" | "sine" | "graph" | "spiral" | "bell" | "ellipse" | "hyperbola" | "tangent" | "polar" | "derivative" | "integral" | "vector" | "matrix" | "limitsGraph" | "parametric";
      hue: number;
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

    const diagramTypes: Diagram["type"][] = ["triangle", "circle", "sine", "graph", "spiral", "bell", "ellipse", "hyperbola", "tangent", "polar", "derivative", "integral", "vector", "matrix", "limitsGraph", "parametric"];
    const diagramHues = [270, 200, 150, 340, 45, 180, 300, 120];

    const createDiagram = (): Diagram => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 60,
      type: diagramTypes[Math.floor(Math.random() * diagramTypes.length)],
      size: 30 + Math.random() * 40,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      hue: diagramHues[Math.floor(Math.random() * diagramHues.length)],
    });

    const drawDiagram = (d: Diagram) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.rotation);
      ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
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

        case "circle":
          // Concentric circles with radii
          ctx.beginPath();
          ctx.arc(0, 0, d.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, d.size * 0.6, 0, Math.PI * 2);
          ctx.stroke();
          // Cross lines
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.moveTo(0, -d.size);
          ctx.lineTo(0, d.size);
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
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.5})`;
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
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.stroke();
          break;

        case "ellipse":
          // Ellipse with foci
          ctx.beginPath();
          ctx.ellipse(0, 0, d.size, d.size * 0.6, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Foci dots
          const focalDist = Math.sqrt(d.size * d.size - (d.size * 0.6) * (d.size * 0.6));
          ctx.fillStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
          ctx.beginPath();
          ctx.arc(-focalDist, 0, 2, 0, Math.PI * 2);
          ctx.arc(focalDist, 0, 2, 0, Math.PI * 2);
          ctx.fill();
          // Axes
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.4})`;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.moveTo(0, -d.size * 0.6);
          ctx.lineTo(0, d.size * 0.6);
          ctx.stroke();
          ctx.setLineDash([]);
          break;

        case "hyperbola":
          // Hyperbola branches
          ctx.beginPath();
          for (let t = -1.2; t <= 1.2; t += 0.05) {
            const hx = d.size * 0.5 * Math.cosh(t);
            const hy = d.size * 0.4 * Math.sinh(t);
            if (t === -1.2) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.stroke();
          ctx.beginPath();
          for (let t = -1.2; t <= 1.2; t += 0.05) {
            const hx = -d.size * 0.5 * Math.cosh(t);
            const hy = d.size * 0.4 * Math.sinh(t);
            if (t === -1.2) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.stroke();
          // Asymptotes
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.3})`;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(-d.size, -d.size * 0.8);
          ctx.lineTo(d.size, d.size * 0.8);
          ctx.moveTo(-d.size, d.size * 0.8);
          ctx.lineTo(d.size, -d.size * 0.8);
          ctx.stroke();
          ctx.setLineDash([]);
          break;

        case "tangent":
          // Circle with tangent line
          const r = d.size * 0.6;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
          // Tangent point and line
          const tx = r * Math.cos(Math.PI / 4);
          const ty = -r * Math.sin(Math.PI / 4);
          ctx.fillStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Tangent line (perpendicular to radius)
          ctx.beginPath();
          ctx.moveTo(tx - d.size * 0.5 * Math.cos(Math.PI / 4 + Math.PI / 2), ty + d.size * 0.5 * Math.sin(Math.PI / 4 + Math.PI / 2));
          ctx.lineTo(tx + d.size * 0.5 * Math.cos(Math.PI / 4 + Math.PI / 2), ty - d.size * 0.5 * Math.sin(Math.PI / 4 + Math.PI / 2));
          ctx.stroke();
          // Radius line
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.4})`;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.setLineDash([]);
          break;

        case "polar":
          // Polar rose curve r = cos(3θ)
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.03) {
            const pr = d.size * Math.abs(Math.cos(3 * a));
            const px = pr * Math.cos(a);
            const py = pr * Math.sin(a);
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          break;

        case "derivative":
          // Function and its tangent line (calculus)
          ctx.beginPath();
          for (let i = -d.size; i <= d.size; i += 2) {
            const norm = i / d.size;
            const fy = -Math.sin(norm * Math.PI) * d.size * 0.5;
            if (i === -d.size) ctx.moveTo(i, fy);
            else ctx.lineTo(i, fy);
          }
          ctx.stroke();
          // Tangent at midpoint
          ctx.strokeStyle = `hsla(${(d.hue + 60) % 360}, 70%, 65%, ${d.opacity * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(-d.size * 0.6, d.size * 0.5 * Math.PI * 0.6);
          ctx.lineTo(d.size * 0.6, -d.size * 0.5 * Math.PI * 0.6);
          ctx.stroke();
          // Point marker
          ctx.fillStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "integral":
          // Area under curve (calculus)
          // Axes
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.moveTo(-d.size * 0.8, -d.size);
          ctx.lineTo(-d.size * 0.8, d.size * 0.3);
          ctx.stroke();
          // Curve
          ctx.beginPath();
          for (let i = -d.size * 0.7; i <= d.size * 0.7; i += 2) {
            const norm = i / (d.size * 0.7);
            const iy = -(1 - norm * norm) * d.size * 0.6;
            if (i === -d.size * 0.7) ctx.moveTo(i, iy);
            else ctx.lineTo(i, iy);
          }
          ctx.stroke();
          // Shaded area (vertical lines)
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.4})`;
          for (let i = -d.size * 0.4; i <= d.size * 0.4; i += 8) {
            const norm = i / (d.size * 0.7);
            const iy = -(1 - norm * norm) * d.size * 0.6;
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, iy);
            ctx.stroke();
          }
          break;

        case "vector":
          // Vector field / arrows
          for (let vx = -1; vx <= 1; vx++) {
            for (let vy = -1; vy <= 1; vy++) {
              const bx = vx * d.size * 0.4;
              const by = vy * d.size * 0.4;
              const angle = Math.atan2(-vx, vy) + time;
              const len = d.size * 0.15;
              ctx.beginPath();
              ctx.moveTo(bx, by);
              ctx.lineTo(bx + Math.cos(angle) * len, by + Math.sin(angle) * len);
              ctx.stroke();
              // Arrowhead
              ctx.beginPath();
              ctx.moveTo(bx + Math.cos(angle) * len, by + Math.sin(angle) * len);
              ctx.lineTo(bx + Math.cos(angle - 0.5) * len * 0.5, by + Math.sin(angle - 0.5) * len * 0.5);
              ctx.stroke();
            }
          }
          break;

        case "matrix":
          // Matrix brackets with dots
          const ms = d.size * 0.8;
          // Left bracket
          ctx.beginPath();
          ctx.moveTo(-ms * 0.5 + 5, -ms * 0.5);
          ctx.lineTo(-ms * 0.5, -ms * 0.5);
          ctx.lineTo(-ms * 0.5, ms * 0.5);
          ctx.lineTo(-ms * 0.5 + 5, ms * 0.5);
          ctx.stroke();
          // Right bracket
          ctx.beginPath();
          ctx.moveTo(ms * 0.5 - 5, -ms * 0.5);
          ctx.lineTo(ms * 0.5, -ms * 0.5);
          ctx.lineTo(ms * 0.5, ms * 0.5);
          ctx.lineTo(ms * 0.5 - 5, ms * 0.5);
          ctx.stroke();
          // Dots grid
          ctx.fillStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
          for (let mi = -1; mi <= 1; mi++) {
            for (let mj = -1; mj <= 1; mj++) {
              ctx.beginPath();
              ctx.arc(mi * ms * 0.25, mj * ms * 0.25, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;

        case "limitsGraph":
          // Function with asymptote (limits)
          ctx.beginPath();
          ctx.moveTo(-d.size, 0);
          ctx.lineTo(d.size, 0);
          ctx.moveTo(0, -d.size);
          ctx.lineTo(0, d.size);
          ctx.stroke();
          // Vertical asymptote
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity * 0.4})`;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(d.size * 0.4, -d.size);
          ctx.lineTo(d.size * 0.4, d.size);
          ctx.stroke();
          ctx.setLineDash([]);
          // 1/x-like curve
          ctx.strokeStyle = `hsla(${d.hue}, 70%, 65%, ${d.opacity})`;
          ctx.beginPath();
          for (let i = -d.size * 0.9; i < d.size * 0.35; i += 2) {
            const shifted = i - d.size * 0.4;
            if (Math.abs(shifted) < 5) continue;
            const ly = -d.size * 0.3 / (shifted / (d.size * 0.3));
            ctx.lineTo(i, Math.max(-d.size, Math.min(d.size, ly)));
          }
          ctx.stroke();
          ctx.beginPath();
          for (let i = d.size * 0.45; i <= d.size * 0.9; i += 2) {
            const shifted = i - d.size * 0.4;
            const ly = -d.size * 0.3 / (shifted / (d.size * 0.3));
            ctx.lineTo(i, Math.max(-d.size, Math.min(d.size, ly)));
          }
          ctx.stroke();
          break;

        case "parametric":
          // Lissajous curve
          ctx.beginPath();
          for (let t = 0; t <= Math.PI * 2; t += 0.05) {
            const lx = d.size * 0.8 * Math.sin(3 * t + time);
            const ly = d.size * 0.8 * Math.sin(2 * t);
            if (t === 0) ctx.moveTo(lx, ly);
            else ctx.lineTo(lx, ly);
          }
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    const initParticles = () => {
      // 25% symbols, 75% diagrams
      const totalCount = Math.floor(canvas.offsetWidth / 14);
      const symbolCount = Math.floor(totalCount * 0.25);
      const diagramCount = Math.floor(totalCount * 0.75);
      for (let i = 0; i < symbolCount; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.offsetHeight;
        particles.push(p);
      }
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
        const symbolHues = [270, 200, 150, 340, 45, 180];
        ctx.fillStyle = `hsla(${symbolHues[i % symbolHues.length]}, 70%, 65%, ${p.opacity})`;
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
