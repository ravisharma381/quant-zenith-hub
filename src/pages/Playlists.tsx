import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Playlists = () => {
  const navigate = useNavigate();

  const companies = [
    {
      id: "dice",
      name: "Dice",
      problems: 124,
      topics: 8,
      color: "bg-purple-500/20 border-purple-500/30",
      iconBg: "bg-purple-500/10",
      icon: "🎲"
    },
    {
      id: "jane-street", 
      name: "Jane Street",
      problems: 133,
      topics: 32,
      color: "bg-blue-500/20 border-blue-500/30",
      iconBg: "bg-blue-500/10",
      icon: "🎯"
    },
    {
      id: "top-75",
      name: "Top 75",
      problems: 73,
      topics: 8,
      color: "bg-orange-500/20 border-orange-500/30",
      iconBg: "bg-orange-500/10",
      icon: "75"
    },
    {
      id: "coins",
      name: "Coins",
      problems: 34,
      topics: 1,
      color: "bg-yellow-500/20 border-yellow-500/30",
      iconBg: "bg-yellow-500/10",
      icon: "🪙"
    },
    {
      id: "top-50",
      name: "Top 50",
      problems: 53,
      topics: 5,
      color: "bg-green-500/20 border-green-500/30",
      iconBg: "bg-green-500/10",
      icon: "50"
    },
    {
      id: "citadel",
      name: "Citadel",
      problems: 84,
      topics: 6,
      color: "bg-blue-600/20 border-blue-600/30",
      iconBg: "bg-blue-600/10",
      icon: "🏢"
    },
    {
      id: "optiver",
      name: "Optiver",
      problems: 60,
      topics: 18,
      color: "bg-orange-600/20 border-orange-600/30",
      iconBg: "bg-orange-600/10",
      icon: "⚠️"
    },
    {
      id: "hudson-river",
      name: "Hudson River Trading",
      problems: 33,
      topics: 6,
      color: "bg-yellow-600/20 border-yellow-600/30",
      iconBg: "bg-yellow-600/10",
      icon: "🌊"
    },
    {
      id: "two-sigma",
      name: "Two Sigma",
      problems: 30,
      topics: 6,
      color: "bg-teal-500/20 border-teal-500/30",
      iconBg: "bg-teal-500/10",
      icon: "2σ"
    },
    {
      id: "imc",
      name: "IMC",
      problems: 45,
      topics: 11,
      color: "bg-blue-400/20 border-blue-400/30",
      iconBg: "bg-blue-400/10",
      icon: "📊"
    },
    {
      id: "akuna-capital",
      name: "Akuna Capital",
      problems: 64,
      topics: 10,
      color: "bg-cyan-500/20 border-cyan-500/30",
      iconBg: "bg-cyan-500/10",
      icon: "🎯"
    },
    {
      id: "drw",
      name: "DRW",
      problems: 51,
      topics: 7,
      color: "bg-purple-400/20 border-purple-400/30",
      iconBg: "bg-purple-400/10",
      icon: "DRW"
    },
    {
      id: "sig",
      name: "SIG",
      problems: 147,
      topics: 12,
      color: "bg-gray-500/20 border-gray-500/30",
      iconBg: "bg-gray-500/10",
      icon: "〰️"
    },
    {
      id: "old-mission",
      name: "Old Mission",
      problems: 42,
      topics: 10,
      color: "bg-indigo-500/20 border-indigo-500/30",
      iconBg: "bg-indigo-500/10",
      icon: "⚡"
    },
    {
      id: "squarepoint",
      name: "Squarepoint Capital",
      problems: 39,
      topics: 9,
      color: "bg-red-400/20 border-red-400/30",
      iconBg: "bg-red-400/10",
      icon: "⬜"
    },
    {
      id: "transmarket",
      name: "TransMarket Group",
      problems: 43,
      topics: 11,
      color: "bg-pink-500/20 border-pink-500/30",
      iconBg: "bg-pink-500/10",
      icon: "📈"
    },
    {
      id: "worldquant",
      name: "WorldQuant",
      problems: 56,
      topics: 7,
      color: "bg-emerald-500/20 border-emerald-500/30",
      iconBg: "bg-emerald-500/10",
      icon: "🌍"
    },
    {
      id: "goldman-sachs",
      name: "Goldman Sachs",
      problems: 71,
      topics: 8,
      color: "bg-lime-500/20 border-lime-500/30",
      iconBg: "bg-lime-500/10",
      icon: "💰"
    },
    {
      id: "belvedere",
      name: "Belvedere Trading",
      problems: 31,
      topics: 14,
      color: "bg-rose-500/20 border-rose-500/30",
      iconBg: "bg-rose-500/10",
      icon: "🏪"
    },
    {
      id: "five-rings",
      name: "Five Rings",
      problems: 70,
      topics: 11,
      color: "bg-slate-500/20 border-slate-500/30",
      iconBg: "bg-slate-500/10",
      icon: "💍"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Curated quant interview question playlists
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companies.map((company) => (
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
                        <div className="text-2xl font-bold text-foreground">
                          {company.problems}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Problems
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {company.topics}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Topics
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