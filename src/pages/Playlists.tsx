import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

type PlaylistItem = {
  id: string;
  name: string;
  problems: number;
  topics: number;
  color: string;
  iconBg: string;
  icon: string;
  description?: string;
};

const descriptions: Record<string, string> = {
  "dice": "Classic dice puzzles covering expected value, conditional probability, and combinatorics.",
  "jane-street": "Curated questions inspired by Jane Street's interview style across probability and logic.",
  "top-75": "Most-asked quant questions every candidate should master before interviews.",
  "coins": "Coin flip puzzles spanning fair, biased, and sequential outcome scenarios.",
  "top-50": "A focused shortlist of the highest-impact problems for rapid prep.",
  "citadel": "Probability, market-making, and brainteaser problems modeled after Citadel rounds.",
  "optiver": "Mental math, market making, and game theory questions in Optiver's style.",
  "hudson-river": "Algorithmic and probability problems that mirror Hudson River Trading interviews.",
  "two-sigma": "Statistics, modeling, and quantitative reasoning problems from Two Sigma.",
  "imc": "Trading-focused puzzles with a strong emphasis on speed and intuition.",
  "akuna-capital": "Options-flavored probability and game theory questions from Akuna interviews.",
  "drw": "Probability and trading puzzles inspired by DRW's selection process.",
  "sig": "Game theory, betting, and probability questions in classic SIG style.",
  "old-mission": "Market-making puzzles and probability brainteasers from Old Mission.",
  "squarepoint": "Statistics-leaning quant problems and probability puzzles.",
  "transmarket": "Mental math drills and probability problems from TransMarket interviews.",
  "worldquant": "Quantitative modeling and statistics problems in WorldQuant's style.",
  "goldman-sachs": "Finance, probability, and brainteaser problems from Goldman Sachs interviews.",
  "belvedere": "Trading puzzles and game theory problems modeled on Belvedere rounds.",
  "five-rings": "Probability and game theory questions inspired by Five Rings interviews.",
  "qr-probability-30": "A 30-problem sprint covering core probability concepts in one sitting.",
  "qr-brainteasers-25": "Twenty-five classic brainteasers to sharpen lateral thinking quickly.",
  "qr-mental-math": "Fast-paced arithmetic drills to build interview-ready mental math speed.",
  "qr-stats-essentials": "The must-know statistics concepts distilled into a focused review.",
  "qr-game-theory": "Quick game theory refresher covering Nash equilibrium and strategy puzzles.",
  "qr-must-know-50": "Fifty essential problems that recur across nearly every quant interview.",
  "qr-final-week": "A structured review plan for your final week of interview preparation.",
  "qr-day-before": "Light, high-yield problems perfect for the night before your interview.",
  "tag-brainteasers": "Lateral thinking puzzles that test creativity and structured reasoning.",
  "tag-probability": "Foundational probability problems from basic events to advanced distributions.",
  "tag-combinatorics": "Counting, permutations, and arrangement problems for sharp combinatorial intuition.",
  "tag-expected-value": "Expected value problems spanning games, gambles, and decision-making.",
  "tag-markov-chains": "State-transition problems and stationary distribution puzzles.",
  "tag-game-theory": "Strategic decision problems involving equilibria and optimal play.",
  "tag-statistics": "Estimation, hypothesis testing, and statistical reasoning problems.",
  "tag-linear-algebra": "Vector spaces, matrices, and eigenvalue problems for quant prep.",
  "tag-calculus": "Derivatives, integrals, and limits applied to quantitative scenarios.",
  "tag-mental-math": "Speed arithmetic and number-sense drills used in trading interviews.",
  "tag-coding": "Algorithmic problems blending logic with quantitative reasoning.",
  "tag-options": "Options pricing intuition, Greeks, and derivatives-flavored problems.",
};

const companyPlaylists: PlaylistItem[] = [
  { id: "dice", name: "Dice", problems: 124, topics: 8, color: "bg-purple-500/20 border-purple-500/30", iconBg: "bg-purple-500/10", icon: "🎲" },
  { id: "jane-street", name: "Jane Street", problems: 133, topics: 32, color: "bg-blue-500/20 border-blue-500/30", iconBg: "bg-blue-500/10", icon: "🎯" },
  { id: "top-75", name: "Top 75", problems: 73, topics: 8, color: "bg-orange-500/20 border-orange-500/30", iconBg: "bg-orange-500/10", icon: "75" },
  { id: "coins", name: "Coins", problems: 34, topics: 1, color: "bg-yellow-500/20 border-yellow-500/30", iconBg: "bg-yellow-500/10", icon: "🪙" },
  { id: "top-50", name: "Top 50", problems: 53, topics: 5, color: "bg-green-500/20 border-green-500/30", iconBg: "bg-green-500/10", icon: "50" },
  { id: "citadel", name: "Citadel", problems: 84, topics: 6, color: "bg-blue-600/20 border-blue-600/30", iconBg: "bg-blue-600/10", icon: "🏢" },
  { id: "optiver", name: "Optiver", problems: 60, topics: 18, color: "bg-orange-600/20 border-orange-600/30", iconBg: "bg-orange-600/10", icon: "⚠️" },
  { id: "hudson-river", name: "Hudson River Trading", problems: 33, topics: 6, color: "bg-yellow-600/20 border-yellow-600/30", iconBg: "bg-yellow-600/10", icon: "🌊" },
  { id: "two-sigma", name: "Two Sigma", problems: 30, topics: 6, color: "bg-teal-500/20 border-teal-500/30", iconBg: "bg-teal-500/10", icon: "2σ" },
  { id: "imc", name: "IMC", problems: 45, topics: 11, color: "bg-blue-400/20 border-blue-400/30", iconBg: "bg-blue-400/10", icon: "📊" },
  { id: "akuna-capital", name: "Akuna Capital", problems: 64, topics: 10, color: "bg-cyan-500/20 border-cyan-500/30", iconBg: "bg-cyan-500/10", icon: "🎯" },
  { id: "drw", name: "DRW", problems: 51, topics: 7, color: "bg-purple-400/20 border-purple-400/30", iconBg: "bg-purple-400/10", icon: "DRW" },
  { id: "sig", name: "SIG", problems: 147, topics: 12, color: "bg-gray-500/20 border-gray-500/30", iconBg: "bg-gray-500/10", icon: "〰️" },
  { id: "old-mission", name: "Old Mission", problems: 42, topics: 10, color: "bg-indigo-500/20 border-indigo-500/30", iconBg: "bg-indigo-500/10", icon: "⚡" },
  { id: "squarepoint", name: "Squarepoint Capital", problems: 39, topics: 9, color: "bg-red-400/20 border-red-400/30", iconBg: "bg-red-400/10", icon: "⬜" },
  { id: "transmarket", name: "TransMarket Group", problems: 43, topics: 11, color: "bg-pink-500/20 border-pink-500/30", iconBg: "bg-pink-500/10", icon: "📈" },
  { id: "worldquant", name: "WorldQuant", problems: 56, topics: 7, color: "bg-emerald-500/20 border-emerald-500/30", iconBg: "bg-emerald-500/10", icon: "🌍" },
  { id: "goldman-sachs", name: "Goldman Sachs", problems: 71, topics: 8, color: "bg-lime-500/20 border-lime-500/30", iconBg: "bg-lime-500/10", icon: "💰" },
  { id: "belvedere", name: "Belvedere Trading", problems: 31, topics: 14, color: "bg-rose-500/20 border-rose-500/30", iconBg: "bg-rose-500/10", icon: "🏪" },
  { id: "five-rings", name: "Five Rings", problems: 70, topics: 11, color: "bg-slate-500/20 border-slate-500/30", iconBg: "bg-slate-500/10", icon: "💍" },
];

const quickRevisionPlaylists: PlaylistItem[] = [
  { id: "qr-probability-30", name: "Probability in 30", problems: 30, topics: 5, color: "bg-blue-500/20 border-blue-500/30", iconBg: "bg-blue-500/10", icon: "🎲" },
  { id: "qr-brainteasers-25", name: "Brainteasers Sprint", problems: 25, topics: 4, color: "bg-purple-500/20 border-purple-500/30", iconBg: "bg-purple-500/10", icon: "🧠" },
  { id: "qr-mental-math", name: "Mental Math Drill", problems: 40, topics: 3, color: "bg-orange-500/20 border-orange-500/30", iconBg: "bg-orange-500/10", icon: "➗" },
  { id: "qr-stats-essentials", name: "Stats Essentials", problems: 20, topics: 6, color: "bg-emerald-500/20 border-emerald-500/30", iconBg: "bg-emerald-500/10", icon: "📊" },
  { id: "qr-game-theory", name: "Game Theory Quick", problems: 18, topics: 4, color: "bg-pink-500/20 border-pink-500/30", iconBg: "bg-pink-500/10", icon: "♟️" },
  { id: "qr-must-know-50", name: "Must-Know 50", problems: 50, topics: 10, color: "bg-yellow-500/20 border-yellow-500/30", iconBg: "bg-yellow-500/10", icon: "⭐" },
  { id: "qr-final-week", name: "Final Week Review", problems: 35, topics: 8, color: "bg-red-500/20 border-red-500/30", iconBg: "bg-red-500/10", icon: "🔥" },
  { id: "qr-day-before", name: "Day Before Interview", problems: 15, topics: 5, color: "bg-cyan-500/20 border-cyan-500/30", iconBg: "bg-cyan-500/10", icon: "⏱️" },
];

