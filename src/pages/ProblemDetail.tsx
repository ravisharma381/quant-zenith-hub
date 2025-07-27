import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Share, MoreHorizontal } from "lucide-react";

const ProblemDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");

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

  const handleSubmit = () => {
    // Handle answer submission
    console.log("Submitted answer:", answer);
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

            <div className="space-y-4">
              <Textarea
                placeholder="Place answer here"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="h-10 resize-none"
              />
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="solution" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4">{problem.title}</h1>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="hint1" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-primary font-medium hover:no-underline">
                    Hint 1
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed">
                    {problem.hint1}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="hint2" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-primary font-medium hover:no-underline">
                    Hint 2
                  </AccordionTrigger>
                  <AccordionContent className="text-white leading-relaxed">
                    {problem.hint2}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-primary font-medium hover:no-underline">
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