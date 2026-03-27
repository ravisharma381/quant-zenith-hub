import React from "react";

const AnimatedGridBackground = () => {
  // Generate grid squares with varied properties
  const squares = Array.from({ length: 60 }, (_, i) => {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const size = 40 + (i % 3) * 20; // 40, 60, 80px
    const delay = (i * 0.3) % 8;
    const duration = 6 + (i % 4) * 2; // 6-12s
    const animClass = i % 3 === 0 ? "animate-grid-float-1" : i % 3 === 1 ? "animate-grid-float-2" : "animate-grid-float-3";

    return (
      <div
        key={i}
        className={`absolute rounded-md border border-white/[0.04] bg-gradient-to-br from-purple-500/[0.06] to-blue-500/[0.04] ${animClass} hover:bg-purple-500/[0.12] hover:scale-110 transition-colors duration-500`}
        style={{
          width: size,
          height: size,
          left: `${col * 10 + 1}%`,
          top: `${row * 16 + 2}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="pointer-events-auto">{squares}</div>
    </div>
  );
};

export default AnimatedGridBackground;
