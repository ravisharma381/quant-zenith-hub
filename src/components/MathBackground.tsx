import React, { useMemo } from "react";

const ITEM_COUNT = 18;

type ItemType = "die" | "card" | "chip" | "knight" | "octahedron" | "cube" | "parabola" | "ellipse" | "venn" | "bellcurve" | "histogram";

const itemTypes: ItemType[] = ["die", "card", "chip", "knight", "octahedron", "cube", "parabola", "ellipse", "venn", "bellcurve", "histogram"];
const hues = [0, 30, 120, 200, 270, 340, 45];
const suits = ["♠", "♥", "♦", "♣"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

interface FloatingItem {
  type: ItemType;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  hue: number;
  drift: number;
  variant: number;
  rotSpeed: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateItems(): FloatingItem[] {
  const rand = seededRandom(42);
  const items: FloatingItem[] = [];
  for (let i = 0; i < ITEM_COUNT; i++) {
    const type = itemTypes[Math.floor(rand() * itemTypes.length)];
    items.push({
      type,
      x: rand() * 100,
      y: rand() * 100,
      size: type === "card" ? 80 + rand() * 40 : type === "knight" ? 55 + rand() * 25 : 45 + rand() * 30,
      duration: 25 + rand() * 35,
      delay: -(rand() * 40),
      opacity: 0.12 + rand() * 0.16,
      hue: hues[Math.floor(rand() * hues.length)],
      drift: 15 + rand() * 30,
      variant: Math.floor(rand() * 52),
      rotSpeed: 20 + rand() * 40,
    });
  }
  return items;
}

const DieSVG = ({ hue, opacity, variant }: { hue: number; opacity: number; variant: number }) => {
  const val = (variant % 6) + 1;
  const color = `hsla(${hue}, 60%, 70%, ${opacity})`;
  const pipColor = `hsla(${hue}, 70%, 75%, ${opacity})`;
  const positions: Record<number, [number, number][]> = {
    1: [[25, 25]],
    2: [[15, 15], [35, 35]],
    3: [[15, 15], [25, 25], [35, 35]],
    4: [[15, 15], [35, 15], [15, 35], [35, 35]],
    5: [[15, 15], [35, 15], [25, 25], [15, 35], [35, 35]],
    6: [[15, 15], [35, 15], [15, 25], [35, 25], [15, 35], [35, 35]],
  };
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <rect x="2" y="2" width="46" height="46" rx="6" fill="none" stroke={color} strokeWidth="1.2" />
      {positions[val].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={pipColor} />
      ))}
    </svg>
  );
};

const CardSVG = ({ hue, opacity, variant }: { hue: number; opacity: number; variant: number }) => {
  const suit = suits[variant % 4];
  const rank = ranks[Math.floor(variant / 4) % 13];
  const isRed = variant % 4 === 1 || variant % 4 === 2;
  const cardHue = isRed ? 0 : 220;
  const borderColor = `hsla(${hue}, 60%, 70%, ${opacity})`;
  const textColor = `hsla(${cardHue}, 70%, 70%, ${opacity})`;
  return (
    <svg viewBox="0 0 35 50" width="100%" height="100%">
      <rect x="1" y="1" width="33" height="48" rx="3" fill="none" stroke={borderColor} strokeWidth="1.2" />
      <text x="5" y="12" fill={textColor} fontSize="8" fontWeight="bold" fontFamily="sans-serif">{rank}</text>
      <text x="17.5" y="32" fill={textColor} fontSize="16" textAnchor="middle" fontFamily="serif">{suit}</text>
      <text x="30" y="45" fill={textColor} fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="end" transform="rotate(180 30 41)">{rank}</text>
    </svg>
  );
};

const ChipSVG = ({ hue, opacity, variant }: { hue: number; opacity: number; variant: number }) => {
  const color = `hsla(${hue}, 60%, 70%, ${opacity})`;
  const textColor = `hsla(${hue}, 70%, 70%, ${opacity})`;
  const vals = ["5", "10", "25", "50", "100", "$"];
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <circle cx="25" cy="25" r="23" fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx="25" cy="25" r="16" fill="none" stroke={color} strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={25 + Math.cos(a) * 18} y1={25 + Math.sin(a) * 18} x2={25 + Math.cos(a) * 23} y2={25 + Math.sin(a) * 23} stroke={color} strokeWidth="1" />;
      })}
      <text x="25" y="29" fill={textColor} fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">{vals[variant % vals.length]}</text>
    </svg>
  );
};

const KnightSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const stroke = `hsla(${hue}, 50%, 70%, ${opacity})`;
  const fill = `hsla(${hue}, 50%, 70%, ${opacity * 0.3})`;
  return (
    <svg viewBox="0 0 40 50" width="100%" height="100%">
      <rect x="8" y="40" width="24" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <path d="M12 40 L10 22 Q8 14 14 8 L16 2 L21 10 Q28 9 32 16 L34 20 Q30 22 26 20 Q24 28 28 36 L28 40 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
      <circle cx="23" cy="14" r="1.5" fill={stroke} />
    </svg>
  );
};

const OctahedronSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const color = `hsla(${hue}, 60%, 70%, ${opacity})`;
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <polygon points="25,3 45,25 25,47 5,25" fill="none" stroke={color} strokeWidth="1.2" />
      <line x1="5" y1="25" x2="45" y2="25" stroke={color} strokeWidth="1" />
      <line x1="25" y1="3" x2="25" y2="47" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
      {[[25,3],[45,25],[25,47],[5,25]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill={color} />
      ))}
    </svg>
  );
};

const CubeSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const color = `hsla(${hue}, 60%, 70%, ${opacity})`;
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <polygon points="10,15 30,10 45,18 25,23" fill="none" stroke={color} strokeWidth="1.2" />
      <polygon points="10,15 25,23 25,43 10,35" fill="none" stroke={color} strokeWidth="1.2" />
      <polygon points="25,23 45,18 45,38 25,43" fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
};

const ParabolaSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const axisColor = `hsla(${hue}, 60%, 70%, ${opacity * 0.5})`;
  const curveColor = `hsla(${hue}, 70%, 70%, ${opacity})`;
  const dotColor = `hsla(${hue}, 70%, 75%, ${opacity})`;
  let d = "";
  for (let i = -20; i <= 20; i++) {
    const x = 25 + i;
    const y = 40 - (i * i) / 12;
    d += (i === -20 ? "M" : "L") + `${x},${y} `;
  }
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <line x1="2" y1="40" x2="48" y2="40" stroke={axisColor} strokeWidth="0.8" />
      <line x1="25" y1="2" x2="25" y2="48" stroke={axisColor} strokeWidth="0.8" />
      <path d={d} fill="none" stroke={curveColor} strokeWidth="1.3" />
      <circle cx="25" cy="35" r="2" fill={dotColor} />
    </svg>
  );
};

const EllipseSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const color = `hsla(${hue}, 70%, 70%, ${opacity})`;
  const axisColor = `hsla(${hue}, 60%, 70%, ${opacity * 0.4})`;
  const dotColor = `hsla(${hue}, 70%, 75%, ${opacity})`;
  return (
    <svg viewBox="0 0 50 30" width="100%" height="100%">
      <ellipse cx="25" cy="15" rx="22" ry="12" fill="none" stroke={color} strokeWidth="1.3" />
      <line x1="3" y1="15" x2="47" y2="15" stroke={axisColor} strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="25" y1="3" x2="25" y2="27" stroke={axisColor} strokeWidth="0.8" strokeDasharray="2 2" />
      <circle cx="12" cy="15" r="2" fill={dotColor} />
      <circle cx="38" cy="15" r="2" fill={dotColor} />
    </svg>
  );
};

const VennSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const c1 = `hsla(${hue}, 60%, 70%, ${opacity})`;
  const c2 = `hsla(${(hue + 120) % 360}, 60%, 70%, ${opacity})`;
  const tc1 = `hsla(${hue}, 60%, 70%, ${opacity * 0.7})`;
  const tc2 = `hsla(${(hue + 120) % 360}, 60%, 70%, ${opacity * 0.7})`;
  const ti = `hsla(${(hue + 60) % 360}, 60%, 70%, ${opacity * 0.5})`;
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%">
      <circle cx="22" cy="20" r="16" fill="none" stroke={c1} strokeWidth="1.3" />
      <circle cx="38" cy="20" r="16" fill="none" stroke={c2} strokeWidth="1.3" />
      <text x="12" y="22" fill={tc1} fontSize="7" textAnchor="middle" fontFamily="sans-serif">A</text>
      <text x="48" y="22" fill={tc2} fontSize="7" textAnchor="middle" fontFamily="sans-serif">B</text>
      <text x="30" y="22" fill={ti} fontSize="7" textAnchor="middle" fontFamily="sans-serif">∩</text>
    </svg>
  );
};

const BellCurveSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const axisColor = `hsla(${hue}, 60%, 70%, ${opacity * 0.5})`;
  const curveColor = `hsla(${hue}, 70%, 70%, ${opacity})`;
  const textColor = `hsla(${hue}, 70%, 75%, ${opacity * 0.7})`;
  let d = "";
  for (let i = -25; i <= 25; i++) {
    const x = 25 + i;
    const norm = i / 9;
    const y = 38 - Math.exp(-0.5 * norm * norm) * 30;
    d += (i === -25 ? "M" : "L") + `${x},${y} `;
  }
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      <line x1="2" y1="38" x2="48" y2="38" stroke={axisColor} strokeWidth="0.8" />
      <line x1="25" y1="38" x2="25" y2="4" stroke={axisColor} strokeWidth="0.8" />
      <path d={d} fill="none" stroke={curveColor} strokeWidth="1.5" />
      <line x1="25" y1="38" x2="25" y2="8" stroke={axisColor} strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="27" y="46" fill={textColor} fontSize="7" fontStyle="italic" fontFamily="serif">μ</text>
    </svg>
  );
};

const HistogramSVG = ({ hue, opacity }: { hue: number; opacity: number }) => {
  const color = `hsla(${hue}, 60%, 70%, ${opacity})`;
  const fillColor = `hsla(${hue}, 60%, 70%, ${opacity * 0.3})`;
  const heights = [0.3, 0.5, 0.85, 1, 0.7, 0.45, 0.2];
  const barW = 6;
  const startX = 4;
  return (
    <svg viewBox="0 0 50 50" width="100%" height="100%">
      {heights.map((h, i) => {
        const bh = h * 35;
        return <rect key={i} x={startX + i * barW} y={42 - bh} width={barW - 1} height={bh} fill={fillColor} stroke={color} strokeWidth="0.8" />;
      })}
      <line x1={startX - 1} y1="42" x2={startX + heights.length * barW + 1} y2="42" stroke={color} strokeWidth="0.8" />
      <line x1={startX - 1} y1="42" x2={startX - 1} y2="3" stroke={color} strokeWidth="0.8" />
    </svg>
  );
};

const renderSVG = (item: FloatingItem) => {
  const { type, hue, opacity, variant } = item;
  switch (type) {
    case "die": return <DieSVG hue={hue} opacity={opacity} variant={variant} />;
    case "card": return <CardSVG hue={hue} opacity={opacity} variant={variant} />;
    case "chip": return <ChipSVG hue={hue} opacity={opacity} variant={variant} />;
    case "knight": return <KnightSVG hue={hue} opacity={opacity} />;
    case "octahedron": return <OctahedronSVG hue={hue} opacity={opacity} />;
    case "cube": return <CubeSVG hue={hue} opacity={opacity} />;
    case "parabola": return <ParabolaSVG hue={hue} opacity={opacity} />;
    case "ellipse": return <EllipseSVG hue={hue} opacity={opacity} />;
    case "venn": return <VennSVG hue={hue} opacity={opacity} />;
    case "bellcurve": return <BellCurveSVG hue={hue} opacity={opacity} />;
    case "histogram": return <HistogramSVG hue={hue} opacity={opacity} />;
    default: return null;
  }
};

const MathBackground = () => {
  const items = useMemo(() => generateItems(), []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${item.x}%`,
            width: `${item.size}px`,
            height: item.type === "card" ? `${item.size * 1.43}px` : `${item.size}px`,
            animation: `mathFloat ${item.duration}s linear ${item.delay}s infinite, mathDrift ${item.duration * 0.7}s ease-in-out ${item.delay}s infinite alternate, mathSpin ${item.rotSpeed}s linear ${item.delay}s infinite`,
            willChange: "transform",
          }}
        >
          {renderSVG(item)}
        </div>
      ))}
    </div>
  );
};

export default MathBackground;
