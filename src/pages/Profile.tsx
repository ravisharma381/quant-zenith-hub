import React, { useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Flame, Trophy } from "lucide-react";

const TOPICS = [
  { name: "Combinatorics", solved: 34, total: 120 },
  { name: "Probability", solved: 58, total: 150 },
  { name: "Statistics", solved: 21, total: 90 },
  { name: "Derivatives", solved: 12, total: 80 },
  { name: "Brainteasers", solved: 45, total: 100 },
  { name: "Linear Algebra", solved: 9, total: 60 },
  { name: "Expected Value", solved: 27, total: 70 },
  { name: "Market Making", solved: 6, total: 40 },
];

const DIFFICULTIES = [
  { name: "Easy (Levels 1-3)", solved: 96, total: 360, color: "bg-green-500" },
  { name: "Medium (Levels 4-6)", solved: 87, total: 360, color: "bg-yellow-500" },
  { name: "Hard (Levels 7-10)", solved: 29, total: 480, color: "bg-red-500" },
];

const Bar = ({ value, total, color = "bg-primary" }: { value: number; total: number; color?: string }) => (
  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / total) * 100}%` }} />
  </div>
);

const Profile = () => {
  const days = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 364 - today.getDay());
    const arr: { date: Date; count: number }[] = [];
    for (let d = new Date(start), i = 0; d <= today; d.setDate(d.getDate() + 1), i++) {
      const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const count = r < 0.45 ? 0 : r < 0.7 ? 1 : r < 0.85 ? 2 : r < 0.95 ? 4 : 7;
      arr.push({ date: new Date(d), count });
    }
    return arr;
  }, []);

  const { currentStreak, longestStreak } = useMemo(() => {
    let longest = 0;
    let run = 0;
    for (const d of days) {
      if (d.count > 0) {
        run += 1;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    }
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current += 1;
      else if (i === days.length - 1) continue;
      else break;
    }
    return { currentStreak: current, longestStreak: longest };
  }, [days]);

  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const totalSubs = days.reduce((s, d) => s + d.count, 0);
  const shade = (c: number) =>
    c === 0 ? "bg-muted" : c === 1 ? "bg-primary/30" : c === 2 ? "bg-primary/55" : c <= 4 ? "bg-primary/80" : "bg-primary";

  const totalSolved = DIFFICULTIES.reduce((s, d) => s + d.solved, 0);
  const totalProblems = DIFFICULTIES.reduce((s, d) => s + d.total, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">A</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground">{totalSolved} / {totalProblems} problems solved</p>
        </div>
      </div>

      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-lg font-semibold text-foreground">Activity</h2>
          <span className="text-sm text-muted-foreground">{totalSubs} problems solved in the last year</span>
        </div>
        <TooltipProvider delayDuration={0}>
          <div className="overflow-x-auto">
            <div className="flex gap-[3px] w-max">
              {weeks.map((w, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {w.map((d) => (
                    <Tooltip key={d.date.toISOString()}>
                      <TooltipTrigger asChild>
                        <div className={`w-3 h-3 rounded-sm ${shade(d.count)}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        {d.count} solved on {d.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
        <div className="flex items-center justify-end gap-1 mt-3 text-xs text-muted-foreground">
          Less {[0, 1, 2, 4, 7].map((c) => <div key={c} className={`w-3 h-3 rounded-sm ${shade(c)}`} />)} More
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Difficulty</h2>
          {DIFFICULTIES.map((d) => (
            <div key={d.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{d.name}</span>
                <span className="text-muted-foreground">{d.solved}/{d.total}</span>
              </div>
              <Bar value={d.solved} total={d.total} color={d.color} />
            </div>
          ))}
        </section>

        <section className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Topics</h2>
          {TOPICS.map((t) => (
            <div key={t.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{t.name}</span>
                <span className="text-muted-foreground">{t.solved}/{t.total}</span>
              </div>
              <Bar value={t.solved} total={t.total} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Profile;
