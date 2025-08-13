import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const CompanyPlaylist = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("Brainteasers");

  const companyData: Record<string, { name: string; description: string; icon: string; color: string }> = {
    "jane-street": {
      name: "Jane Street",
      description: "Problems commonly asked in Jane Street interviews.",
      icon: "🎯",
      color: "bg-blue-500/20"
    },
    "citadel": {
      name: "Citadel", 
      description: "Problems commonly asked in Citadel interviews.",
      icon: "🏢",
      color: "bg-blue-600/20"
    },
    // Add more companies as needed
  };

  const topics = [
    {
      id: "brainteasers",
      name: "Brainteasers",
      description: "Challenging puzzles or problems used to evaluate analytical thinking and problem-solving skills, common in quant interview assessments.",
      count: 28
    },
    {
      id: "combinatorics",
      name: "Combinatorics",
      description: "Mathematical techniques for counting and arranging, applied in complex financial calculations.",
      count: 12
    },
    {
      id: "conditional-expectation",
      name: "Conditional Expectation", 
      description: "Calculation of the expected value of a variable given certain conditions, essential for options pricing.",
      count: 8
    },
    {
      id: "conditional-probability",
      name: "Conditional Probability",
      description: "Evaluation of an event's likelihood given a prior event, key for predictive modeling in trading.",
      count: 15
    },
    {
      id: "continuous-random-variables",
      name: "Continuous Random Variables",
      description: "Analysis of variables with infinite possibilities, crucial for modeling financial markets and risk assessment.",
      count: 10
    },
    {
      id: "events",
      name: "Events",
      description: "Specific outcomes or occurrences analyzed for their impact on financial markets.",
      count: 6
    },
    {
      id: "expected-value",
      name: "Expected Value",
      description: "Calculation of a weighted average outcome, fundamental for decision-making under uncertainty.",
      count: 9
    },
    {
      id: "games",
      name: "Games",
      description: "Strategic scenarios used to assess problem-solving and strategic thinking, relevant for trading strategies.",
      count: 7
    },
    {
      id: "other",
      name: "Other",
      description: "Topics with not enough problems grouped into one section for this playlist.",
      count: 4
    }
  ];

  const problems = [
    { id: "bridge-crossing", name: "Bridge Crossing", difficulty: "Easy", locked: false },
    { id: "clock-angle-1", name: "Clock Angle I", difficulty: "Easy", locked: true },
    { id: "clock-angle-2", name: "Clock Angle II", difficulty: "Easy", locked: false },
    { id: "discard-game", name: "DisCard Game", difficulty: "Easy", locked: true },
    { id: "ferry-stops", name: "Ferry Stops", difficulty: "Easy", locked: false },
    { id: "hand-meet", name: "Hand Meet", difficulty: "Easy", locked: false },
    { id: "infected-dinner-1", name: "Infected Dinner I", difficulty: "Easy", locked: false },
    { id: "lawn-teamwork", name: "Lawn Teamwork", difficulty: "Easy", locked: true },
    { id: "least-multiple-15", name: "Least Multiple of 15", difficulty: "Easy", locked: false },
    { id: "matching-socks-1", name: "Matching Socks I", difficulty: "Easy", locked: true },
    { id: "planets-aligned", name: "Planets Aligned", difficulty: "Easy", locked: true },
    { id: "river-length", name: "River Length", difficulty: "Easy", locked: false },
    { id: "stamp-sum", name: "Stamp Sum", difficulty: "Easy", locked: false },
    { id: "windless-mile", name: "Windless Mile", difficulty: "Easy", locked: false },
    { id: "100-lights", name: "100 Lights", difficulty: "Medium", locked: false },
    { id: "digit-multiplication-1", name: "Digit Multiplication I", difficulty: "Medium", locked: false },
    { id: "digit-multiplication-2", name: "Digit Multiplication II", difficulty: "Medium", locked: true },
    { id: "distinct-date-1", name: "Distinct Date I", difficulty: "Medium", locked: false },
    { id: "distinct-date-2", name: "Distinct Date II", difficulty: "Medium", locked: false },
    { id: "horse-racing", name: "Horse Racing", difficulty: "Medium", locked: true },
    { id: "paired-pumpkins-2", name: "Paired Pumpkins II", difficulty: "Medium", locked: false },
    { id: "penny-stack", name: "Penny Stack", difficulty: "Medium", locked: true },
    { id: "poisoned-kegs-1", name: "Poisoned Kegs I", difficulty: "Medium", locked: true },
    { id: "poisoned-kegs-2", name: "Poisoned Kegs II", difficulty: "Medium", locked: true },
    { id: "poisoned-kegs-3", name: "Poisoned Kegs III", difficulty: "Medium", locked: true },
    { id: "true-statement", name: "True Statement", difficulty: "Medium", locked: false },
    { id: "infected-dinner-2", name: "Infected Dinner II", difficulty: "Hard", locked: false },
    { id: "poisoned-kegs-4", name: "Poisoned Kegs IV", difficulty: "Hard", locked: true },
    { id: "prime-subset", name: "Prime Subset", difficulty: "Hard", locked: false }
  ];

  const company = companyData[companyId || ""] || {
    name: "Company",
    description: "Problems from this company.",
    icon: "🏢",
    color: "bg-gray-500/20"
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Explore
            </button>
            
            <div className={`${company.color} rounded-lg p-6 mb-6`}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{company.icon}</div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                  <p className="text-muted-foreground mt-1">{company.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-4">Topics</h3>
                <div className="space-y-2">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.name)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedTopic === topic.name
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <span className="text-xs">{topic.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">{selectedTopic}</h2>
                  <p className="text-muted-foreground text-sm">
                    {topics.find(t => t.name === selectedTopic)?.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/problems/${problem.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="font-medium text-foreground">{problem.name}</span>
                        <span className="text-xs text-muted-foreground">{selectedTopic}</span>
                      </div>
                      <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                        {problem.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPlaylist;