import { Badge } from "@/components/ui/badge";
import { Share, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fireRandomCelebration } from "@/lib/confetti";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";

/* --- KaTeX for math rendering --- */
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";

function renderRichCMS(text?: string | null) {
    if (!text) return null;

    // normalize single quotes → double
    let normalized = text.replace(
        /(\b(class(Name)?)\s*=\s*)'([^']*)'/gi,
        `$1"$4"`
    );

    // convert class= → className=
    normalized = normalized.replace(/\bclass=/gi, "className=");

    /**
     * IMPORTANT:
     * - Match $$...$$ or $...$ ONLY if $ is NOT escaped
     * - Also match <img />
     */
    const tokenRegex =
        /((?<!\\)\$\$[\s\S]+?(?<!\\)\$\$|(?<!\\)\$[^$]+?(?<!\\)\$|<img\b[^>]*>)/g;

    const parts = normalized.split(tokenRegex).filter(Boolean);

    return parts.map((part, idx) => {
        // ---------- BLOCK MATH ----------
        if (
            part.startsWith("$$") &&
            part.endsWith("$$")
        ) {
            return (
                <div key={idx} className="my-4">
                    <TeX block>{part.slice(2, -2)}</TeX>
                </div>
            );
        }

        // ---------- INLINE MATH ----------
        if (
            part.startsWith("$") &&
            part.endsWith("$")
        ) {
            return <TeX key={idx}>{part.slice(1, -1)}</TeX>;
        }

        // ---------- IMAGE ----------
        if (part.trim().startsWith("<img")) {
            const src = (part.match(/src="([^"]+)"/i) || [])[1] || "";
            const cls = (part.match(/className="([^"]*)"/i) || [])[1] || "";
            const alt = (part.match(/alt="([^"]*)"/i) || [])[1] || "";
            const caption = (part.match(/caption="([^"]*)"/i) || [])[1] || "";

            return (
                <div
                    key={idx}
                    className="my-2 flex flex-col items-center text-center"
                >
                    <img
                        src={src}
                        alt={alt}
                        className={`max-w-${cls || "sm"}`}
                    />
                    {caption && (
                        <div className="text-sm text-gray-400 mt-2 whitespace-pre-line">
                            {caption}
                        </div>
                    )}
                </div>
            );
        }

        // ---------- PLAIN TEXT ----------
        // Unescape \$ → $
        const textPart = part.replace(/\\\$/g, "$");

        return (
            <span key={idx} className="whitespace-pre-line">
                {textPart}
            </span>
        );
    });
}



const QuestionLayout = ({ topic, markAsCompleted, isUser, isProblemsPage = false }: { topic: any, markAsCompleted?: () => void, isUser?: boolean, isProblemsPage?: boolean }) => {

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
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    // ---- ANSWER CHECK ----
    const isCorrect = () => {
        const expected = Number((topic.answer ?? "").trim());
        const user = Number(answer.trim());
        let value = false

        if (!Number.isNaN(expected) && !Number.isNaN(user)) {
            const epsilon = Math.max(0.02 * Math.abs(expected), 1e-9);
            value = Math.abs(user - expected) <= epsilon;
        } else {
            value = answer.trim() === (topic.answer ?? "").trim();
        }
        if (value && markAsCompleted) {
            markAsCompleted();
        }
        return value
    };

    const handleSubmit = () => {
        if (!isUser && isProblemsPage) {
            navigate("/signup");
            return
        }
        if (isCorrect()) {
            setFeedback({ type: "correct", message: "Correct answer!" });
            fireRandomCelebration();
        } else {
            setFeedback({ type: "wrong", message: "Wrong answer" });
            setShakeKey(k => k + 1);
            if (navigator.vibrate) {
                navigator.vibrate(0);
                navigator.vibrate([0, 200]);
            }
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) { }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") handleSubmit();
    };

    const level = Number(topic.difficulty ?? 1);

    const getDifficultyColor = (difficulty: number) => {
        if (difficulty <= 3)
            return "bg-green-500/20 text-green-400 border-green-500/30";
        if (difficulty <= 6)
            return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
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

                        <Badge
                            className={`${difficultyClass} hidden md:flex text-center items-center justify-center`}
                        >
                            Lvl {level}/10
                        </Badge>

                        {/* Asked in */}
                        {Array.isArray(topic.askedIn) && topic.askedIn.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Asked in:</span>
                                <div className="flex gap-1 md:gap-2">
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

                        <div className="relative">
                            <Button variant="ghost" size="icon" onClick={handleShare}>
                                <Share className="h-5 w-5" />
                            </Button>
                            {copied && (
                                <div className="absolute top-10 right-0 text-xs bg-black/80 px-2 py-1 rounded text-white">
                                    Copied!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PROBLEM TAB */}
                <TabsContent value="problem" className="space-y-6">
                    <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                        {topic.title}
                    </h1>

                    {/* Problem description */}
                    <div className="prose prose-invert max-w-none">
                        <div className="text-white text-lg leading-relaxed whitespace-pre-line">
                            {renderRichCMS(topic.question)}
                        </div>
                    </div>

                    {/* Answer Input */}
                    {topic.answer !== "" && (
                        <div className="space-y-4 mt-12">
                            <div className="flex gap-4 items-center">

                                <Input
                                    key={shakeKey}
                                    placeholder="Place answer here"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 h-[46px] border-2 border-border rounded-md bg-background
                             px-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                                />

                                <Button
                                    onClick={handleSubmit}
                                    className="bg-primary hover:bg-primary/80 text-primary-foreground
                             font-semibold px-6 h-[46px] rounded-md flex items-center gap-2 shadow-lg"
                                >
                                    <Send className="h-4 w-4" />
                                    Submit
                                </Button>
                            </div>

                            <div className="h-6 flex items-center">
                                {feedback.type && (
                                    <div
                                        key={shakeKey}
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
                    )}
                </TabsContent>

                {/* SOLUTION TAB */}
                <TabsContent value="solution" className="space-y-6">
                    <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                        {topic.title}
                    </h1>
                    <Accordion type="single" collapsible className="w-full space-y-4">

                        { /* Render up to 5 hints, same style as before */}
                        {Array.from({ length: 5 }).map((_, i) => {
                            const hintKey = `hint${i + 1}`;
                            const hintVal = topic[hintKey];
                            if (!hintVal) return null;

                            return (
                                <AccordionItem key={hintKey} value={hintKey} className="border border-border rounded-lg px-4">
                                    <AccordionTrigger className="text-white text-lg font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                        {`Hint ${i + 1}`}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white leading-relaxed text-lg">
                                        {renderRichCMS(hintVal)}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}

                        <AccordionItem value="solution" className="border border-border rounded-lg px-4">
                            <AccordionTrigger className="text-white text-lg font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                Solution
                            </AccordionTrigger>
                            <AccordionContent className="text-white leading-relaxed text-lg">
                                {renderRichCMS(topic.solution)}
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </TabsContent>

            </Tabs>
        </div>
    );
};
export default QuestionLayout;
