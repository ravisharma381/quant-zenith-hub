import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight, Check, Lock, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  title: string;
  completed: boolean;
  locked?: boolean;
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
  
  // Sample course data - would typically come from API/state management
  const courseData = {
    "quant-interview-masterclass": {
      title: "Quant Interview Masterclass",
      sections: [
        {
          id: "probability",
          title: "Probability I",
          chapters: [
            { id: "fundamentals", title: "Fundamental Definitions", completed: false },
            { id: "multiplication", title: "Multiplication Principle", completed: false },
            { id: "combinations", title: "Combinations and Permutations", completed: false, locked: true },
            { id: "multinomial", title: "Multinomial Coefficient", completed: false, locked: true },
            { id: "binomial", title: "Binomial Theorem", completed: false, locked: true },
            { id: "stars", title: "Stars and Bars", completed: false, locked: true },
            { id: "recurrence", title: "Recurrence Relations: Fundamentals", completed: false, locked: true }
          ],
          expanded: true
        },
        {
          id: "probability2",
          title: "Probability II",
          chapters: [
            { id: "advanced", title: "Advanced Probability Concepts", completed: false, locked: true },
            { id: "distributions", title: "Probability Distributions", completed: false, locked: true }
          ],
          expanded: false
        },
        {
          id: "statistics",
          title: "Statistics & Inference",
          chapters: [
            { id: "descriptive", title: "Descriptive Statistics", completed: false, locked: true },
            { id: "hypothesis", title: "Hypothesis Testing", completed: false, locked: true }
          ],
          expanded: false
        }
      ]
    },
    "machine-learning-for-finance": {
      title: "Machine Learning for Finance",
      sections: [
        {
          id: "foundations",
          title: "ML Foundations",
          chapters: [
            { id: "intro", title: "Introduction to ML in Finance", completed: false },
            { id: "supervised", title: "Supervised Learning", completed: false },
            { id: "unsupervised", title: "Unsupervised Learning", completed: false, locked: true }
          ],
          expanded: true
        },
        {
          id: "applications",
          title: "Financial Applications",
          chapters: [
            { id: "risk", title: "Risk Management", completed: false, locked: true },
            { id: "trading", title: "Algorithmic Trading", completed: false, locked: true }
          ],
          expanded: false
        }
      ]
    }
  };

  const [sections, setSections] = useState<Section[]>(
    courseData[courseId as keyof typeof courseData]?.sections || []
  );
  const [selectedChapter, setSelectedChapter] = useState<string>("fundamentals");

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
              chapter.id === chapterId && !chapter.locked
                ? { ...chapter, completed: !chapter.completed }
                : chapter
            )
          }
        : section
    ));
  };

  const getSelectedChapterContent = () => {
    if (selectedChapter === "fundamentals") {
      return {
        title: "Fundamental Definitions",
        content: (
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              What is probability? It's a really abstract question to ask. To assign a probability to some event, 
              we must know the process/action we are performing and what we are interested in measuring 
              about this process. This leads us to the idea of experiments and their outcomes.
            </p>
            
            <div className="border-l-4 border-primary bg-primary/10 p-6 rounded-r-lg">
              <p className="text-sm text-primary font-medium mb-2">
                Definition (Experiment, Sample Point, and Sample Space):
              </p>
              <p className="text-foreground">
                An experiment is a repeatable process of observation that produces individual outcomes. 
                In probability, these outcomes are called <span className="text-yellow-400 font-medium">sample points</span>. 
                The collection of all possible sample points (outcomes) of an experiment is called the{" "}
                <span className="text-yellow-400 font-medium">sample space</span>.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              You can think of a sample space as a large box that contains every single possible outcome of 
              an experiment, and a sample point as an item inside that box that is possible to be selected as 
              a result of the experiment. Conventionally, we denote the sample space of a certain experiment 
              as the set S, and we denote sample points as elements of that set.
            </p>
          </div>
        )
      };
    }
    return {
      title: "Select a Chapter",
      content: <p className="text-muted-foreground">Select a chapter from the sidebar to view its content.</p>
    };
  };

  const totalChapters = sections.reduce((total, section) => total + section.chapters.length, 0);
  const completedChapters = sections.reduce((total, section) => 
    total + section.chapters.filter(chapter => chapter.completed).length, 0
  );
  const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const selectedContent = getSelectedChapterContent();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/course/${courseId}`)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <h1 className="text-lg font-semibold text-foreground mb-2">{currentCourse.title}</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{completedChapters}/{totalChapters}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Course Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {sections.map((section) => (
              <Collapsible 
                key={section.id} 
                open={section.expanded} 
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors">
                  <span className="font-medium text-foreground">{section.title}</span>
                  {section.expanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1">
                  {section.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={cn(
                        "flex items-center gap-3 p-3 ml-4 rounded-lg cursor-pointer transition-colors",
                        selectedChapter === chapter.id 
                          ? "bg-primary/20 border-l-4 border-primary" 
                          : "hover:bg-muted/50",
                        chapter.locked && "opacity-60 cursor-not-allowed"
                      )}
                      onClick={() => !chapter.locked && setSelectedChapter(chapter.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!chapter.locked) {
                            toggleChapterCompletion(section.id, chapter.id);
                          }
                        }}
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          chapter.completed 
                            ? "bg-primary border-primary text-background" 
                            : "border-muted-foreground hover:border-primary",
                          chapter.locked && "cursor-not-allowed"
                        )}
                        disabled={chapter.locked}
                      >
                        {chapter.completed && <Check className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex items-center gap-2 flex-1">
                        {chapter.locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        <span className={cn(
                          "text-sm",
                          selectedChapter === chapter.id ? "text-primary font-medium" : "text-foreground"
                        )}>
                          {chapter.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Course Content</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{selectedContent.title}</h1>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            {selectedContent.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;