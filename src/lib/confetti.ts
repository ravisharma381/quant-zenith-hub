import confetti from "canvas-confetti";

// Three types of confetti
const confettiTypes = {
  green: {
    colors: ['#10b981', '#059669', '#047857', '#065f46']
  },
  lightBlue: {
    colors: ['#0ea5e9', '#0284c7', '#0369a1', '#075985']
  },
  multicolored: {
    // Default multicolored confetti (no colors specified)
    colors: undefined
  }
};

export const fireRandomConfetti = () => {
  // Randomly select one of the three types
  const types = Object.keys(confettiTypes) as Array<keyof typeof confettiTypes>;
  const randomType = types[Math.floor(Math.random() * types.length)];
  const selectedType = confettiTypes[randomType];

  const columns = 20;
  for (let i = 0; i < columns; i++) {
    const x = (i + Math.random()) / columns; // across the top with slight jitter
    const angle = 270 + (Math.random() * 20 - 10); // mostly downward, slight variance
    const spread = 10 + Math.random() * 10; // small spread
    const startVelocity = 20 + Math.random() * 20; // 20-40
    const gravity = 1.0 + Math.random() * 0.4; // 1.0-1.4
    const drift = (Math.random() - 0.5) * 1.2; // slight left/right drift
    const scalar = 0.9 + Math.random() * 0.5; // varied size
    
    const confettiOptions: any = {
      particleCount: 7 + Math.floor(Math.random() * 6),
      origin: { x, y: 0 },
      angle,
      spread,
      startVelocity,
      gravity,
      drift,
      scalar,
    };

    // Add colors only if specified (for green and light blue)
    if (selectedType.colors) {
      confettiOptions.colors = selectedType.colors;
    }

    confetti(confettiOptions);
  }
};