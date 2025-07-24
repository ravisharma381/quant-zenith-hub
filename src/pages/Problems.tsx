import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock } from "lucide-react";

const Problems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const problems = [
    {
      id: 1,
      title: "Black-Scholes Options Pricing",
      difficulty: "Medium",
      topic: "Derivatives",
      tags: ["Options", "Pricing Models"],
      status: "To-Do",
      estimatedTime: "45 min",
      completed: false
    },
    {
      id: 2,
      title: "Portfolio Risk Calculation",
      difficulty: "Hard",
      topic: "Risk Management",
      tags: ["VaR", "Portfolio Theory"],
      status: "Completed",
      estimatedTime: "60 min",
      completed: true
    },
    {
      id: 3,
      title: "Time Series Analysis",
      difficulty: "Easy",
      topic: "Statistics",
      tags: ["ARIMA", "Forecasting"],
      status: "To-Do",
      estimatedTime: "30 min",
      completed: false
    },
    {
      id: 4,
      title: "Monte Carlo Simulation",
      difficulty: "Medium",
      topic: "Quantitative Methods",
      tags: ["Simulation", "Pricing"],
      status: "In Progress",
      estimatedTime: "50 min",
      completed: false
    },
    {
      id: 5,
      title: "CAPM Beta Calculation",
      difficulty: "Easy",
      topic: "Asset Pricing",
      tags: ["CAPM", "Beta"],
      status: "Completed",
      estimatedTime: "25 min",
      completed: true
    },
    {
      id: 6,
      title: "Yield Curve Construction",
      difficulty: "Hard",
      topic: "Fixed Income",
      tags: ["Bonds", "Yield Curve"],
      status: "To-Do",
      estimatedTime: "75 min",
      completed: false
    }
  ];

  const topics = ["All", "Derivatives", "Risk Management", "Statistics", "Quantitative Methods", "Asset Pricing", "Fixed Income"];
  const tags = ["All", "Options", "Pricing Models", "VaR", "Portfolio Theory", "ARIMA", "Forecasting", "Simulation", "Pricing", "CAPM", "Beta", "Bonds", "Yield Curve"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const statuses = ["All", "To-Do", "In Progress", "Completed"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To-Do": return "bg-muted text-muted-foreground";
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Completed": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    ];
    return colors[tag.length % colors.length];
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === "All" || problem.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Search</label>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50">
            <div className="col-span-6 text-sm font-medium text-foreground uppercase tracking-wide">TITLE</div>
            <div className="col-span-3 text-sm font-medium text-foreground uppercase tracking-wide">TOPIC</div>
            <div className="col-span-3 text-sm font-medium text-foreground uppercase tracking-wide">DIFFICULTY</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                <div className="col-span-6 flex items-center">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
                </div>
                <div className="col-span-3 flex items-center">
                  <Badge className={getTagColor(problem.topic)} variant="outline">
                    {problem.topic}
                  </Badge>
                </div>
                <div className="col-span-3 flex items-center">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;