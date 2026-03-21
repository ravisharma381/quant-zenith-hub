import React, { useEffect, useRef } from "react";

const FallingNumbers = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const chars = "0123456789πΣ∫∂√±×÷∞∈∀∃∅∇∆λμσφψΩ".split("");

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
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
    const width = () => canvas.offsetWidth;
    const height = () => canvas.offsetHeight;

    const createDrop = (): Drop => ({
      x: Math.random() * width(),
      y: Math.random() * -200,
      speed: 0.3 + Math.random() * 0.8,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: 0.03 + Math.random() * 0.12,
      size: 10 + Math.random() * 16,
      fadeSpeed: 0.0002 + Math.random() * 0.0005,
    });

    // Initialize drops
    for (let i = 0; i < 60; i++) {
      const drop = createDrop();
      drop.y = Math.random() * height();
      drops.push(drop);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width(), height());

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        drop.y += drop.speed;
        drop.opacity -= drop.fadeSpeed;

        if (drop.y > height() || drop.opacity <= 0) {
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default FallingNumbers;
