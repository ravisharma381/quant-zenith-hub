import { Badge } from "@/components/ui/badge";
import { Share, Send } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fireRandomCelebration } from "@/lib/confetti";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";

const QuestionLayout = ({ topic }: { topic: any }) => {

    // ---- STATES ----
    const [answer, setAnswer] = useState("");
    const [shakeKey, setShakeKey] = useState(0);
    const [feedback, setFeedback] = useState<{
        type: "correct" | "wrong" | null;
        message: string;
    }>({
        type: null,
        message: "",
    });

    // ---- ANSWER CHECK ----
    const correct = (topic.answer ?? "").toString().trim();

    const handleSubmit = () => {
        if (answer.trim() === correct) {
            setFeedback({ type: "correct", message: "Correct answer!" });
            fireRandomCelebration();
        } else {
            setFeedback({ type: "wrong", message: "Wrong answer" });
            setShakeKey(k => k + 1);
            navigator.vibrate?.(200);
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") handleSubmit();
    };

    // ---- DIFFICULTY COLOR ----
    const level = Number(topic.level ?? 1);

    const getDifficultyColor = (difficulty: number) => {
        if (difficulty <= 3) return "bg-green-500/20 text-green-400 border-green-500/50";
        if (difficulty <= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
    };

    const difficultyClass = getDifficultyColor(level);

    return (
        <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="problem" className="w-full">

                {/* ---------------- HEADER ---------------- */}
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="grid w-48 grid-cols-2">
                        <TabsTrigger value="problem">Problem</TabsTrigger>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4">

                        {/* Difficulty */}
                        <Badge className={`${difficultyClass} px-3 py-1 border`}>
                            Lvl {level}/10
                        </Badge>

                        {/* Asked In */}
                        {Array.isArray(topic.askedIn) && topic.askedIn.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Asked in:</span>
                                <div className="flex gap-2">
                                    {topic.askedIn.map((c: any, idx: number) => (
                                        <LogoWithSkeleton
                                            key={idx}
                                            src={c.logoURL}
                                            alt={c.name}
                                            companyName={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button variant="ghost" size="icon">
                            <Share className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* ---------------- PROBLEM TAB ---------------- */}
                <TabsContent value="problem" className="space-y-6">

                    {/* Problem text */}
                    <div className="prose prose-invert max-w-none">
                        <p className="text-white leading-relaxed whitespace-pre-line">
                            {topic.question}
                        </p>
                    </div>

                    {/* Answer input */}
                    <div className="space-y-4 mt-12">
                        <div className="flex gap-4 items-center">
                            <Input
                                key={shakeKey}
                                type="text"
                                placeholder="Place answer here"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className={`flex-1 h-[46px] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 
                                    ${feedback.type === "wrong" ? "border-red-500 animate-shake" : ""}
                                    ${feedback.type === "correct" ? "border-green-500" : ""}
                                `}
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
                                <div
                                    className={`text-sm font-medium ${feedback.type === "correct"
                                        ? "text-green-400"
                                        : "text-red-400 animate-shake"
                                        }`}
                                >
                                    {feedback.message}
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                {/* ---------------- SOLUTION TAB ---------------- */}
                <TabsContent value="solution" className="space-y-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">

                        {topic.hint1 && (
                            <AccordionItem value="hint1" className="border border-border rounded-lg px-4">
                                <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                    Hint 1
                                </AccordionTrigger>
                                <AccordionContent className="text-white leading-relaxed">
                                    {topic.hint1}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {topic.hint2 && (
                            <AccordionItem value="hint2" className="border border-border rounded-lg px-4">
                                <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                    Hint 2
                                </AccordionTrigger>
                                <AccordionContent className="text-white leading-relaxed">
                                    {topic.hint2}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                            <AccordionTrigger className="text-white font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                Solution
                            </AccordionTrigger>
                            <AccordionContent className="text-white leading-relaxed whitespace-pre-line">
                                {topic.solution}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>
            </Tabs>
        </div>
    );
};
export default QuestionLayout