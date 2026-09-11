import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isSoftPremium } from "@/lib/premiumSoftCache";

const PROMO_CYCLE = {
  isManual: false,
  introducedAt: Date.parse("2026-08-27T03:22:05.647Z"),
  endsAt: Date.parse("2026-08-27T23:59:00Z"),
};
const STORAGE_KEY = "promoBannerDismiss";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const GAP_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type PromoCycle = {
  introducedAt: number;
  endsAt: number;
  active: boolean;
};

const utcDayEnd = (ts: number) => {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 0, 0);
};

const getPromoCycle = (now = Date.now()): PromoCycle => {
  if (PROMO_CYCLE.isManual) {
    return {
      introducedAt: PROMO_CYCLE.introducedAt,
      endsAt: PROMO_CYCLE.endsAt,
      active: now <= PROMO_CYCLE.endsAt,
    };
  }

  const todayEnd = utcDayEnd(now);
  if (now <= todayEnd) {
    const d = new Date(now);
    const introducedAt = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 14, 0, 0);
    return { introducedAt, endsAt: todayEnd, active: now >= introducedAt };
  }

  return {
    introducedAt: todayEnd + GAP_MS,
    endsAt: todayEnd + DAY_MS,
    active: false,
  };
};

const priceIncreaseCopy = (endsAt: number) => {
  const d = new Date(endsAt);
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const day = d.getUTCDate();
  const j = day % 10;
  const k = day % 100;
  const suffix = j === 1 && k !== 11 ? "st" : j === 2 && k !== 12 ? "nd" : j === 3 && k !== 13 ? "rd" : "th";
  return `Prices increase after ${month} ${day}${suffix}`;
};

const readHideUntil = (): number => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return typeof parsed?.hideUntil === "number" ? parsed.hideUntil : 0;
  } catch {
    return 0;
  }
};

const writeHideUntil = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ hideUntil: Date.now() + COOLDOWN_MS })
  );
};

const shouldShowPromo = (isPremium: boolean, cycle: PromoCycle): boolean => {
  if (isPremium || isSoftPremium()) return false;
  if (!cycle.active || Date.now() > cycle.endsAt) return false;
  const hideUntil = readHideUntil();
  if (cycle.introducedAt < hideUntil) return false;
  return true;
};

const calculateTimeLeft = (endsAt: number) => {
  const difference = endsAt - Date.now();

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

const PromoBanner: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [cycle, setCycle] = useState(getPromoCycle);
  const [visible, setVisible] = useState(() => shouldShowPromo(false, getPromoCycle()));
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(getPromoCycle().endsAt));

  useEffect(() => {
    const tick = () => {
      const nextCycle = getPromoCycle();
      setCycle(nextCycle);
      setTimeLeft(calculateTimeLeft(nextCycle.endsAt));
      setVisible(shouldShowPromo(!!userProfile?.isPremium, nextCycle));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [userProfile?.isPremium]);

  const handleClose = () => {
    writeHideUntil();
    setVisible(false);
  };

  if (!visible || !cycle.active || Date.now() > cycle.endsAt) {
    return null;
  }

  const copy = priceIncreaseCopy(cycle.endsAt);

  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 md:gap-8 pr-8">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <h2 className="text-sm font-extrabold tracking-wide">LIMITED TIME 30% OFF</h2>
            <p className="text-[11px] text-white/80">{copy}</p>
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
            <p className="text-sm text-white/80">{copy}</p>
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
          onClick={handleClose}
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
