import React from "react";

/**
 * Decorative hero background with playing cards and dice.
 * Elements are absolutely positioned within the hero and use
 * `bg-fixed`-like parallax via `fixed` positioning on inner wrappers
 * so they appear anchored as the page scrolls within the hero.
 */
const DiceCardsBackground: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft color washes */}
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Playing card — top left */}
      <Card
        className="absolute top-10 left-6 md:left-12 w-20 h-28 md:w-28 md:h-40 -rotate-[14deg]"
        suit="♠"
        rank="A"
        color="text-foreground"
      />

      {/* Playing card — middle left, lower */}
      <Card
        className="absolute bottom-8 left-24 md:left-44 w-16 h-24 md:w-24 md:h-36 rotate-[10deg] opacity-90"
        suit="♥"
        rank="K"
        color="text-red-500"
      />

      {/* Playing card — top right */}
      <Card
        className="absolute top-6 right-6 md:right-16 w-20 h-28 md:w-28 md:h-40 rotate-[12deg]"
        suit="♦"
        rank="Q"
        color="text-red-500"
      />

      {/* Playing card — bottom right */}
      <Card
        className="absolute bottom-6 right-24 md:right-40 w-16 h-24 md:w-24 md:h-36 -rotate-[8deg] opacity-90"
        suit="♣"
        rank="J"
        color="text-foreground"
      />

      {/* Dice — top middle-ish */}
      <Die className="absolute top-10 left-1/3 w-12 h-12 md:w-16 md:h-16 rotate-[15deg]" face={5} />
      {/* Dice — bottom center */}
      <Die className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 -rotate-[12deg]" face={3} />
      {/* Dice — right */}
      <Die className="absolute top-1/2 right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 rotate-[-20deg]" face={6} />
      {/* Dice — left lower */}
      <Die className="absolute bottom-20 left-4 md:left-8 w-10 h-10 md:w-12 md:h-12 rotate-[25deg]" face={2} />
    </div>
  );
};

interface CardProps {
  className?: string;
  suit: string;
  rank: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ className = "", suit, rank, color }) => (
  <div
    className={`rounded-xl bg-card/90 backdrop-blur-sm border border-border shadow-2xl flex flex-col justify-between p-2 md:p-3 ${color} ${className}`}
  >
    <div className="text-left leading-none">
      <div className="text-sm md:text-lg font-bold">{rank}</div>
      <div className="text-sm md:text-lg">{suit}</div>
    </div>
    <div className="text-center text-2xl md:text-4xl">{suit}</div>
    <div className="text-right leading-none rotate-180">
      <div className="text-sm md:text-lg font-bold">{rank}</div>
      <div className="text-sm md:text-lg">{suit}</div>
    </div>
  </div>
);

interface DieProps {
  className?: string;
  face: 1 | 2 | 3 | 4 | 5 | 6;
}

const pipPositions: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const Die: React.FC<DieProps> = ({ className = "", face }) => {
  const pips = pipPositions[face];
  return (
    <div
      className={`rounded-xl bg-background/95 border border-border shadow-2xl p-1.5 md:p-2 ${className}`}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const isPip = pips.some(([r, c]) => r === row && c === col);
          return (
            <div key={i} className="flex items-center justify-center">
              {isPip && (
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiceCardsBackground;
