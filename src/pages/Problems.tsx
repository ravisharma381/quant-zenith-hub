import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp, Clock, CheckCircle } from "lucide-react";

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const problems = [
    {
      id: 1,
      title: "Black-Scholes Options Pricing",
      difficulty: "Medium",
      category: "Derivatives",
      estimatedTime: "45 min",
      completed: false,
      description: "Implement the Black-Scholes formula for European option pricing"
    },
    {
      id: 2,
      title: "Portfolio Risk Calculation",
      difficulty: "Hard",
      category: "Risk Management",
      estimatedTime: "60 min",
      completed: true,
      description: "Calculate VaR and CVaR for a multi-asset portfolio"
    },
    {
      id: 3,
      title: "Time Series Analysis",
      difficulty: "Easy",
      category: "Statistics",
      estimatedTime: "30 min",
      completed: false,
      description: "Analyze financial time series data using ARIMA models"
    },
    {
      id: 4,
      title: "Monte Carlo Simulation",
      difficulty: "Medium",
      category: "Quantitative Methods",
      estimatedTime: "50 min",
      completed: false,
      description: "Implement Monte Carlo methods for option pricing"
    },
    {
      id: 5,
      title: "CAPM Beta Calculation",
      difficulty: "Easy",
      category: "Asset Pricing",
      estimatedTime: "25 min",
      completed: true,
      description: "Calculate and interpret CAPM beta for various securities"
    },
    {
      id: 6,
      title: "Yield Curve Construction",
      difficulty: "Hard",
      category: "Fixed Income",
      estimatedTime: "75 min",
      completed: false,
      description: "Build a yield curve using bootstrap method"
    }
  ];

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Practice Problems</h1>
          <p className="text-muted-foreground text-lg">
            Master quantitative finance concepts through hands-on problem solving
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                <Filter className="w-4 h-4 mr-1" />
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">2/6</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-primary">33%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold text-primary">2h 15m</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-card transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {problem.title}
                  </CardTitle>
                  {problem.completed && (
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {problem.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {problem.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {problem.estimatedTime}
                  </div>
                  <Button size="sm" variant={problem.completed ? "outline" : "default"}>
                    {problem.completed ? "Review" : "Solve"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;