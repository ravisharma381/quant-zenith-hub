import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type GameItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  route?: string;
  comingSoon?: boolean;
};

const categories = [
  { id: "arithmetic", label: "Arithmetic", icon: "➗" },
  { id: "sequences", label: "Sequences", icon: "🔢" },
  { id: "memory", label: "Memory", icon: "🧠" },
  { id: "reaction", label: "Reaction", icon: "⚡" },
  { id: "market-making", label: "Market Making", icon: "📈" },
] as const;

const gamesByCategory: Record<string, GameItem[]> = {
  arithmetic: [
    {
      id: "math-trainer",
      name: "Math Trainer",
      description: "Customize operations, number type, time, and question style — then drill.",
      icon: "🧮",
      iconBg: "bg-green-500/10",
      route: "/games/math-trainer/setup",
    },
    { id: "speed-mult", name: "Speed Multiplication", description: "Rapid multiplication drills against the clock.", icon: "✖️", iconBg: "bg-orange-500/10", comingSoon: true },
    { id: "fraction-flash", name: "Fraction Flash", description: "Quick-fire fraction conversion challenges.", icon: "½", iconBg: "bg-blue-500/10", comingSoon: true },
  ],
  sequences: [
    { id: "seq-pattern", name: "Pattern Finder", description: "Spot the next term in tricky sequences.", icon: "🔢", iconBg: "bg-purple-500/10", comingSoon: true },
    { id: "seq-recall", name: "Sequence Recall", description: "Memorize and reproduce growing sequences.", icon: "🧩", iconBg: "bg-pink-500/10", comingSoon: true },
  ],
  memory: [
    { id: "mem-cards", name: "Card Memory", description: "Track shuffled cards and recall positions.", icon: "🃏", iconBg: "bg-red-500/10", comingSoon: true },
    { id: "mem-numbers", name: "Number Span", description: "Push your working memory to the limit.", icon: "🔟", iconBg: "bg-yellow-500/10", comingSoon: true },
  ],
  reaction: [
    { id: "rxn-tap", name: "Reaction Tap", description: "Test your raw response time.", icon: "⚡", iconBg: "bg-cyan-500/10", comingSoon: true },
    { id: "rxn-color", name: "Color Switch", description: "React only when the right color appears.", icon: "🎨", iconBg: "bg-emerald-500/10", comingSoon: true },
  ],
  "market-making": [
    { id: "mm-quote", name: "Quote the Market", description: "Make tight markets under uncertainty.", icon: "📈", iconBg: "bg-indigo-500/10", comingSoon: true },
    { id: "mm-edge", name: "Edge Hunter", description: "Identify mispricings before the clock runs out.", icon: "💹", iconBg: "bg-rose-500/10", comingSoon: true },
  ],
};

const Games = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("category") as string) || "arithmetic";

  const items = useMemo(() => gamesByCategory[activeCategory] ?? [], [activeCategory]);
  const heading = useMemo(() => {
    const cat = categories.find((c) => c.id === activeCategory);
    return cat ? `${cat.label} games` : "Games";
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex flex-wrap gap-2 p-2 mb-8 rounded-full bg-card border border-border">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground/70 hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <span className="text-base leading-none">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{heading}</h1>
          <p className="text-muted-foreground">Pick a trainer to start practicing.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((game) => (
            <Card
              key={game.id}
              className={`relative overflow-hidden bg-card border border-border transition-transform duration-300 group ${
                game.comingSoon ? "opacity-70" : "hover:-translate-y-1 cursor-pointer"
              }`}
              onClick={() => !game.comingSoon && game.route && navigate(game.route)}
            >
              <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-60 ${game.iconBg}`} />
              <CardContent className="relative p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl text-3xl shrink-0 border border-border/60 bg-background/40 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {game.icon}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-foreground leading-tight">{game.name}</h3>
                      {game.comingSoon && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