const tagPlaylists: PlaylistItem[] = [
  { id: "tag-brainteasers", name: "Brainteasers", problems: 95, topics: 1, color: "bg-purple-500/20 border-purple-500/30", iconBg: "bg-purple-500/10", icon: "🧩" },
  { id: "tag-probability", name: "Probability", problems: 120, topics: 1, color: "bg-blue-500/20 border-blue-500/30", iconBg: "bg-blue-500/10", icon: "🎲" },
  { id: "tag-combinatorics", name: "Combinatorics", problems: 64, topics: 1, color: "bg-emerald-500/20 border-emerald-500/30", iconBg: "bg-emerald-500/10", icon: "🔢" },
  { id: "tag-expected-value", name: "Expected Value", problems: 58, topics: 1, color: "bg-orange-500/20 border-orange-500/30", iconBg: "bg-orange-500/10", icon: "📈" },
  { id: "tag-markov-chains", name: "Markov Chains", problems: 32, topics: 1, color: "bg-cyan-500/20 border-cyan-500/30", iconBg: "bg-cyan-500/10", icon: "🔗" },
  { id: "tag-game-theory", name: "Game Theory", problems: 41, topics: 1, color: "bg-pink-500/20 border-pink-500/30", iconBg: "bg-pink-500/10", icon: "♟️" },
  { id: "tag-statistics", name: "Statistics", problems: 78, topics: 1, color: "bg-yellow-500/20 border-yellow-500/30", iconBg: "bg-yellow-500/10", icon: "📊" },
  { id: "tag-linear-algebra", name: "Linear Algebra", problems: 36, topics: 1, color: "bg-indigo-500/20 border-indigo-500/30", iconBg: "bg-indigo-500/10", icon: "📐" },
  { id: "tag-calculus", name: "Calculus", problems: 44, topics: 1, color: "bg-red-500/20 border-red-500/30", iconBg: "bg-red-500/10", icon: "∫" },
  { id: "tag-mental-math", name: "Mental Math", problems: 87, topics: 1, color: "bg-lime-500/20 border-lime-500/30", iconBg: "bg-lime-500/10", icon: "🧮" },
  { id: "tag-coding", name: "Coding", problems: 52, topics: 1, color: "bg-slate-500/20 border-slate-500/30", iconBg: "bg-slate-500/10", icon: "💻" },
  { id: "tag-options", name: "Options & Derivatives", problems: 39, topics: 1, color: "bg-rose-500/20 border-rose-500/30", iconBg: "bg-rose-500/10", icon: "💹" },
];

const categories = [
  { id: "company", label: "Company Specific" },
  { id: "quick-revision", label: "Quick Revision" },
  { id: "tags", label: "Tags" },
] as const;

const Playlists = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get("category") as typeof categories[number]["id"]) || "company";

  const items = useMemo(() => {
    if (activeCategory === "quick-revision") return quickRevisionPlaylists;
    if (activeCategory === "tags") return tagPlaylists;
    return companyPlaylists;
  }, [activeCategory]);

  const heading = useMemo(() => {
    if (activeCategory === "quick-revision") return "Quick revision playlists";
    if (activeCategory === "tags") return "Playlists by topic & tag";
    return "Curated quant interview question playlists";
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{heading}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((company) => (
            <Card
              key={company.id}
              className={`${company.color} hover:scale-105 transition-all duration-200 cursor-pointer group`}
              onClick={() => navigate(`/playlists/${company.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {company.name}
                    </h3>
                    <div className={`${company.iconBg} p-3 rounded-lg text-3xl leading-none flex items-center justify-center shrink-0`}>
                      {company.icon}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {descriptions[company.id] ?? "Curated problems to help you prepare effectively."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playlists;
