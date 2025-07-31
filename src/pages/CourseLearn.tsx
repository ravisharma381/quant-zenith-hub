import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Menu, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Navigation from "@/components/Navigation";

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
  
  // Course data matching the screenshot structure
  const courseData = {
    "quant-interview-masterclass": {
      title: "Probability I",
      sections: [
        {
          id: "combinatorics",
          title: "Combinatorics",
          chapters: [
            { id: "fundamentals", title: "Fundamental Definitions", completed: false },
            { id: "multiplication", title: "Multiplication Principle", completed: false },
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
              chapter.id === chapterId
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
    return {
      title: "Select a Chapter",
      content: <p className="text-gray-400 text-lg">Select a chapter from the sidebar to view its content.</p>
    };
  };

  const selectedContent = getSelectedChapterContent();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-96 bg-black border-r border-gray-800">
          {/* Course Title */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white mb-4">{currentCourse.title}</h1>
          </div>

          {/* Sections */}
          <div className="p-6">
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <Collapsible 
                  open={section.expanded} 
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-2">
                    <h3 className="text-white font-normal text-xl">{section.title}</h3>
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
                          <div className={cn(
                            "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center",
                            chapter.completed 
                              ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]" 
                              : "border-gray-400"
                          )}>
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
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black">
          {/* Header */}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-white">{selectedContent.title}</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="max-w-5xl">
              {selectedContent.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;