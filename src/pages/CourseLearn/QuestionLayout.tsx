import { Badge } from "@/components/ui/badge";
import { Share, Send, CheckCircle, Circle, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fireRandomCelebration } from "@/lib/confetti";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";

/* --- KaTeX for math rendering --- */
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";
import { ScrollContext } from "@/components/Layout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type QuestionLayoutProps = {
    topic: any;
    markAsCompleted?: () => void;
    isUser?: boolean;
    isProblemsPage?: boolean;
    isCompleted?: boolean;
    isBookmarked?: boolean;
    toggleCompleted?: () => void;
    toggleBookmark?: () => void;
    isLoggedIn?: boolean;
}

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
        /((?<!\\)\$\$[\s\S]+?(?<!\\)\$\$|(?<!\\)\$[^$]+?(?<!\\)\$|<img\b[^>]*>|<link\b[^>]*\/>)/g;

    const parts = normalized.split(tokenRegex).filter(Boolean);

    return parts.map((part, idx) => {
        // ---------- BLOCK MATH ----------
        if (
            part.startsWith("$$") &&
            part.endsWith("$$")
        ) {
            return (
                <div key={idx} className="my-4 overflow-x-auto overflow-y-hidden custom-scroll ">
                    <TeX block>{part.slice(2, -2)}</TeX>
                </div>
            );
        }

        // ---------- INLINE MATH ----------
        if (
            part.startsWith("$") &&
            part.endsWith("$")
        ) {
            return <TeX className="overflow-x-auto overflow-y-hidden custom-scroll" key={idx}>{part.slice(1, -1)}</TeX>;
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

        // ---------- LINK ----------
        if (part.trim().startsWith("<link")) {
            const href = (part.match(/href="([^"]+)"/i) || [])[1];
            const text = (part.match(/text="([^"]+)"/i) || [])[1] || href;
            const target = (part.match(/target="([^"]+)"/i) || [])[1] || "_self";

            if (!href) return null;

            return (
                <a
                    key={idx}
                    href={href}
                    target={target}
                    rel={target === "_blank" ? "noopener noreferrer" : undefined}
                    className="text-primary underline underline-offset-4 hover:text-primary/80 inline"
                >
                    {text}
                </a>
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



const QuestionLayout = ({ topic,
    markAsCompleted, isUser,
    isProblemsPage = false,
    isCompleted, isBookmarked,
    toggleCompleted, toggleBookmark,
    isLoggedIn,
}: QuestionLayoutProps) => {

    // ---- STATES ----
    const [answer, setAnswer] = useState("");
    const [shake, setShake] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "correct" | "wrong" | null;
        message: string;
    }>({
        type: null,
        message: "",
    });
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const [tab, setTab] = useState("problem");
    const scrollRef = useContext(ScrollContext);

    useEffect(() => {
        if (isProblemsPage) {
            scrollRef?.current?.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    }, [tab]);


    // ---- ANSWER CHECK ----
    const isCorrect = () => {
        const expected = Number((topic.answer ?? "").trim());
        const user = Number(answer.trim());
        let value = false

        if (!Number.isNaN(expected) && !Number.isNaN(user)) {
            // const epsilon = Math.max(0.02 * Math.abs(expected), 1e-9);
            value = expected === user
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
            setShake(true);
            setTimeout(() => setShake(false), 500);
            navigator.vibrate?.(200);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (_) {
            console.log("Failed to copy link");
        }
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

    const solutionTabs = [
        {
            value: "solution",
            label: "Solution 1",
            body: topic.solution ?? "",
            hintKeys: ["hint1", "hint2", "hint3", "hint4", "hint5"],
        },
        {
            value: "solution2",
            label: "Solution 2",
            body: topic.solution2 ?? "",
            hintKeys: ["hint21", "hint22", "hint23"],
        },
        {
            value: "solution3",
            label: "Solution 3",
            body: topic.solution3 ?? "",
            hintKeys: ["hint31", "hint32", "hint33"],
        },
    ].filter((s) => !!s.body || s.hintKeys.some((k) => !!topic[k]));

    const hasMultipleSolutions = solutionTabs.length > 1;
    const visibleSolutionTabs = solutionTabs.length > 0
        ? solutionTabs
        : [{ value: "solution", label: "Solution", body: "", hintKeys: ["hint1", "hint2", "hint3", "hint4", "hint5"] }];

    useEffect(() => {
        const valid = new Set(["problem", ...visibleSolutionTabs.map((s) => s.value)]);
        if (!valid.has(tab)) setTab("problem");
    }, [topic?.id, topic?.solution, topic?.solution2, topic?.solution3]);

    const solutionTabCount = visibleSolutionTabs.length;
    const totalTabCount = 1 + solutionTabCount;

    return (
        <div className="max-w-4xl mx-auto">

            <Tabs defaultValue="problem" className={`w-full ${isProblemsPage ? 'min-h-[90vh]' : ''}`} value={tab} onValueChange={setTab}>

                {/* ---------------- HEADER ---------------- */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
                    <TabsList
                        className={`grid h-auto w-full md:w-auto ${totalTabCount === 2
                                ? "grid-cols-2 md:w-48"
                                : totalTabCount === 3
                                    ? "grid-cols-3 md:min-w-[18rem]"
                                    : "grid-cols-2 sm:grid-cols-4 md:min-w-[24rem]"
                            }`}
                    >
                        <TabsTrigger value="problem" className="px-2 text-xs sm:px-3 sm:text-sm">
                            Problem
                        </TabsTrigger>
                        {visibleSolutionTabs.map((s, i) => (
                            <TabsTrigger key={s.value} value={s.value} className="px-2 text-xs sm:px-3 sm:text-sm">
                                {hasMultipleSolutions ? (
                                    <>
                                        <span className="sm:hidden">Sol {i + 1}</span>
                                        <span className="hidden sm:inline">{s.label}</span>
                                    </>
                                ) : (
                                    "Solution"
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">

                        <Badge
                            className={`${difficultyClass} hidden md:flex text-center items-center justify-center`}
                        >
                            Lvl {level}/10
                        </Badge>

                        {/* Asked in */}
                        {Array.isArray(topic.askedIn) && topic.askedIn.length > 0 && (
                            <div className="md:flex hidden items-center gap-2">
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

                        {isProblemsPage && isLoggedIn && <div className="flex items-center gap-1">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                                            onClick={toggleCompleted}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-red-500" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="px-2 py-1">
                                        <p>{isCompleted ? "Mark as incomplete" : "Mark as complete"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                                            onClick={toggleBookmark}
                                        >
                                            <Bookmark
                                                className={`h-5 w-5 transition-colors ${isBookmarked ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                                                    }`}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="px-2 py-1">
                                        <p>{isBookmarked ? "Remove bookmark" : "Bookmark"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>}

                        <TooltipProvider delayDuration={0}>
                            <Tooltip open={copied ? true : undefined}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Share"
                                        onClick={handleShare}
                                    >
                                        <Share className="h-5 w-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" align="center" className="px-2 py-1">
                                    <p>{copied ? "Copied!" : "Share"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                                    placeholder="Place answer here"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`flex-1 h-[46px] border-2 border-border rounded-md bg-background
                                        px-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0
                                        ${feedback.type === 'wrong'
                                            ? 'border-red-500 focus:border-red-500'
                                            : feedback.type === 'correct'
                                                ? 'border-green-500 focus:border-green-500'
                                                : ''
                                        }
                                            ${shake ? "animate-shake" : ""}
                                        `}
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
                                        className={`text-sm font-medium ${feedback.type === "correct"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {feedback.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* SOLUTION TABS */}
                {visibleSolutionTabs.map((s) => (
                    <TabsContent key={s.value} value={s.value} className="space-y-6">
                        <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                            {topic.title}
                        </h1>
                        <Accordion type="multiple" className="w-full space-y-4">
                            {s.hintKeys.map((hintKey, i) => {
                                const hintVal = topic[hintKey];
                                if (!hintVal) return null;
                                return (
                                    <AccordionItem key={hintKey} value={hintKey} className="border border-border rounded-lg px-4">
                                        <AccordionTrigger className="text-white text-lg font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                            {`Hint ${i + 1}`}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-white leading-relaxed text-lg">
                                            <div className="">{renderRichCMS(hintVal)}</div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                            {!!s.body && (
                                <AccordionItem value={s.value === "solution" ? "solution" : s.value} className="border border-border rounded-lg px-4">
                                    <AccordionTrigger className="text-white text-lg font-medium hover:no-underline hover:text-primary [&>svg]:text-white">
                                        Solution
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white leading-relaxed text-lg">
                                        <div className="">{renderRichCMS(s.body)}</div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </TabsContent>
                ))}

            </Tabs>
        </div>
    );
};
export default QuestionLayout;
