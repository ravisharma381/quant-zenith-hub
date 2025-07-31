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
  const [selectedChapter, setSelectedChapter] = useState<string>("introduction");
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
    switch (selectedChapter) {
      case "introduction":
        return {
          title: "Course Introduction",
          content: (
            <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to Machine Learning for Finance</h2>
                <p className="text-gray-300 leading-relaxed">
                  This comprehensive course will teach you how to apply cutting-edge machine learning techniques 
                  to financial modeling, risk analysis, and algorithmic trading. You'll work with real financial 
                  data and build practical models used in the industry.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-purple-500/5 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">What You'll Learn</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Advanced ML algorithms for finance</li>
                      <li>• Python programming with scikit-learn</li>
                      <li>• Portfolio optimization techniques</li>
                      <li>• Risk management with ML</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-500/5 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Course Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• 50+ hours of content</li>
                      <li>• Real financial datasets</li>
                      <li>• Hands-on projects</li>
                      <li>• Industry certification</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-8">
                <Button 
                  size="lg" 
                  className="bg-purple-500 hover:bg-purple-600 text-background font-semibold px-12 py-6 text-lg hover:!bg-purple-600 hover:!shadow-[0_0_40px_hsl(270_91%_65%_/_0.3)]"
                  onClick={() => navigate("/course/machine-learning-for-finance/learn")}
                >
                  Start Learning Now - £299
                </Button>
              </div>
            </div>
          )
        };
      case "curriculum":
        return {
          title: "Curriculum Breakdown",
          content: (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-purple-400">Complete Curriculum</h2>
              <div className="grid gap-4">
                {[
                  { module: "Module 1", title: "ML Fundamentals", duration: "12 hours" },
                  { module: "Module 2", title: "Financial Data Analysis", duration: "10 hours" },
                  { module: "Module 3", title: "Predictive Modeling", duration: "15 hours" },
                  { module: "Module 4", title: "Portfolio Optimization", duration: "8 hours" },
                  { module: "Module 5", title: "Risk Management", duration: "5 hours" }
                ].map((item, index) => (
                  <Card key={index} className="bg-purple-500/5 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-purple-400 font-semibold">{item.module}</span>
                          <h3 className="text-white font-medium">{item.title}</h3>
                        </div>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                          {item.duration}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        };
      default:
        return {
          title: "Select a Section",
          content: <p className="text-gray-400 text-lg">Select a section from the sidebar to view enrollment details.</p>
        };
    }
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
                className="pl-10 border-gray-700 focus:border-purple-500 text-white placeholder-gray-400"
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
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">{selectedContent.title}</h1>
            {selectedContent.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLCourseEnroll;