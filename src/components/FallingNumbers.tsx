import React, { useEffect, useRef } from "react";

const FallingNumbers = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const chars = "0123456789πΣ∫∂√±×÷∞∈∀∃∅∇∆λμσφψΩ".split("");

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    interface Drop {
      x: number;
      y: number;
      speed: number;
      char: string;
      opacity: number;
      size: number;
      fadeSpeed: number;
    }

    const drops: Drop[] = [];
    const w = () => parent.getBoundingClientRect().width;
    const h = () => parent.getBoundingClientRect().height;

    const createDrop = (): Drop => ({
      x: Math.random() * w(),
      y: Math.random() * -200,
      speed: 0.3 + Math.random() * 0.8,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: 0.04 + Math.random() * 0.14,
      size: 12 + Math.random() * 18,
      fadeSpeed: 0.0002 + Math.random() * 0.0005,
    });

    for (let i = 0; i < 70; i++) {
      const drop = createDrop();
      drop.y = Math.random() * h();
      drops.push(drop);
    }

    const animate = () => {
      const width = w();
      const height = h();
      ctx.clearRect(0, 0, width, height);

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        drop.y += drop.speed;
        drop.opacity -= drop.fadeSpeed;

        if (drop.y > height || drop.opacity <= 0) {
          drops[i] = createDrop();
          continue;
        }

        ctx.font = `300 ${drop.size}px ui-monospace, SFMono-Regular, monospace`;
        ctx.fillStyle = `hsla(270, 70%, 60%, ${drop.opacity})`;
        ctx.fillText(drop.char, drop.x, drop.y);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

export default FallingNumbers;
