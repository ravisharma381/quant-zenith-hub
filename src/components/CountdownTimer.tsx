import React, { useState, useEffect } from "react";

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
  
  // Track sub-second progress for smooth animation
  const [subProgress, setSubProgress] = useState(0);
  
  // Animate smooth progress within each second
  useEffect(() => {
    setSubProgress(0);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 1000, 1); // 0 to 1 over 1 second
      setSubProgress(progress);
      
      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(interval);
  }, [countdown]);
  
  // Calculate total progress: combines countdown position + sub-second animation
  // countdown=3, subProgress=0 → totalElapsed=0 (100% full)
  // countdown=3, subProgress=1 → totalElapsed=1 (66% full)
  // countdown=2, subProgress=1 → totalElapsed=2 (33% full)
  // countdown=1, subProgress=1 → totalElapsed=3 (0% empty)
  const totalElapsed = (totalDuration - countdown) + subProgress;
  const overallProgress = totalElapsed / totalDuration; // 0 to 1 over entire duration
  const strokeDashoffset = circumference * overallProgress;
  
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
