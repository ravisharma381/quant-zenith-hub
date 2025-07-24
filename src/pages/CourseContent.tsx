import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle, Clock, BookOpen } from "lucide-react";

const CourseContent = () => {
  const { id } = useParams();
  const [selectedLesson, setSelectedLesson] = useState("curing-the-weak-mind");

  const courseData = {
    modules: [
      {
        title: "In The Beginning",
        completed: 0,
        total: 5,
        lessons: [
          { id: "curing-the-weak-mind", title: "curing the weak mind", type: "THEORY", completed: false, current: true },
          { id: "curing-the-rigid-mind", title: "curing the rigid mind", type: "THEORY", completed: false },
          { id: "where-do-solutions-come-from", title: "where do solutions come from?", type: "THEORY", completed: false },
          { id: "the-final-step", title: "the final step", type: "THEORY", completed: false },
          { id: "so-how-to-practice", title: "so, how to practice problem-solving", type: "THEORY", completed: false }
        ]
      },
      {
        title: "Theory: Brainteasers",
        completed: 0,
        total: 7,
        lessons: [
          { id: "intro-brainteasers", title: "Introduction to Brainteasers", type: "THEORY", completed: false },
          { id: "logical-thinking", title: "Logical Thinking Patterns", type: "THEORY", completed: false },
          { id: "mathematical-puzzles", title: "Mathematical Puzzles", type: "THEORY", completed: false },
          { id: "probability-puzzles", title: "Probability Puzzles", type: "THEORY", completed: false },
          { id: "game-theory", title: "Game Theory Problems", type: "THEORY", completed: false },
          { id: "optimization", title: "Optimization Problems", type: "THEORY", completed: false },
          { id: "creative-solutions", title: "Creative Solution Techniques", type: "THEORY", completed: false }
        ]
      }
    ]
  };

  const currentLesson = {
    title: "Curing the weak mind",
    content: `Let's start with a very difficult problem. Most of you will not be able to solve it. However, try to work on it for 30 minutes. This is important—don't skip it unless you are short on time before your interviews.

## Problem 1

Alice and Bob are playing a game on the following sequence of distinct numbers [1000, 2000, 2024]. On each turn, the player selects the largest number from the sequence and replaces it with a smaller positive integer (≥ 1). Also, after the operation, the numbers must remain pairwise distinct. The player who cannot make a move loses. If Alice goes first, which player has a winning strategy?

### Analysis

This problem requires understanding game theory and optimal play strategies. The key insight is to work backwards from the end position and determine the winning and losing positions.

### Solution Approach

1. **Identify terminal positions**: When no moves are possible
2. **Work backwards**: Determine which positions are winning vs losing
3. **Find the pattern**: Look for mathematical patterns in winning positions
4. **Apply strategy**: Use the pattern to determine optimal moves

### Key Concepts

- **Nim-like games**: This resembles variations of the classic Nim game
- **Backward induction**: Working from end states to determine optimal strategy
- **Symmetry breaking**: Understanding how to break symmetrical positions

Remember, the goal isn't just to solve this problem, but to develop the thinking patterns that will help you tackle similar problems in interviews.`
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border overflow-y-auto">
        {/* Course Navigation Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center mb-2">
            <input 
              type="text" 
              placeholder="Search for lesson title"
              className="w-full px-3 py-2 bg-muted border border-border rounded text-sm"
            />
          </div>
        </div>

        {/* Module List */}
        <div className="p-4 space-y-4">
          {courseData.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                    module.completed === module.total ? 'bg-primary border-primary' : 'border-muted-foreground'
                  }`}>
                    {module.completed === module.total && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <h3 className="font-medium text-foreground">{module.title}</h3>
                </div>
                <span className="text-sm text-muted-foreground">{module.completed}/{module.total}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              
              {/* Lessons */}
              <div className="ml-9 space-y-1">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className={`flex items-center py-2 px-3 rounded cursor-pointer hover:bg-muted/50 ${
                      selectedLesson === lesson.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      lesson.completed ? 'bg-primary' : 'border border-muted-foreground'
                    }`}>
                      {lesson.completed && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{lesson.title}</div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {lesson.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-muted-foreground text-sm">{currentLesson.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Expand
            </Button>
            <Button size="sm">
              Complete & Continue →
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-8">{currentLesson.title}</h1>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {currentLesson.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex items-center gap-4">
              <Button>Mark as Complete</Button>
              <Button variant="outline">Take Notes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;