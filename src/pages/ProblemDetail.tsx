import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Share, Send, Lock } from "lucide-react";
import { fireRandomCelebration } from "@/lib/confetti";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";
import janeStreetLogo from "@/assets/jane-street-logo.png";
import citadelLogo from "@/assets/citadel-logo.png";
import drivLogo from "@/assets/driv-logo.png";
import companyLogo from "@/assets/company-logo.png";

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; message: string }>({ type: null, message: "" });
  const [shakeKey, setShakeKey] = useState(0);
  
  const isPremiumProblem = Number(id) === 60;

  // Mock problem data - in real app this would come from API
  const problem = {
    id: Number(id),
    title: "4Head I",
    difficulty: Number(id) || 1,
    topic: "Statistics",
    askedIn: [janeStreetLogo, citadelLogo, drivLogo],
    description: `Varun has 4 fair coins. He flips all 4 at once and notes the parity of each. After seeing the outcomes, he may turn over (rather than flip) any pair of coins. Note that this means a heads becomes a tails and vice versa. Varun may not turn over a single coin without turning over another. He can iterate this process as many times as he would like. If Varun plays to maximize his expected number of heads, find the expected number of heads he will have.`,
    hint1: "Think about what configurations of heads/tails are possible after any number of pair flips.",
    hint2: "Consider the parity constraints - turning over pairs preserves certain properties of the configuration.",
    solution: "The expected number of heads Varun will have is 3.\n\nExplanation:\nWhen Varun flips 4 fair coins, he gets various outcomes. The key insight is that he can always turn over pairs of coins to optimize his result. Since he wants to maximize heads, he should turn over pairs strategically.\n\nBy turning over pairs, Varun can always achieve at least 2 heads from any initial configuration. However, with optimal play, he can achieve an expected value of 3 heads through careful pair selection based on the initial outcome."
  };

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

  const getCompanyName = (logo: string) => {
    if (logo.includes('jane-street')) return 'Jane Street';
    if (logo.includes('citadel')) return 'Citadel';
    if (logo.includes('driv')) return 'Driv';
    if (logo.includes('company')) return 'Top Firm';
    return 'Company';
  };


  const handleSubmit = () => {
    const correctAnswer = "3";
    if (answer.trim() === correctAnswer) {
      setFeedback({ type: 'correct', message: "Correct answer!" });
      fireRandomCelebration();
    } else {
      setFeedback({ type: 'wrong', message: "The answer is wrong" });
      setShakeKey(prev => prev + 1);
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
              <Badge className={`${getDifficultyColor(problem.difficulty)} hidden md:flex text-center items-center justify-center`}>
                Lvl {problem.difficulty}/10
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Asked in:</span>
                <div className="flex gap-1">
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
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <TabsContent value="problem" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                {problem.title}
                {isPremiumProblem && <Lock className="h-5 w-5 text-purple-500" />}
              </h1>
              
              {isPremiumProblem ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Unlock Premium Access</h2>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Upgrade to Premium to gain access to this exclusive content. With Premium, you'll delve deeper into the knowledge base and enjoy a seamless learning experience. Upgrade now to expand your horizons!
                  </p>
                  <Button 
                    onClick={() => navigate('/premium')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              ) : (
              <div className="prose prose-invert max-w-none">
                  <p className="text-white leading-relaxed whitespace-pre-line text-lg">
                    {problem.description}
                  </p>
                </div>
              )}
            </div>

            {!isPremiumProblem && (
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
                    <div 
                      key={shakeKey}
                      className={`text-sm font-medium ${
                        feedback.type === 'correct' ? 'text-green-400' : 'text-red-400 animate-shake'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solution" className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                {problem.title}
                {isPremiumProblem && <Lock className="h-5 w-5 text-purple-500" />}
              </h1>
              
              {isPremiumProblem ? (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Unlock Premium Access</h2>
                  <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                    Upgrade to Premium to gain access to this exclusive content. With Premium, you'll delve deeper into the knowledge base and enjoy a seamless learning experience. Upgrade now to expand your horizons!
                  </p>
                  <Button 
                    onClick={() => navigate('/premium')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="hint1" className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                      Hint 1
                    </AccordionTrigger>
                    <AccordionContent className="text-white leading-relaxed text-lg">
                      {problem.hint1}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="hint2" className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary data-[state=open]:text-primary [&>svg]:text-white">
                      Hint 2
                    </AccordionTrigger>
                    <AccordionContent className="text-white leading-relaxed text-lg">
                      {problem.hint2}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                    <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-red-400 data-[state=open]:text-red-400 [&>svg]:text-white">
                      Solution
                    </AccordionTrigger>
                    <AccordionContent className="text-white leading-relaxed whitespace-pre-line text-lg">
                      {problem.solution}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProblemDetail;