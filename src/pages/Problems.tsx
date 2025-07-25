import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";
import companyLogo from "@/assets/company-logo.png";

const Problems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const problems = [
    {
      id: 1,
      title: "Black-Scholes Options Pricing",
      difficulty: "Medium",
      topic: "Derivatives",
      askedIn: [janeStreetLogo, citadelLogo]
    },
    {
      id: 2,
      title: "Portfolio Risk Calculation",
      difficulty: "Hard",
      topic: "Risk Management",
      askedIn: [citadelLogo, drivLogo, companyLogo]
    },
    {
      id: 3,
      title: "Time Series Analysis",
      difficulty: "Easy",
      topic: "Statistics",
      askedIn: [janeStreetLogo]
    },
    {
      id: 4,
      title: "Monte Carlo Simulation",
      difficulty: "Medium",
      topic: "Quantitative Methods",
      askedIn: [citadelLogo, drivLogo]
    },
    {
      id: 5,
      title: "CAPM Beta Calculation",
      difficulty: "Easy",
      topic: "Asset Pricing",
      askedIn: [janeStreetLogo, citadelLogo, drivLogo]
    },
    {
      id: 6,
      title: "Yield Curve Construction",
      difficulty: "Hard",
      topic: "Fixed Income",
      askedIn: [companyLogo]
    }
  ];

  const topics = ["All", "Derivatives", "Risk Management", "Statistics", "Quantitative Methods", "Asset Pricing", "Fixed Income"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTopicColor = (topic: string) => {
    const colors = [
      "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    ];
    return colors[topic.length % colors.length];
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
            <div className="col-span-1 text-sm font-medium text-foreground uppercase tracking-wide">#</div>
            <div className="col-span-4 text-sm font-medium text-foreground uppercase tracking-wide">TITLE</div>
            <div className="col-span-2 text-sm font-medium text-foreground uppercase tracking-wide">TOPIC</div>
            <div className="col-span-2 text-sm font-medium text-foreground uppercase tracking-wide">DIFFICULTY</div>
            <div className="col-span-3 text-sm font-medium text-foreground uppercase tracking-wide text-center">ASKED IN</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-muted-foreground">{problem.id}</span>
                </div>
                <div className="col-span-4 flex items-center">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {problem.title}
                  </h3>
                </div>
                <div className="col-span-2 flex items-center">
                  <Badge className={getTopicColor(problem.topic)} variant="outline">
                    {problem.topic}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {problem.askedIn.map((logo, index) => (
                      <img 
                        key={index} 
                        src={logo} 
                        alt="Company logo" 
                        className="w-8 h-8 object-contain rounded"
                      />
                    ))}
                  </div>
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