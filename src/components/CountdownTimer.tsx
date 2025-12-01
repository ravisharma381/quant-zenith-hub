import React from "react";

interface CountdownTimerProps {
  countdown: number;
  color: string;
  title?: string;
  subtitle?: string;
  totalDuration?: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown, color, title, subtitle, totalDuration = 3 }) => {
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const animationDuration = totalDuration * 1000; // Convert to milliseconds
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center -mt-20">
      <div className="text-center">
        {title && <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>}
        
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* SVG Circle Progress */}
          <svg 
            width={radius * 2 + strokeWidth * 2} 
            height={radius * 2 + strokeWidth * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/20"
            />
            {/* Animated progress circle */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={0}
              style={{
                animation: countdown > 0 ? `countdown-shrink ${animationDuration}ms linear` : 'none'
              }}
            />
          </svg>
          
          {/* Countdown number in center */}
          <div 
            className="absolute text-8xl font-bold"
            style={{ color }}
          >
            {countdown || "GO!"}
          </div>
        </div>
        
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        
        <style>{`
          @keyframes countdown-shrink {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: ${circumference};
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CountdownTimer;
