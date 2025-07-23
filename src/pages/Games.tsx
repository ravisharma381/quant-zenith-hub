import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";

const Games = () => {
  const games = [
    {
      id: 1,
      title: "Arithmetic Zetamac",
      description: "How good are you at basic arithmetic? Deal with whole numbers and show you qualify the bare minimum! Just like Zetamac :)",
      icon: "±",
      timeLimit: "1-3 minutes",
      category: "Mental Math",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Sequences",
      description: "How good are you at recognizing patterns? Start out and see how well you know your numbers!",
      icon: "⋯",
      timeLimit: "2-6 minutes",
      category: "Pattern Recognition",
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Options Pricing Battle",
      description: "Price complex derivatives under time pressure using Black-Scholes and beyond",
      icon: "📊",
      timeLimit: "10-15 minutes",
      category: "Derivatives",
      difficulty: "Hard"
    },
    {
      id: 4,
      title: "Portfolio Optimization",
      description: "Build efficient portfolios with various constraints and risk models",
      icon: "📈",
      timeLimit: "15-20 minutes",
      category: "Portfolio Management",
      difficulty: "Hard"
    },
    {
      id: 5,
      title: "Risk Management Quiz",
      description: "Test your knowledge of VaR, stress testing, and risk metrics",
      icon: "⚠️",
      timeLimit: "5-10 minutes",
      category: "Risk Management",
      difficulty: "Medium"
    },
    {
      id: 6,
      title: "Market Data Analysis",
      description: "Analyze real-time market data and identify trading opportunities",
      icon: "📊",
      timeLimit: "8-12 minutes",
      category: "Market Analysis",
      difficulty: "Medium"
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