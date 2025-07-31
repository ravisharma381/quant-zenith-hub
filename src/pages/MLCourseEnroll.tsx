import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Check, Star, BookOpen, TrendingUp, Target, Users, Lightbulb, Award, Play, Search, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

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

const MLCourseEnroll = () => {
  const navigate = useNavigate();

  const enrollmentSections = [
    {
      id: "course-overview",
      title: "Course Overview",
      chapters: [
        { id: "fundamentals", title: "Fundamental Definitions", completed: false },
        { id: "introduction", title: "Course Introduction", completed: false },
        { id: "curriculum", title: "Curriculum Breakdown", completed: false },
        { id: "prerequisites", title: "Prerequisites", completed: false },
        { id: "learning-path", title: "Learning Path", completed: false },
      ],
      expanded: true
    },
    {
      id: "enrollment-process",
      title: "Enrollment Process",
      chapters: [
        { id: "pricing", title: "Pricing & Plans", completed: false },
        { id: "payment", title: "Payment Options", completed: false },
        { id: "access", title: "Course Access", completed: false },
        { id: "support", title: "Student Support", completed: false },
      ],
      expanded: false
    },
    {
      id: "course-features",
      title: "Course Features",
      chapters: [
        { id: "projects", title: "Hands-on Projects", completed: false },
        { id: "datasets", title: "Real Financial Data", completed: false },
        { id: "tools", title: "ML Tools & Libraries", completed: false },
        { id: "certificate", title: "Completion Certificate", completed: false },
      ],
      expanded: false
    }
  ];

  const [sections, setSections] = useState<Section[]>(enrollmentSections);
  const [selectedChapter, setSelectedChapter] = useState<string>("fundamentals");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
            
            <div className="border-l-4 border-purple-500 bg-purple-500/10 p-6 rounded-r-lg">
              <p className="text-purple-500 font-medium mb-3 text-lg">
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

  // Filter chapters based on search term
  const filteredSections = sections.map(section => ({
    ...section,
    chapters: section.chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.chapters.length > 0 || searchTerm === "");

  const selectedContent = getSelectedChapterContent();

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-96 bg-black border-r border-gray-800">
          {/* Search Bar */}
          <div className="px-6 mb-1 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search enrollment topics"
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
                          ? "bg-purple-500/20 text-purple-400" 
                          : "text-white hover:bg-gray-800"
                      )}
                      onClick={() => setSelectedChapter(chapter.id)}
                    >
                      <div className="relative">
                        <div 
                          className={cn(
                            "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                            chapter.completed 
                              ? "bg-purple-500 border-purple-500" 
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
                              ? "bg-purple-500/20 text-purple-400" 
                              : "text-white hover:bg-gray-800"
                          )}
                          onClick={() => setSelectedChapter(chapter.id)}
                        >
                          <div className="relative">
                            <div 
                              className={cn(
                                "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                chapter.completed 
                                  ? "bg-purple-500 border-purple-500" 
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

export default MLCourseEnroll;