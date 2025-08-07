import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Search, Menu, ChevronLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
            { id: "multinomial", title: "Multinomial Coefficient", completed: false },
            { id: "binomial", title: "Binomial Theorem", completed: false },
            { id: "stars", title: "Stars and Bars", completed: false },
          ],
          expanded: true
        },
        {
          id: "probability-theory",
          title: "Probability Theory",
          chapters: [],
          expanded: false
        },
        {
          id: "random-variables",
          title: "Random Variables",
          chapters: [],
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
    const correctAnswer = "3";
    if (answer.trim() === correctAnswer) {
      setFeedback({ type: 'correct', message: "Correct answer!" });
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
          </div>
        )
      };
    }
    
    if (selectedChapter === "multiplication") {
      return {
        title: "4 Head I",
        content: (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="problem" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-48 grid-cols-2">
                  <TabsTrigger value="problem">Problem</TabsTrigger>
                  <TabsTrigger value="solution">Solution</TabsTrigger>
                </TabsList>
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
                    <Textarea
                      placeholder="Place answer here"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="resize-none flex items-center flex-1 border-2"
                      style={{ 
                        height: '46px', 
                        minHeight: '46px', 
                        maxHeight: '46px', 
                        paddingTop: '12px', 
                        paddingBottom: '12px',
                        borderColor: '#d6d6d6'
                      }}
                    />
                    
                    <Button 
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-6 h-[46px] flex items-center gap-2 shadow-lg transition-all duration-300"
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

  const selectedContent = getSelectedChapterContent();

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
        
        
        <div className="flex">
          {/* Left Sidebar */}
          {sidebarVisible && (
            <div className="w-96 bg-black border-r border-gray-800">
              {/* Search Bar */}
              <div className="px-6 mb-1 mt-6">
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
                          onClick={() => setSelectedChapter(chapter.id)}
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
                              onClick={() => setSelectedChapter(chapter.id)}
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
            </div>
          )}

            {/* Main Content */}
          <div className="flex-1 bg-black">
            {/* Controls above lesson title */}
            <div className="px-6 pt-6 pb-4">
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
              <h1 className="text-4xl font-bold text-white">{selectedContent.title}</h1>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-8">
              <div className={cn(
                "transition-all duration-300",
                sidebarVisible ? "max-w-5xl" : "max-w-7xl"
              )}>
                {selectedContent.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CourseLearn;