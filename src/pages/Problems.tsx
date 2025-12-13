import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock, CheckCircle, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";
import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";
import companyLogo from "@/assets/company-logo.png";

const Problems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const TOTAL_PAGES = 60;
  const PROBLEMS_PER_PAGE = 20;
  const FREE_PAGES = 3; // Pages 1-3 are free, 4-60 are locked

  // Generate 1200 problems (60 pages × 20 problems each)
  const allProblems = Array.from({ length: TOTAL_PAGES * PROBLEMS_PER_PAGE }, (_, i) => {
    const topics = ["Derivatives", "Risk Management", "Statistics", "Quantitative Methods", "Asset Pricing", "Fixed Income"];
    const logos = [janeStreetLogo, citadelLogo, drivLogo, companyLogo];
    const problemTitles = [
      "Black-Scholes Options Pricing",
      "Portfolio Risk Calculation",
      "Time Series Analysis",
      "Monte Carlo Simulation",
      "CAPM Beta Calculation",
      "Yield Curve Construction",
      "VaR Estimation",
      "Greeks Calculation",
      "Credit Risk Modeling",
      "Volatility Surface Construction",
      "Interest Rate Swap Pricing",
      "FX Forward Pricing",
      "Bond Duration Analysis",
      "Sharpe Ratio Optimization",
      "Factor Model Construction",
      "Covariance Matrix Estimation",
      "Exotic Options Pricing",
      "Stochastic Volatility Models",
      "Jump Diffusion Models",
      "Copula Methods"
    ];
    
    // Mock completion status - some problems are done
    const isCompleted = [1, 3, 5, 7, 12, 15, 18, 22, 25, 30, 35, 40, 42, 48].includes(i + 1);
    
    return {
      id: i + 1,
      title: problemTitles[i % problemTitles.length],
      difficulty: (i % 10) + 1,
      topic: topics[i % topics.length],
      askedIn: logos.slice(0, (i % 3) + 1),
      completed: isCompleted
    };
  });

  const topics = ["All", "Derivatives", "Risk Management", "Statistics", "Quantitative Methods", "Asset Pricing", "Fixed Income"];
  const difficulties = ["All", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"];

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 1 && difficulty <= 3) {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    } else if (difficulty >= 4 && difficulty <= 6) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    } else if (difficulty >= 7 && difficulty <= 10) {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }
    return "bg-muted text-muted-foreground";
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

  const getCompanyName = (logo: string) => {
    if (logo.includes('jane-street')) return 'Jane Street';
    if (logo.includes('citadel')) return 'Citadel';
    if (logo.includes('driv')) return 'Driv';
    if (logo.includes('company')) return 'Top Firm';
    return 'Company';
  };

  // Filter all problems first
  const filteredProblems = allProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === "All" || problem.topic === selectedTopic;
    const matchesDifficulty = selectedDifficulty === "All" || 
      `Level ${problem.difficulty}` === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  // Get problems for current page
  const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(startIndex, startIndex + PROBLEMS_PER_PAGE);

  const handlePageClick = (page: number) => {
    if (page > FREE_PAGES) {
      setShowUpgradeDialog(true);
    } else {
      setCurrentPage(page);
    }
  };

  const isPageLocked = (page: number) => page > FREE_PAGES;

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const showPages = [1, 2, 3, 4, 5];
    
    showPages.forEach((page) => {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={currentPage === page}
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page);
            }}
            className={`relative ${isPageLocked(page) ? 'opacity-70' : ''}`}
          >
            {page}
            {isPageLocked(page) && (
              <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />
            )}
          </PaginationLink>
        </PaginationItem>
      );
    });

    items.push(
      <PaginationItem key="ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );

    items.push(
      <PaginationItem key={TOTAL_PAGES}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageClick(TOTAL_PAGES);
          }}
          className="relative opacity-70"
        >
          {TOTAL_PAGES}
          <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

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
            <div className="col-span-3 md:col-span-3 text-sm font-medium text-foreground uppercase tracking-wide">TITLE</div>
            <div className="hidden md:block md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide">TOPIC</div>
            <div className="col-span-2 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">DIFFICULTY</div>
            <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">ASKED IN</div>
            <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">STATUS</div>
          </div>
          
          {/* Table Body */}
          <div className="divide-y divide-border">
            {currentProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => navigate(`/problems/${problem.id}`)}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-1 flex items-center">
                    <span className="text-muted-foreground">{problem.id}</span>
                  </div>
                  <div className="col-span-3 md:col-span-3 flex items-center gap-2">
                    {problem.id === 60 && (
                      <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {problem.title}
                    </h3>
                  </div>
                  <div className="hidden md:block md:col-span-2 flex items-center justify-center">
                    <Badge className={`${getTopicColor(problem.topic)} text-center inline-flex items-center justify-center px-2 py-1`} variant="outline">
                      {problem.topic}
                    </Badge>
                  </div>
                  <div className="col-span-2 md:col-span-2 flex items-center justify-center">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`${getDifficultyColor(problem.difficulty)} hover:scale-110 transition-transform cursor-default inline-flex items-center rounded-full border px-3 md:px-5 py-0.5 text-xs md:text-sm font-semibold`}>
                            {problem.difficulty}/10
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" sideOffset={8} className="text-center">
                          <p>We have 10 difficulty levels, this problem is level {problem.difficulty}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                    <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                      {problem.askedIn.map((logo, index) => (
                        <LogoWithSkeleton
                          key={index}
                          src={logo}
                          alt="Company logo"
                          companyName={getCompanyName(logo)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                    {problem.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageClick(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < FREE_PAGES) {
                      handlePageClick(currentPage + 1);
                    } else {
                      setShowUpgradeDialog(true);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription>
              This content is locked. Upgrade to Premium to access all 1200+ problems and unlock your full potential in quant finance interviews.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Maybe Later
            </Button>
            <Button onClick={() => navigate('/premium')}>
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Problems;
