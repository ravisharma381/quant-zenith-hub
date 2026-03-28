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

    interface FloatingItem {
      x: number;
      y: number;
      type: "die" | "card" | "chip" | "knight" | "octahedron" | "cube";
      size: number;
      speed: number;
      opacity: number;
      drift: number;
      phase: number;
      rotation: number;
      rotSpeed: number;
      hue: number;
      variant: number; // sub-variant within type
    }

    const items: FloatingItem[] = [];
    const itemTypes: FloatingItem["type"][] = ["die", "card", "chip", "knight", "octahedron", "cube"];
    const hues = [0, 30, 120, 200, 270, 340, 45];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createItem = (): FloatingItem => {
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      return {
        x: Math.random() * canvas.offsetWidth,
        y: canvas.offsetHeight + 40,
        type,
        size: type === "card" ? 56 + Math.random() * 42 : (type === "octahedron" || type === "cube") ? 30 + Math.random() * 35 : type === "knight" ? 30 + Math.random() * 25 : 20 + Math.random() * 25,
        speed: 0.15 + Math.random() * 0.4,
        opacity: 0.12 + Math.random() * 0.18,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        hue: hues[Math.floor(Math.random() * hues.length)],
        variant: Math.floor(Math.random() * 52),
      };
    };

    const drawDiePips = (ctx: CanvasRenderingContext2D, s: number, val: number, hue: number, opacity: number) => {
      ctx.fillStyle = `hsla(${hue}, 70%, 75%, ${opacity})`;
      const r = s * 0.08;
      const positions: Record<number, [number, number][]> = {
        1: [[0, 0]],
        2: [[-0.25, -0.25], [0.25, 0.25]],
        3: [[-0.25, -0.25], [0, 0], [0.25, 0.25]],
        4: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]],
        5: [[-0.25, -0.25], [0.25, -0.25], [0, 0], [-0.25, 0.25], [0.25, 0.25]],
        6: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0], [0.25, 0], [-0.25, 0.25], [0.25, 0.25]],
      };
      (positions[val] || positions[1]).forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(px * s, py * s, r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawItem = (item: FloatingItem) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      const s = item.size;
      const h = item.hue;
      const o = item.opacity;

      switch (item.type) {
        case "die": {
          // Rounded rectangle die
          const half = s * 0.5;
          const radius = s * 0.12;
          ctx.strokeStyle = `hsla(${h}, 60%, 70%, ${o})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-half + radius, -half);
          ctx.lineTo(half - radius, -half);
          ctx.quadraticCurveTo(half, -half, half, -half + radius);
          ctx.lineTo(half, half - radius);
          ctx.quadraticCurveTo(half, half, half - radius, half);
          ctx.lineTo(-half + radius, half);
          ctx.quadraticCurveTo(-half, half, -half, half - radius);
          ctx.lineTo(-half, -half + radius);
          ctx.quadraticCurveTo(-half, -half, -half + radius, -half);
          ctx.closePath();
          ctx.stroke();
          drawDiePips(ctx, s, (item.variant % 6) + 1, h, o);
          break;
        }

        case "card": {
          const cw = s * 0.7;
          const ch = s;
          ctx.strokeStyle = `hsla(${h}, 60%, 70%, ${o})`;
          ctx.lineWidth = 1.5;
          const cr = s * 0.08;
          ctx.beginPath();
          ctx.moveTo(-cw / 2 + cr, -ch / 2);
          ctx.lineTo(cw / 2 - cr, -ch / 2);
          ctx.quadraticCurveTo(cw / 2, -ch / 2, cw / 2, -ch / 2 + cr);
          ctx.lineTo(cw / 2, ch / 2 - cr);
          ctx.quadraticCurveTo(cw / 2, ch / 2, cw / 2 - cr, ch / 2);
          ctx.lineTo(-cw / 2 + cr, ch / 2);
          ctx.quadraticCurveTo(-cw / 2, ch / 2, -cw / 2, ch / 2 - cr);
          ctx.lineTo(-cw / 2, -ch / 2 + cr);
          ctx.quadraticCurveTo(-cw / 2, -ch / 2, -cw / 2 + cr, -ch / 2);
          ctx.closePath();
          ctx.stroke();
          // Card rank and suit
          const suits = ["♠", "♥", "♦", "♣"];
          const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
          const suit = suits[item.variant % 4];
          const rank = ranks[Math.floor(item.variant / 4) % 13];
          const isRed = item.variant % 4 === 1 || item.variant % 4 === 2;
          const cardHue = isRed ? 0 : 220;
          ctx.fillStyle = `hsla(${cardHue}, 70%, 70%, ${o})`;
          // Center suit
          ctx.font = `${s * 0.35}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(suit, 0, s * 0.08);
          // Top-left rank
          ctx.font = `bold ${s * 0.2}px sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(rank, -cw / 2 + s * 0.06, -ch / 2 + s * 0.06);
          // Bottom-right rank (inverted)
          ctx.save();
          ctx.translate(cw / 2 - s * 0.06, ch / 2 - s * 0.06);
          ctx.rotate(Math.PI);
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(rank, 0, 0);
          ctx.restore();
          break;
        }

        case "chip": {
          // Poker chip with notches
          ctx.strokeStyle = `hsla(${h}, 60%, 70%, ${o})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
          ctx.stroke();
          // Inner circle
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
          ctx.stroke();
          // Edge notches
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * s * 0.42, Math.sin(angle) * s * 0.42);
            ctx.lineTo(Math.cos(angle) * s * 0.5, Math.sin(angle) * s * 0.5);
            ctx.stroke();
          }
          // Center value
          ctx.fillStyle = `hsla(${h}, 70%, 70%, ${o})`;
          ctx.font = `bold ${s * 0.22}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const vals = ["5", "10", "25", "50", "100", "$"];
          ctx.fillText(vals[item.variant % vals.length], 0, 0);
          break;
        }

      }

      ctx.restore();
    };

    const initItems = () => {
      const count = Math.floor(canvas.offsetWidth / 50);
      for (let i = 0; i < count; i++) {
        const item = createItem();
        item.y = Math.random() * canvas.offsetHeight;
        items.push(item);
      }
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y -= item.speed;
        item.x += Math.sin(time + item.phase) * item.drift;
        item.rotation += item.rotSpeed;

        if (item.y < -60) {
          items[i] = createItem();
          continue;
        }

        drawItem(item);
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initItems();
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
