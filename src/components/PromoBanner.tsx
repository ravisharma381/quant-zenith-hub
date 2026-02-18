import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PromoBannerProps {
  onClose: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ onClose }) => {
  const navigate = useNavigate();

  // Set target date to February 24, 2026 at 11:59 PM GMT
  const targetDate = new Date("2026-02-23T23:59:00Z");

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

  if (new Date().getTime() > targetDate.getTime()) {
    return null; // Don't render the banner if the target date has passed
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 md:gap-8 pr-8">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <h2 className="text-sm font-extrabold tracking-wide">LIMITED TIME 30% OFF</h2>
            <p className="text-[11px] text-white/80">Prices increase on Feb 24th</p>
            <div className="flex gap-2 text-center mt-1">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{timeLeft.days}</span>
                <span className="text-[10px]">days</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{timeLeft.hours}</span>
                <span className="text-[10px]">hours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{timeLeft.mins}</span>
                <span className="text-[10px]">mins</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">{timeLeft.secs}</span>
                <span className="text-[10px]">secs</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/premium')}
            className="bg-white hover:bg-white/90 text-purple-700 font-bold px-4 py-1.5 text-sm rounded shadow-md"
          >
            Get Premium
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-8">
          <div className="text-center">
            <h2 className="text-xl font-extrabold tracking-wide">LIMITED TIME 30% OFF</h2>
            <p className="text-sm text-white/80">Prices increase on Feb 24th</p>
          </div>

          <div className="flex gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{timeLeft.days}</span>
              <span className="text-xs">days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{timeLeft.hours}</span>
              <span className="text-xs">hours</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{timeLeft.mins}</span>
              <span className="text-xs">mins</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{timeLeft.secs}</span>
              <span className="text-xs">secs</span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/premium')}
            className="bg-white hover:bg-white/90 text-purple-700 font-bold px-6 py-2 rounded shadow-md"
          >
            Get Premium
          </Button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
