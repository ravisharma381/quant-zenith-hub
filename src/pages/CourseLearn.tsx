import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, Menu, ChevronLeft, Send, ArrowLeft, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";

import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fireRandomCelebration } from "@/lib/confetti";

interface Chapter {
  id: string;
  title: string;
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
  expanded: boolean;
}

const CourseLearn = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Course data matching the screenshot structure
  const courseData = {
    "quant-interview-masterclass": {
      title: "Quant Interview Masterclass",
      sections: [
        {
          id: "combinatorics",
          title: "Combinatorics",
          chapters: [
            { id: "fundamentals", title: "Fundamental Definitions", completed: false },
            { id: "multiplication", title: "4 Head I", completed: false },
            { id: "combinations", title: "Combinations and Permutations", completed: false },
            { id: "playlists", title: "Playlists", completed: false },
            { id: "binomial", title: "Binomial Theorem", completed: false },
            { id: "stars", title: "Stars and Bars", completed: false },
          ],
          expanded: true
        },
        {
          id: "probability-theory",
          title: "Probability Theory",
          chapters: [
            { id: "sample-spaces", title: "Sample Spaces and Events", completed: false },
            { id: "conditional-probability", title: "Conditional Probability", completed: false },
            { id: "independence", title: "Independence", completed: false },
            { id: "bayes-theorem", title: "Bayes' Theorem", completed: false },
            { id: "law-total-probability", title: "Law of Total Probability", completed: false },
            { id: "counting-methods", title: "Advanced Counting Methods", completed: false },
            { id: "probability-distributions", title: "Basic Probability Distributions", completed: false },
          ],
          expanded: false
        },
        {
          id: "random-variables",
          title: "Random Variables",
          chapters: [
            { id: "discrete-rv", title: "Discrete Random Variables", completed: false },
            { id: "continuous-rv", title: "Continuous Random Variables", completed: false },
            { id: "expectation", title: "Expectation and Variance", completed: false },
            { id: "moment-generating", title: "Moment Generating Functions", completed: false },
            { id: "joint-distributions", title: "Joint Distributions", completed: false },
            { id: "covariance-correlation", title: "Covariance and Correlation", completed: false },
            { id: "central-limit", title: "Central Limit Theorem", completed: false },
            { id: "law-large-numbers", title: "Law of Large Numbers", completed: false },
            { id: "order-statistics", title: "Order Statistics", completed: false },
          ],
          expanded: false
        }
      ]
    },
    "machine-learning-for-finance": {
      title: "Machine Learning Fundamentals",
      sections: [
        {
          id: "ml-basics",
          title: "ML Basics",
          chapters: [
            { id: "introduction", title: "Introduction to ML in Finance", completed: false },
            { id: "supervised", title: "Supervised Learning", completed: false },
            { id: "unsupervised", title: "Unsupervised Learning", completed: false },
            { id: "feature-engineering", title: "Feature Engineering", completed: false },
            { id: "model-selection", title: "Model Selection", completed: false },
          ],
          expanded: true
        },
        {
          id: "financial-applications",
          title: "Financial Applications",
          chapters: [],
          expanded: false
        },
        {
          id: "advanced-topics",
          title: "Advanced Topics",
          chapters: [],
          expanded: false
        }
      ]
    }
  };

  const [sections, setSections] = useState<Section[]>(
    courseData[courseId as keyof typeof courseData]?.sections || []
  );
  const [selectedChapter, setSelectedChapter] = useState<string>("fundamentals");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'course' | 'playlists' | 'company'>('course');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const currentCourse = courseData[courseId as keyof typeof courseData];
  if (!currentCourse) {
    return <div>Course not found</div>;
  }

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  const toggleChapterCompletion = (sectionId: string, chapterId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section, 
            chapters: section.chapters.map(chapter =>
              chapter.id === chapterId
                ? { ...chapter, completed: !chapter.completed }
                : chapter
            )
          }
        : section
    ));
  };

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: "" });


  const handleSubmit = () => {
    let correctAnswer = "";
    
    if (selectedChapter === "fundamentals") {
      correctAnswer = "4";
    } else if (selectedChapter === "multiplication") {
      correctAnswer = "3";
    }
    
    if (answer.trim() === correctAnswer) {
      setFeedback({ type: 'correct', message: "Correct answer!" });
      fireRandomCelebration();
    } else {
      setFeedback({ type: 'wrong', message: "The answer is wrong" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getSelectedChapterContent = () => {
    if (selectedChapter === "fundamentals") {
      return {
        title: "Fundamental Definitions",
        content: (
          <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
            <p>
              What is probability? It's a really abstract question to ask. To assign a probability to some event, 
              we must know the process/action we are performing and what we are interested in measuring 
              about this process. This leads us to the idea of experiments and their outcomes.
            </p>
            
            <div className="border-l-4 border-[hsl(122_97%_50%)] bg-[hsl(122_97%_50%_/_0.1)] p-6 rounded-r-lg">
              <p className="text-[hsl(122_97%_50%)] font-medium mb-3 text-lg">
                Definition (Experiment, Sample Point, and Sample Space):
              </p>
              <p className="text-white leading-relaxed text-lg">
                An experiment is a repeatable process of observation that produces individual outcomes. 
                In probability, these outcomes are called <span className="text-yellow-400 font-medium">sample points</span>. 
                The collection of all possible sample points (outcomes) of an experiment is called the{" "}
                <span className="text-yellow-400 font-medium">sample space</span>.
              </p>
            </div>

            <p>
              You can think of a sample space as a large box that contains every single possible outcome of 
              an experiment, and a sample point as an item inside that box that is possible to be selected as 
              a result of the experiment. Conventionally, we denote the sample space of a certain experiment
            </p>

            <div className="border-l-4 border-purple-500 bg-purple-500/10 p-6 rounded-r-lg">
              <p className="text-purple-400 font-medium mb-3 text-lg">
                Problem (Coin Flip Sample Space):
              </p>
              <p className="text-white leading-relaxed text-lg mb-6">
                Consider the experiment of flipping a fair coin twice. How many outcomes are in the sample space? 
                Enter your answer as a single number.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Input
                    type="text"
                    placeholder="Enter your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 h-[46px] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-purple-500"
                  />
                  
                  <Button 
                    onClick={handleSubmit}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 h-[46px] flex items-center gap-2 shadow-lg transition-all duration-300"
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </Button>
                </div>
                
                <div className="h-6 flex items-center">
                  {feedback.type && (
                    <div className={`text-sm font-medium ${
                      feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {feedback.message}
                    </div>
                  )}
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="solution" className="border border-border/30 rounded-lg px-4">
                  <AccordionTrigger className="text-purple-300 font-medium hover:no-underline hover:text-purple-400 data-[state=open]:text-purple-400 [&>svg]:text-purple-300">
                    View Solution
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed whitespace-pre-line pt-4">
                    The answer is 4.

                    Explanation:
                    When flipping a coin twice, each flip can result in either Heads (H) or Tails (T). 
                    
                    The complete sample space is: {"{HH, HT, TH, TT}"}
                    
                    This gives us 4 distinct outcomes in total. Notice that HT and TH are considered different 
                    outcomes because the order matters - the first represents heads on the first flip and tails 
                    on the second, while the second represents the opposite sequence.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )
      };
    }
    
    if (selectedChapter === "multiplication") {
      const getDifficultyColor = (difficulty: number) => {
        if (difficulty <= 3) return "bg-green-500/20 text-green-400 border-green-500/50";
        if (difficulty <= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
      };

      const problemData = {
        difficulty: 3,
        askedIn: [
          { logo: janeStreetLogo, name: "Jane Street" },
          { logo: citadelLogo, name: "Citadel" },
        ]
      };

      return {
        title: "",
        content: (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="problem" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-48 grid-cols-2">
                  <TabsTrigger value="problem">Problem</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-4">
                  <Badge className={`${getDifficultyColor(problemData.difficulty)} px-3 py-1 border`}>
                    Lvl {problemData.difficulty}/10
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Asked in:</span>
                    <div className="flex gap-2">
                      {problemData.askedIn.map((company, index) => (
                        <LogoWithSkeleton 
                          key={index}
                          src={company.logo} 
                          alt={`${company.name} logo`}
                          companyName={company.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <TabsContent value="problem" className="space-y-6">
                <div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white leading-relaxed whitespace-pre-line">
                      Varun has 4 fair coins. He flips all 4 at once and notes the parity of each. After seeing the outcomes, he may turn over (rather than flip) any pair of coins. Note that this means a heads becomes a tails and vice versa. Varun may not turn over a single coin without turning over another. He can iterate this process as many times as he would like. If Varun plays to maximize his expected number of heads, find the expected number of heads he will have.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-12">
                  <div className="flex gap-4 items-center">
                    <Input
                      type="text"
                      placeholder="Place answer here"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 h-[46px] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[hsl(122_97%_50%)]"
                    />
                    
                    <Button 
                      onClick={handleSubmit}
                      className="bg-[hsl(122_97%_50%)] hover:bg-[hsl(122_97%_45%)] text-black font-semibold px-6 h-[46px] flex items-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <Send className="h-4 w-4" />
                      Submit
                    </Button>
                  </div>
                  
                  <div className="h-6 flex items-center">
                    {feedback.type && (
                      <div className={`text-sm font-medium ${
                        feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {feedback.message}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solution" className="space-y-6">
                <div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="hint1" className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                        Hint 1
                      </AccordionTrigger>
                      <AccordionContent className="text-white leading-relaxed">
                        Think about what configurations of heads/tails are possible after any number of pair flips.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="hint2" className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                        Hint 2
                      </AccordionTrigger>
                      <AccordionContent className="text-white leading-relaxed">
                        Consider the parity constraints - turning over pairs preserves certain properties of the configuration.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                      <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                        Solution
                      </AccordionTrigger>
                      <AccordionContent className="text-white leading-relaxed whitespace-pre-line">
                        The expected number of heads Varun will have is 3.

                        Explanation:
                        When Varun flips 4 fair coins, he gets various outcomes. The key insight is that he can always turn over pairs of coins to optimize his result. Since he wants to maximize heads, he should turn over pairs strategically.

                        By turning over pairs, Varun can always achieve at least 2 heads from any initial configuration. However, with optimal play, he can achieve an expected value of 3 heads through careful pair selection based on the initial outcome.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )
      };
    }

    if (selectedChapter === "playlists") {
      return {
        title: "Company Specific Playlists",
        content: (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card
                  key={company.id}
                  className="bg-card hover:scale-105 transition-all duration-200 cursor-pointer group border-2 hover:border-primary/50"
                  onClick={() => {
                    setSelectedCompany(company.id);
                    setCurrentView('company');
                  }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {company.name} {company.number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {company.description}
                        </p>
                      </div>
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center ml-4">
                        <span className="text-3xl font-bold text-primary">{company.number}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      };
    }
    
    return {
      title: "Select a Chapter",
      content: <p className="text-gray-400 text-lg">Select a chapter from the sidebar to view its content.</p>
    };
  };

  // Filter chapters based on search term
  const filteredSections = sections.map(section => ({
    ...section,
    chapters: section.chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.chapters.length > 0 || searchTerm === "");

  // Company data for playlists
  const companies = [
    {
      id: "coin-75",
      name: "Coin",
      number: "75",
      description: "Bias the coin flip of recruiting in your favor!"
    },
    {
      id: "cards-40", 
      name: "Cards",
      number: "40",
      description: "Learn to count cards."
    },
    {
      id: "calculus-heavy",
      name: "Calculus-Heavy",
      number: "HS",
      description: "Probability meets sums and integrals."
    },
    {
      id: "advanced-50",
      name: "Advanced",
      number: "50", 
      description: "The best place to finish your probability journey!"
    },
    {
      id: "intuition-heavy",
      name: "Intuition-Heavy",
      number: "IH",
      description: "They'll call you the thinker of probability."
    },
    {
      id: "geometric-50",
      name: "Geometric",
      number: "50",
      description: "Enhance your geometric and probabilistic intuition!"
    },
    {
      id: "dice-75",
      name: "Dice",
      number: "75",
      description: "Roll the dice and take a bet on yourself."
    },
    {
      id: "quantables-hit-100",
      name: "Quantable's Hit",
      number: "100",
      description: "100 of our all-time favorite questions."
    },
    {
      id: "uniform-50",
      name: "Uniform",
      number: "50",
      description: "Not the one you wear to work."
    }
  ];

  const getCompanyTopics = (companyId: string) => {
    const topicsMap: {[key: string]: any} = {
      "coin-75": [
        {
          id: "level-1",
          title: "Level 1",
          problems: [
            { id: 1, title: "4Head I", solved: true },
            { id: 2, title: "Coinsecutive II", solved: false },
            { id: 3, title: "St. Petersburg I", solved: true },
            { id: 4, title: "60 Heads I", solved: false }
          ]
        },
        {
          id: "level-2", 
          title: "Level 2",
          problems: [
            { id: 5, title: "Coin Bias Detection", solved: false },
            { id: 6, title: "Expected Flips to HTHTH", solved: true },
            { id: 7, title: "Gambler's Ruin Variant", solved: false }
          ]
        },
        {
          id: "level-3",
          title: "Level 3", 
          problems: [
            { id: 8, title: "Optimal Stopping Coin", solved: false },
            { id: 9, title: "Secretary Problem Coins", solved: false }
          ]
        }
      ]
    };
    return topicsMap[companyId] || [];
  };


  const renderCompanyView = () => {
    const company = companies.find(c => c.id === selectedCompany);
    const topics = getCompanyTopics(selectedCompany);
    
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              setCurrentView('course');
              setSelectedChapter('playlists');
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="flex items-center gap-8 mb-12">
          {/* Logo section - 25% width */}
          <div className="w-1/4 flex-shrink-0">
            <div className="w-full aspect-square bg-primary/10 rounded-3xl flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">{company?.number}</span>
            </div>
          </div>
          
          {/* About content - 75% width */}
          <div className="flex-1">
            <p className="text-muted-foreground leading-relaxed">
              We love coins. They are such simple objects that lead to so many probability questions. The Coin 75 playlist aggregates 75 of our favorite and most impactful coin questions that will surely make you a master of the coin flip that recruiting is.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <div key={topic.id} className="border border-border rounded-lg overflow-hidden">
              <Accordion type="single" collapsible defaultValue={topic.id} className="w-full">
                <AccordionItem value={topic.id} className="border-none">
                  <AccordionTrigger className="text-white font-medium text-lg py-4 px-6 hover:no-underline hover:text-white data-[state=open]:text-white border-b border-border/30">
                    <span>{topic.title}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 px-0">
                    <div className="divide-y divide-border">
                      {topic.problems.map((problem, index) => (
                        <div key={problem.id} className="hover:bg-green-500/10 transition-colors cursor-pointer">
                          <div className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-normal text-foreground">
                                  {problem.title}
                                </h4>
                              </div>
                              <div className="flex items-center justify-center w-28">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${problem.solved 
                                    ? "text-green-400 border-green-400/30" 
                                    : "text-red-400 border-red-400/30"
                                  }`}
                                >
                                  {problem.solved ? "Solved" : "Not Solved"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getMainContent = () => {
    if (currentView === 'company') {
      return { content: renderCompanyView() };
    }
    return getSelectedChapterContent();
  };

  const selectedContent = getMainContent();

  // Get all chapters for navigation
  const allChapters = sections.flatMap(section => section.chapters);
  const currentChapterIndex = allChapters.findIndex(chapter => chapter.id === selectedChapter);
  const canGoPrevious = currentChapterIndex > 0;
  const canGoNext = currentChapterIndex < allChapters.length - 1;

  const goToPreviousChapter = () => {
    if (canGoPrevious) {
      setSelectedChapter(allChapters[currentChapterIndex - 1].id);
    }
  };

  const goToNextChapter = () => {
    if (canGoNext) {
      setSelectedChapter(allChapters[currentChapterIndex + 1].id);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-black">
        <Navigation />
        
        
        <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Sidebar */}
          {sidebarVisible && (
            <div className="w-96 bg-black border-r border-gray-800 min-h-full flex flex-col">
              {/* Search Bar */}
              <div className="px-6 mb-1 mt-6 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for lesson title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-700 text-white placeholder-gray-400"
                    style={{ backgroundColor: '#1c1c1c' }}
                  />
                </div>
              </div>

              {/* Sections */}
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {searchTerm ? (
                    // When searching, show only matching chapters without section headers
                    <div className="space-y-1">
                      {filteredSections.flatMap(section => 
                        section.chapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className={cn(
                              "flex items-center gap-4 p-3 cursor-pointer transition-all rounded-lg",
                              selectedChapter === chapter.id 
                                ? "bg-[hsl(122_97%_50%_/_0.2)] text-[hsl(122_97%_50%)]" 
                                : "text-white hover:bg-gray-800"
                            )}
                            onClick={() => {
                              setSelectedChapter(chapter.id);
                              setCurrentView('course');
                            }}
                          >
                            <div className="relative">
                              <div 
                                className={cn(
                                  "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                  chapter.completed 
                                    ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]" 
                                    : "border-gray-400"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChapterCompletion(section.id, chapter.id);
                                }}
                              >
                                {chapter.completed && (
                                  <div className="text-black text-xs font-bold">✓</div>
                                )}
                              </div>
                            </div>
                            <span className="text-base font-normal">{chapter.title}</span>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    // When not searching, show normal section structure
                    filteredSections.map((section) => (
                      <div key={section.id} className="mb-6">
                        <Collapsible 
                          open={section.expanded} 
                          onOpenChange={() => toggleSection(section.id)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-2">
                            <h3 className="text-white font-normal text-lg">{section.title}</h3>
                            {section.expanded ? (
                              <ChevronDown className="w-5 h-5 text-white" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-white" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-4">
                            {section.chapters.map((chapter) => (
                              <div
                                key={chapter.id}
                                className={cn(
                                  "flex items-center gap-4 p-3 cursor-pointer transition-all rounded-lg mb-1",
                                  selectedChapter === chapter.id 
                                    ? "bg-[hsl(122_97%_50%_/_0.2)] text-[hsl(122_97%_50%)]" 
                                    : "text-white hover:bg-gray-800"
                                )}
                                onClick={() => {
                                  setSelectedChapter(chapter.id);
                                  setCurrentView('course');
                                }}
                              >
                                <div className="relative">
                                  <div 
                                    className={cn(
                                      "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                      chapter.completed 
                                        ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]" 
                                        : "border-gray-400"
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleChapterCompletion(section.id, chapter.id);
                                    }}
                                  >
                                    {chapter.completed && (
                                      <div className="text-black text-xs font-bold">✓</div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-base font-normal">{chapter.title}</span>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

            {/* Main Content */}
          <div className="flex-1 bg-black">
            {/* Controls above lesson title */}
            <div className={cn(
              "pt-6 pb-4",
              sidebarVisible ? "px-6" : "px-16"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setSidebarVisible(!sidebarVisible)}
                      className="p-2 text-gray-400 hover:text-[hsl(122_97%_50%)] hover:bg-gray-800 rounded-md transition-colors"
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 border-gray-700">
                    <p>{sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={goToPreviousChapter}
                      disabled={!canGoPrevious}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        canGoPrevious
                          ? "text-gray-400 hover:text-[hsl(122_97%_50%)] hover:bg-gray-800"
                          : "text-gray-600 cursor-not-allowed"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 border-gray-700">
                    <p>Previous chapter</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={goToNextChapter}
                      disabled={!canGoNext}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        canGoNext
                          ? "text-gray-400 hover:text-[hsl(122_97%_50%)] hover:bg-gray-800"
                          : "text-gray-600 cursor-not-allowed"
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-900 border-gray-700">
                    <p>Next chapter</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Header */}
              {currentView === 'course' && typeof selectedContent === 'object' && 'title' in selectedContent && selectedContent.title && (
                <h1 className="text-4xl font-bold text-white">{selectedContent.title}</h1>
              )}
            </div>

            {/* Content */}
            <div className="min-h-[calc(100vh-100px)] select-none bg-black">
              <div className={cn(
                "pb-6 pt-8 bg-black",
                sidebarVisible ? "px-6" : "px-16"
              )}>
                <div className={cn(
                  "mx-auto bg-black",
                  sidebarVisible ? "max-w-5xl" : "max-w-6xl"
                )}>
                  {selectedContent.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CourseLearn;