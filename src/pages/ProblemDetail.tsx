import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Share, MoreHorizontal, Send } from "lucide-react";
import confetti from "canvas-confetti";

const ProblemDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: "" });

  // Mock problem data - in real app this would come from API
  const problem = {
    id: Number(id),
    title: "4Head I",
    difficulty: "Easy",
    topic: "Statistics",
    description: `Varun has 4 fair coins. He flips all 4 at once and notes the parity of each. After seeing the outcomes, he may turn over (rather than flip) any pair of coins. Note that this means a heads becomes a tails and vice versa. Varun may not turn over a single coin without turning over another. He can iterate this process as many times as he would like. If Varun plays to maximize his expected number of heads, find the expected number of heads he will have.`,
    hint1: "Think about what configurations of heads/tails are possible after any number of pair flips.",
    hint2: "Consider the parity constraints - turning over pairs preserves certain properties of the configuration.",
    solution: "The expected number of heads Varun will have is 3.\n\nExplanation:\nWhen Varun flips 4 fair coins, he gets various outcomes. The key insight is that he can always turn over pairs of coins to optimize his result. Since he wants to maximize heads, he should turn over pairs strategically.\n\nBy turning over pairs, Varun can always achieve at least 2 heads from any initial configuration. However, with optimal play, he can achieve an expected value of 3 heads through careful pair selection based on the initial outcome."
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Fire vertical confetti rain from the entire top edge
  const fireTopRain = () => {
    const columns = 16;
    for (let i = 0; i < columns; i++) {
      const x = (i + 0.5) / columns; // evenly across the top
      confetti({
        particleCount: 10,
        origin: { x, y: 0 },
        angle: 270, // straight down
        spread: 0,  // no horizontal spread
        startVelocity: 25,
        gravity: 1.1,
        drift: 0,
        scalar: 1
      });
    }
  };

  const handleSubmit = () => {
    const correctAnswer = "3";
    if (answer.trim() === correctAnswer) {
      setFeedback({ type: 'correct', message: "Correct answer!" });
      fireTopRain();
      setTimeout(fireTopRain, 200);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="problem" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-48 grid-cols-2">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="problem" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4">{problem.title}</h1>
              <div className="prose prose-invert max-w-none">
                <p className="text-white leading-relaxed whitespace-pre-line">
                  {problem.description}
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-12">
              {/* Horizontal layout for input and submit button */}
              <div className="flex gap-4 items-center">
                <Textarea
                  placeholder="Place answer here"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="resize-none flex items-center flex-1"
                  style={{ height: '46px', minHeight: '46px', maxHeight: '46px', paddingTop: '12px', paddingBottom: '12px' }}
                />
                
                <Button 
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary-glow text-primary-foreground font-semibold px-6 h-[46px] flex items-center gap-2 shadow-lg hover:shadow-glow transition-all duration-300"
                >
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
              </div>
              
              {/* Fixed height container for feedback to prevent layout shift */}
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
              <h1 className="text-2xl font-bold text-foreground mb-4">{problem.title}</h1>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="hint1" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                    Hint 1
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed">
                    {problem.hint1}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="hint2" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                    Hint 2
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed">
                    {problem.hint2}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                    Solution
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed whitespace-pre-line">
                    {problem.solution}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProblemDetail;