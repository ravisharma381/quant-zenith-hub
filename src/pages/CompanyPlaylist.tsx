import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Problem = { id: string; name: string; solved: boolean };
type Level = { id: string; name: string; problems: Problem[] };

const CompanyPlaylist = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const playlistData: Record<string, { name: string; icon: string }> = {
    "jane-street": { name: "Jane Street", icon: "🎯" },
    "citadel": { name: "Citadel", icon: "🏢" },
    "dice": { name: "Dice", icon: "🎲" },
    "top-75": { name: "Top 75", icon: "75" },
    "top-50": { name: "Top 50", icon: "50" },
    "coins": { name: "Coins", icon: "🪙" },
    "optiver": { name: "Optiver", icon: "⚠️" },
    "hudson-river": { name: "Hudson River Trading", icon: "🌊" },
    "two-sigma": { name: "Two Sigma", icon: "2σ" },
    "imc": { name: "IMC", icon: "📊" },
    "akuna-capital": { name: "Akuna Capital", icon: "🎯" },
    "drw": { name: "DRW", icon: "DRW" },
    "sig": { name: "SIG", icon: "〰️" },
    "old-mission": { name: "Old Mission", icon: "⚡" },
    "squarepoint": { name: "Squarepoint Capital", icon: "⬜" },
    "transmarket": { name: "TransMarket Group", icon: "📈" },
    "worldquant": { name: "WorldQuant", icon: "🌍" },
    "goldman-sachs": { name: "Goldman Sachs", icon: "💰" },
    "belvedere": { name: "Belvedere Trading", icon: "🏪" },
    "five-rings": { name: "Five Rings", icon: "💍" },
  };

  const playlist = playlistData[companyId || ""] || { name: "Playlist", icon: "📚" };

  const levels: Level[] = [
    {
      id: "level-1",
      name: "Level 1",
      problems: [
        { id: "1-dot-removed", name: "1 Dot Removed", solved: false },
        { id: "expected-wait-time-1", name: "Expected Wait Time I", solved: false },
        { id: "prime-sum", name: "Prime Sum", solved: false },
        { id: "gold-thief", name: "Gold Thief", solved: false },
      ],
    },
    {
      id: "level-2",
      name: "Level 2",
      problems: [
        { id: "bridge-crossing", name: "Bridge Crossing", solved: false },
        { id: "clock-angle-1", name: "Clock Angle I", solved: false },
        { id: "ferry-stops", name: "Ferry Stops", solved: false },
        { id: "hand-meet", name: "Hand Meet", solved: false },
      ],
    },
    {
      id: "level-3",
      name: "Level 3",
      problems: [
        { id: "100-lights", name: "100 Lights", solved: false },
        { id: "horse-racing", name: "Horse Racing", solved: false },
        { id: "penny-stack", name: "Penny Stack", solved: false },
        { id: "true-statement", name: "True Statement", solved: false },
      ],
    },
    {
      id: "level-4",
      name: "Level 4",
      problems: [
        { id: "infected-dinner-2", name: "Infected Dinner II", solved: false },
        { id: "poisoned-kegs-4", name: "Poisoned Kegs IV", solved: false },
        { id: "prime-subset", name: "Prime Subset", solved: false },
      ],
    },
  ];

  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    "level-1": true,
    "level-2": true,
    "level-3": false,
    "level-4": false,
  });

  const toggleLevel = (id: string) => {
    setOpenLevels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Playlists
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center text-3xl">
            {playlist.icon}
          </div>
          <h1 className="text-4xl font-bold text-foreground">{playlist.name}</h1>
        </div>

        {/* Levels */}
        <div className="space-y-4">
          {levels.map((level) => {
            const isOpen = openLevels[level.id];
            return (
              <div
                key={level.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleLevel(level.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="text-xl font-bold text-foreground">{level.name}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isOpen ? "" : "-rotate-90"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-border">
                    {level.problems.map((problem, idx) => (
                      <div
                        key={problem.id}
                        onClick={() => navigate(`/problems/${problem.id}`)}
                        className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${
                          idx !== level.problems.length - 1 ? "border-b border-border/50" : ""
                        }`}
                      >
                        <span className="text-foreground font-medium">{problem.name}</span>
                        <Badge
                          variant="outline"
                          className={
                            problem.solved
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          }
                        >
                          {problem.solved ? "Solved" : "Not Solved"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyPlaylist;
