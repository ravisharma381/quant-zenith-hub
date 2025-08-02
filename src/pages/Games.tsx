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

  const getGameTheme = (gameId: number) => {
    switch (gameId) {
      case 1: // Arithmetic Pro - Green (default)
        return {
          primary: "hsl(122, 97%, 50%)",
          primaryForeground: "hsl(220, 13%, 8%)",
          hoverBorder: "hover:border-[hsl(122,97%,50%)]/30",
          iconBg: "bg-[hsl(122,97%,50%)]/10 group-hover:bg-[hsl(122,97%,50%)]/20",
          titleHover: "group-hover:text-[hsl(122,97%,50%)]",
          buttonStyles: "bg-[hsl(122,97%,50%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(122,97%,50%)]/90 hover:shadow-[0_0_20px_hsl(122,97%,50%,0.3)] focus-visible:ring-[hsl(122,97%,50%)]"
        };
      case 2: // Sequences Pro - Purple
        return {
          primary: "hsl(270, 95%, 60%)",
          primaryForeground: "hsl(220, 13%, 8%)",
          hoverBorder: "hover:border-[hsl(270,95%,60%)]/30",
          iconBg: "bg-[hsl(270,95%,60%)]/10 group-hover:bg-[hsl(270,95%,60%)]/20",
          titleHover: "group-hover:text-[hsl(270,95%,60%)]",
          buttonStyles: "bg-[hsl(270,95%,60%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(270,95%,60%)]/90 hover:shadow-[0_0_20px_hsl(270,95%,60%,0.3)] focus-visible:ring-[hsl(270,95%,60%)]"
        };
      case 3: // Optiver 80 - Red
        return {
          primary: "hsl(0, 84%, 60%)",
          primaryForeground: "hsl(220, 13%, 8%)",
          hoverBorder: "hover:border-[hsl(0,84%,60%)]/30",
          iconBg: "bg-[hsl(0,84%,60%)]/10 group-hover:bg-[hsl(0,84%,60%)]/20",
          titleHover: "group-hover:text-[hsl(0,84%,60%)]",
          buttonStyles: "bg-[hsl(0,84%,60%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(0,84%,60%)]/90 hover:shadow-[0_0_20px_hsl(0,84%,60%,0.3)] focus-visible:ring-[hsl(0,84%,60%)]"
        };
      default:
        return {
          primary: "hsl(122, 97%, 50%)",
          primaryForeground: "hsl(220, 13%, 8%)",
          hoverBorder: "hover:border-primary/30",
          iconBg: "bg-primary/10 group-hover:bg-primary/20",
          titleHover: "group-hover:text-primary",
          buttonStyles: "bg-primary text-primary-foreground hover:bg-primary/90"
        };
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
                className={`bg-card border border-border rounded-xl p-6 hover:shadow-card transition-all duration-300 ${theme.hoverBorder} cursor-pointer group`}
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