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
    <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-black py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {/* New Year Badge */}
        <div className="hidden md:flex flex-col items-center">
          <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded -mt-0.5">YEAR</span>
        </div>
        
        {/* Sale Text */}
        <div className="text-center">
          <h2 className="text-lg md:text-xl font-extrabold tracking-wide">
            NEW YEAR'S SALE
          </h2>
          <p className="text-sm md:text-base font-bold">
            LIMITED TIME 30% OFF
          </p>
        </div>
        
        {/* Countdown */}
        <div className="flex gap-2 md:gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold">{timeLeft.days}</span>
            <span className="text-xs">days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs">hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold">{timeLeft.mins}</span>
            <span className="text-xs">mins</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold">{timeLeft.secs}</span>
            <span className="text-xs">secs</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={() => navigate('/premium')}
          className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded shadow-md"
        >
          Get Premium
        </Button>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
