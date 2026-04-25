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
      <div className="max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((company) => (
            <Card
              key={company.id}
              className={`${company.color} hover:scale-105 transition-all duration-200 cursor-pointer group`}
              onClick={() => navigate(`/playlists/${company.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>
                    <div className={`${company.iconBg} p-2 rounded-lg text-lg`}>
                      {company.icon}
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{company.problems}</div>
                      <div className="text-sm text-muted-foreground">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{company.topics}</div>
                      <div className="text-sm text-muted-foreground">
                        {activeCategory === "tags" ? "Tag" : "Topics"}
                      </div>
                    </div>
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

export default Playlists;
