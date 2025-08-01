import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
          {games.map((game) => (
            <div 
              key={game.id} 
              onClick={() => navigate(game.route)}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-card transition-all duration-300 hover:scale-105 hover:border-primary/30 cursor-pointer group"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">{game.icon}</span>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {game.title}
                  </h3>
                  <Badge className={getDifficultyColor(game.difficulty)} variant="outline">
                    {game.difficulty}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {game.timeLimit}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;