import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Clock, Play, Star } from "lucide-react";

const Games = () => {
  const games = [
    {
      id: 1,
      title: "Market Maker Challenge",
      description: "Test your market making skills in a simulated trading environment",
      difficulty: "Hard",
      players: 1247,
      timeLimit: "15 min",
      reward: "500 XP",
      category: "Trading",
      featured: true
    },
    {
      id: 2,
      title: "Portfolio Optimization Race",
      description: "Build the most efficient portfolio under various constraints",
      difficulty: "Medium",
      players: 892,
      timeLimit: "20 min",
      reward: "300 XP",
      category: "Portfolio Management",
      featured: false
    },
    {
      id: 3,
      title: "Derivatives Pricing Quiz",
      description: "Quick-fire questions on options, futures, and swaps pricing",
      difficulty: "Easy",
      players: 2156,
      timeLimit: "10 min",
      reward: "150 XP",
      category: "Derivatives",
      featured: false
    },
    {
      id: 4,
      title: "Risk Management Simulator",
      description: "Navigate market crises and manage portfolio risk in real-time",
      difficulty: "Hard",
      players: 634,
      timeLimit: "25 min",
      reward: "600 XP",
      category: "Risk Management",
      featured: true
    },
    {
      id: 5,
      title: "Algorithmic Trading Battle",
      description: "Code trading algorithms and compete against other players",
      difficulty: "Hard",
      players: 445,
      timeLimit: "30 min",
      reward: "750 XP",
      category: "Algorithmic Trading",
      featured: false
    },
    {
      id: 6,
      title: "Financial Modeling Sprint",
      description: "Build and validate financial models under time pressure",
      difficulty: "Medium",
      players: 1089,
      timeLimit: "18 min",
      reward: "400 XP",
      category: "Modeling",
      featured: false
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Interactive Games</h1>
          <p className="text-muted-foreground text-lg">
            Learn quantitative finance through engaging, competitive gameplay
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-2xl font-bold text-primary">47</p>
                </div>
                <Play className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold text-primary">12,450</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-2xl font-bold text-primary">#127</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-primary">68%</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Games */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Featured Games</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {games.filter(game => game.featured).map((game) => (
              <Card key={game.id} className="hover:shadow-card transition-all duration-300 hover:scale-105 border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        {game.title}
                        <Star className="w-5 h-5 text-primary" />
                      </CardTitle>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {game.category}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {game.players.toLocaleString()} players
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.timeLimit}
                      </span>
                    </div>
                    <div className="text-primary font-medium">
                      {game.reward}
                    </div>
                  </div>
                  <Button className="w-full" variant="premium">
                    <Play className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Games */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">All Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.filter(game => !game.featured).map((game) => (
              <Card key={game.id} className="hover:shadow-card transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {game.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {game.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {game.players.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {game.timeLimit}
                      </span>
                    </div>
                    <div className="text-primary font-medium text-sm">
                      {game.reward}
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;