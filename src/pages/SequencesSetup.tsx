import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Timer, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";

const SequencesSetup = () => {
  const navigate = useNavigate();
  const theme = getGameTheme(2);

  // SEO
  useEffect(() => {
    document.title = "Sequences Pro Setup – Quant Interview Games";
    const desc = "Configure Sequences Pro: choose difficulty and duration.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedDuration, setSelectedDuration] = useState<60 | 120 | 180>(180);

  // Helpers to apply alpha on theme primary HSL string
  const withAlpha = (hsl: string, a: number) => hsl.replace(')', ` / ${a})`);

  return (
    <div className="min-h-screen bg-background flex justify-center pt-12 pb-12">
      <div className="w-full max-w-2xl bg-card rounded-2xl px-8 pt-8 pb-4 border" style={{ borderColor: theme.primary }}>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Sequences Pro</h1>
          <p className="text-muted-foreground mt-2">Configure your challenge, then race the clock to find the next term in each sequence.</p>
        </header>

        <main className="space-y-6">
          <section>
            <h2 className="text-sm text-muted-foreground mb-2 text-center">Choose Difficulty</h2>
            <div className="flex gap-3 justify-center">
              {(['Easy','Medium','Hard'] as const).map((d) => (
                <Button
                  key={d}
                  variant="outline"
                  onClick={() => setSelectedDifficulty(d)}
                  className="flex-1"
                  style={selectedDifficulty === d ? { backgroundColor: d === 'Easy' ? 'hsl(var(--primary) / 0.2)' : d === 'Medium' ? 'hsl(var(--warning) / 0.2)' : 'hsl(var(--destructive) / 0.2)', color: d === 'Easy' ? 'hsl(var(--primary))' : d === 'Medium' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))', borderColor: d === 'Easy' ? 'hsl(var(--primary) / 0.3)' : d === 'Medium' ? 'hsl(var(--warning) / 0.3)' : 'hsl(var(--destructive) / 0.3)' } : {}}
                >
                  {d}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm text-muted-foreground mb-2 text-center">Choose Duration</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {[60, 120, 180].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => setSelectedDuration(s as 60 | 120 | 180)}
                  className="flex-1 text-xs md:text-sm px-2 md:px-4"
                  style={selectedDuration === s ? { 
                    backgroundColor: 'hsl(270, 95%, 60%, 0.15)', 
                    color: 'hsl(270, 95%, 60%)', 
                    borderColor: 'hsl(270, 95%, 60%, 0.3)',
                    boxShadow: '0 0 0 1px hsl(270, 95%, 60%, 0.3)'
                  } : {}}
                >
                  {s === 60 ? (<><Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Bullet - </span>1 min</>) : s === 120 ? (<><Timer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Blitz - </span>2 min</>) : (<><Rocket className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Rapid - </span>3 min</>)}
                </Button>
              ))}
            </div>
          </section>


          <div className="flex justify-center gap-3 pt-1">
            <Button variant="outline" onClick={() => navigate('/games')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
            <Button
              onClick={() => navigate(`/games/sequences-pro?duration=${selectedDuration}`)}
              className={`px-8 ${theme.buttonStyles}`}
            >
              Start Now
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SequencesSetup;
