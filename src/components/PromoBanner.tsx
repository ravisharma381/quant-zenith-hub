import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PromoBannerProps {
  onClose: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Set target date to January 4, 2026 at 11:59 PM GMT
  const targetDate = new Date("2026-01-04T23:59:00Z");
  
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60),
    };
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-primary to-emerald-500 text-white py-3 px-4 shadow-lg">
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] -skew-x-12" />
      
      <div className="container mx-auto flex items-center justify-center gap-4 md:gap-8 flex-wrap relative z-10">
        {/* Sale Badge */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
            <span className="relative bg-white text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              New Year
            </span>
          </div>
        </div>
        
        {/* Sale Text */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-black tracking-wide drop-shadow-md flex items-center gap-2 justify-center">
            <span className="hidden sm:inline">🎉</span>
            NEW YEAR'S SALE
            <span className="hidden sm:inline">🎉</span>
          </h2>
          <p className="text-sm md:text-base font-bold text-white/90">
            LIMITED TIME <span className="text-yellow-300 font-black">30% OFF</span>
          </p>
        </div>
        
        {/* Countdown */}
        <div className="flex gap-1 md:gap-2 text-center">
          {[
            { value: timeLeft.days, label: 'days' },
            { value: timeLeft.hours, label: 'hrs' },
            { value: timeLeft.mins, label: 'min' },
            { value: timeLeft.secs, label: 'sec' },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1.5 min-w-[40px] md:min-w-[50px] border border-white/10">
                <span className="text-lg md:text-2xl font-mono font-bold text-white tabular-nums">
                  {String(item.value).padStart(2, '0')}
                </span>
                <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wide">{item.label}</p>
              </div>
              {index < 3 && <span className="text-white/50 font-bold mx-0.5 md:mx-1">:</span>}
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={() => navigate('/premium')}
          className="bg-white hover:bg-white/90 text-primary font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white/50"
        >
          Get Premium →
        </Button>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
