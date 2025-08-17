import confetti from "canvas-confetti";

// Six types of confetti
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
  },
  purple: {
    colors: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']
  },
  orange: {
    colors: ['#f97316', '#ea580c', '#dc2626', '#b91c1c']
  },
  pink: {
    colors: ['#ec4899', '#db2777', '#be185d', '#9d174d']
  }
};

// Six types of fireworks
const fireworksTypes = {
  golden: {
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309']
  },
  silver: {
    colors: ['#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280']
  },
  red: {
    colors: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b']
  },
  blue: {
    colors: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af']
  },
  white: {
    colors: ['#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb']
  },
  rainbow: {
    // Default multicolored fireworks
    colors: undefined
  }
};

const fireConfettiRain = (selectedType: any) => {
  const columns = 20;
  for (let i = 0; i < columns; i++) {
    const x = (i + Math.random()) / columns;
    const angle = 270 + (Math.random() * 20 - 10);
    const spread = 10 + Math.random() * 10;
    const startVelocity = 20 + Math.random() * 20;
    const gravity = 1.0 + Math.random() * 0.4;
    const drift = (Math.random() - 0.5) * 1.2;
    const scalar = 0.9 + Math.random() * 0.5;
    
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

    if (selectedType.colors) {
      confettiOptions.colors = selectedType.colors;
    }

    confetti(confettiOptions);
  }
};

const fireFireworks = (selectedType: any) => {
  // Create multiple bursts from different positions
  const burstCount = 5 + Math.floor(Math.random() * 3); // 5-7 bursts
  
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      const x = 0.2 + Math.random() * 0.6; // Random position across screen
      const y = 0.3 + Math.random() * 0.4; // Random height
      
      confetti({
        particleCount: 80 + Math.floor(Math.random() * 40), // 80-120 particles per burst
        spread: 60 + Math.random() * 40, // 60-100 spread
        origin: { x, y },
        colors: selectedType.colors,
        startVelocity: 40 + Math.random() * 20, // 40-60 velocity
        gravity: 0.6 + Math.random() * 0.4, // 0.6-1.0 gravity
        scalar: 1.0 + Math.random() * 0.5, // 1.0-1.5 size
        ticks: 200 + Math.floor(Math.random() * 100) // 200-300 lifetime
      });
    }, i * 150); // Stagger bursts by 150ms
  }
};

export const fireRandomCelebration = () => {
  // 70% chance for confetti, 30% chance for fireworks
  const isFireworks = Math.random() < 0.3;
  
  if (isFireworks) {
    // Randomly select one of the six fireworks types
    const types = Object.keys(fireworksTypes) as Array<keyof typeof fireworksTypes>;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const selectedType = fireworksTypes[randomType];
    
    fireFireworks(selectedType);
  } else {
    // Randomly select one of the six confetti types
    const types = Object.keys(confettiTypes) as Array<keyof typeof confettiTypes>;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const selectedType = confettiTypes[randomType];
    
    // Fire the first confetti immediately
    fireConfettiRain(selectedType);
    
    // Fire the second confetti with the same type after a delay
    setTimeout(() => fireConfettiRain(selectedType), 200);
  }
};