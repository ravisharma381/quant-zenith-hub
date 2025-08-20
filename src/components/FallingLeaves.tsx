import React, { useEffect, useState } from 'react';

interface Leaf {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
}

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const createLeaf = () => {
      const newLeaf: Leaf = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100, // Random horizontal position (0-100%)
        delay: 0,
        duration: 8 + Math.random() * 4, // 8-12 seconds fall duration
        rotation: Math.random() * 360, // Random initial rotation
        size: 0.8 + Math.random() * 0.4, // Random size between 0.8-1.2
      };

      setLeaves(prev => [...prev, newLeaf]);

      // Remove leaf after animation completes
      setTimeout(() => {
        setLeaves(prev => prev.filter(leaf => leaf.id !== newLeaf.id));
      }, (newLeaf.duration + 2) * 1000);
    };

    // Create initial leaf
    createLeaf();

    // Create new leaves every 5-7 seconds
    const interval = setInterval(() => {
      // Only create 1-2 leaves at a time
      const numLeaves = Math.random() > 0.5 ? 1 : 2;
      for (let i = 0; i < numLeaves; i++) {
        setTimeout(createLeaf, i * 1000); // Slight delay between multiple leaves
      }
    }, 5000 + Math.random() * 2000); // 5-7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute animate-fall-leaf"
          style={{
            left: `${leaf.x}%`,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
            transform: `scale(${leaf.size}) rotate(${leaf.rotation}deg)`,
          }}
        >
          {/* Japanese Maple Leaf SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="drop-shadow-sm"
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            }}
          >
            <path
              d="M12 2c-1 2-3 3-5 3-1 0-2-1-2-2 0 3 1 5 3 7-2 1-4 2-4 4 0-1 1-2 2-2 2 0 4 1 6 3 2-2 4-3 6-3 1 0 2 1 2 2 0-2-2-3-4-4 2-2 3-4 3-7 0 1-1 2-2 2-2 0-4-1-5-3z"
              fill="url(#leafGradient)"
              className="animate-gentle-sway"
            />
            <defs>
              <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" />
                <stop offset="30%" stopColor="#f7931e" />
                <stop offset="70%" stopColor="#ff4500" />
                <stop offset="100%" stopColor="#cc2900" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;