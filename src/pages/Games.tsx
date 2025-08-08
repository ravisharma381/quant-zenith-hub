import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";

const Games = () => {
  const navigate = useNavigate();
  const games = [
    {
      id: 1,
      title: "Arithmetic Pro",
      description: "Master mental math with rapid-fire arithmetic questions. Test your speed and accuracy!",
      icon: "±",
      timeLimit: "3 minutes",
      category: "Mental Math",
      difficulty: "Medium",
      route: "/games/arithmetic-pro"
    },
    {
      id: 2,
      title: "Sequences Pro",
      description: "Identify patterns and find the next number in sequences. Challenge your logical thinking!",
      icon: "⋯",
      timeLimit: "5 minutes",
      category: "Pattern Recognition", 
      difficulty: "Hard",
      route: "/games/sequences-pro"
    },
    {
      id: 3,
      title: "Optiver 80 in 80",
      description: "Complete 80 mental math questions in 80 seconds. Based on Optiver's online assessment!",
      icon: "⚡",
      timeLimit: "80 seconds",
      category: "Speed Math",
      difficulty: "Hard",
      route: "/games/optiver-80"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Quant Interview Games</h1>
          <p className="text-muted-foreground text-lg">
            Sharpen your quantitative skills through interactive challenges
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const theme = getGameTheme(game.id);
            return (
              <div 
                key={game.id} 
                className={`bg-card border border-border rounded-xl p-6 hover:shadow-card transition-all duration-300 ${theme.hoverBorder} cursor-pointer group hover:scale-105`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${theme.iconBg} rounded-lg flex items-center justify-center mb-6 transition-colors`}>
                  <span className="text-2xl">{game.icon}</span>
                </div>
                
                {/* Title */}
                <h3 className={`text-xl font-bold text-foreground ${theme.titleHover} transition-colors mb-4`}>
                  {game.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {game.description}
                </p>
                
                {/* Badge and Time */}
                <div className="flex items-center justify-between mb-6">
                  <Badge className={getDifficultyColor(game.difficulty)} variant="outline">
                    {game.difficulty}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {game.timeLimit}
                  </div>
                </div>
                
                {/* Play Button - Full Width */}
                <Button 
                  onClick={() => navigate(game.route)}
                  className={`w-full ${theme.buttonStyles} transition-colors`}
                >
                  Play
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;