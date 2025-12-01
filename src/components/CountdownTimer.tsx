import React from "react";

interface CountdownTimerProps {
  countdown: number;
  totalDuration: number;
  color: string;
  title?: string;
  subtitle?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ countdown, totalDuration, color, title, subtitle }) => {
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate elapsed time and progress
  // When countdown=3, elapsed=0 (start), when countdown=0, elapsed=3 (end)
  const elapsed = totalDuration - countdown;
  const progress = elapsed / totalDuration; // 0 to 1
  const strokeDashoffset = circumference * progress; // Start at 0 (full ring), end at circumference (empty ring)
  
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
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Countdown number in center */}
          <div 
            className="absolute text-8xl font-bold"
            style={{ color }}
          >
            {countdown}
          </div>
        </div>
        
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
};

export default CountdownTimer;
