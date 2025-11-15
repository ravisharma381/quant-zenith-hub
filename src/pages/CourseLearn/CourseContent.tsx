// CourseContent.tsx
import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import QuestionLayout from "./QuestionLayout";

import Renderer from "../Admin/Chapters/Topics/Renderer";
import { fireRandomCelebration } from "@/lib/confetti";


interface Props {
    topicMeta: any[];
    topicId: string | null;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSelectedTopicId: (id: string) => void;
}

const CourseContent: React.FC<Props> = ({
    topicMeta,
    topicId,
    sidebarOpen,
    toggleSidebar,
    setSelectedTopicId
}) => {
    const [topic, setTopic] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // -----------------------------
    // QUESTION HOOKS (must remain here)
    // -----------------------------
    const [answerInput, setAnswerInput] = useState("");
    const [feedback, setFeedback] = useState<{
        type: "correct" | "wrong" | "solution" | null;
        message: string;
    }>({ type: null, message: "" });

    const [shakeKey, setShakeKey] = useState(0);

    // -----------------------------
    // FETCH TOPIC
    // -----------------------------
    useEffect(() => {
        if (!topicId) {
            setTopic(null);
            return;
        }

        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const ref = doc(db, "topics", topicId);
                const snap = await getDoc(ref);
                if (!mounted) return;

                setTopic(snap.exists() ? { id: snap.id, ...snap.data() } : null);

                // Reset question UI state on topic change
                setAnswerInput("");
                setFeedback({ type: null, message: "" });
                setShakeKey(0);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false };
    }, [topicId]);

    // -----------------------------
    // NAVIGATION
    // -----------------------------
    const currentIndex = useMemo(
        () => topicMeta.findIndex(t => t.topicId === topicId),
        [topicMeta, topicId]
    );

    const canPrev = currentIndex > 0;
    const canNext = currentIndex !== -1 && currentIndex < topicMeta.length - 1;

    const goPrev = () => canPrev && setSelectedTopicId(topicMeta[currentIndex - 1].topicId);
    const goNext = () => canNext && setSelectedTopicId(topicMeta[currentIndex + 1].topicId);

    // -----------------------------
    // QUESTION HELPERS
    // -----------------------------
    const correctAnswer = (topic?.answer ?? "").toString().trim();
    const level = Number(topic?.level ?? 1);

    const getLevelColor = (lvl: number) => {
        if (lvl <= 3) return "bg-green-500/20 text-green-400 border-green-500/50";
        if (lvl <= 6) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
        return "bg-red-500/20 text-red-400 border-red-500/50";
    };
    const levelClass = getLevelColor(level);

    const submitAnswer = () => {
        if (answerInput.trim() === correctAnswer) {
            setFeedback({ type: "correct", message: "Correct answer!" });
            fireRandomCelebration();
        } else {
            setFeedback({ type: "wrong", message: "Wrong answer" });
            setShakeKey(k => k + 1);
            navigator.vibrate?.(200);
        }
    };

    // -----------------------------
    // EARLY STATES
    // -----------------------------
    if (!topicId || loading) {
        return (
            <div className="flex-1 bg-black text-white p-8">
                <p className="text-gray-400">{loading ? "Loading..." : "Select a topic"}</p>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="flex-1 bg-black text-white p-8">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-red-400">Topic not found.</p>
            </div>
        );
    }

    // -----------------------------
    // LAYOUT
    // -----------------------------
    const paddingClass = sidebarOpen ? "px-4 md:px-8" : "px-4 md:px-20";
    const maxWidthClass = sidebarOpen ? "max-w-4xl md:max-w-5xl" : "max-w-6xl md:max-w-7xl";

    return (
        <div className="flex-1 bg-black h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">

            {/* TOP BAR */}
            <div className={`pt-6 pb-4 ${paddingClass}`}>
                <div className="flex items-center gap-2 mb-4">

                    {/* Sidebar toggle */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 text-gray-400 hover:text-[hsl(122_97%_50%)] hover:bg-gray-800 rounded-md"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{sidebarOpen ? "Hide sidebar" : "Show sidebar"}</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Prev */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                disabled={!canPrev}
                                onClick={goPrev}
                                className={`p-2 rounded-md ${canPrev
                                    ? "text-gray-400 hover:text-green-400 hover:bg-gray-800"
                                    : "text-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>Previous topic</p></TooltipContent>
                    </Tooltip>

                    {/* Next */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                disabled={!canNext}
                                onClick={goNext}
                                className={`p-2 rounded-md ${canNext
                                    ? "text-gray-400 hover:text-green-400 hover:bg-gray-800"
                                    : "text-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>Next topic</p></TooltipContent>
                    </Tooltip>
                </div>

                {topic.type === "question" && (
                    <h1 className="text-4xl font-bold text-white">{topic.title}</h1>
                )}
            </div>

            {/* CONTENT */}
            <div className={`pb-6 pt-8 ${paddingClass}`}>
                <div className={`${maxWidthClass} mx-auto`}>

                    {/* LAYOUT TOPIC */}
                    {topic.type === "layout" && (
                        <Renderer doc={typeof topic.jsonContent === "string" ? JSON.parse(topic.jsonContent) : topic.jsonContent} />
                    )}

                    {/* QUESTION TOPIC */}
                    {topic.type === "question" && <QuestionLayout topic={topic} />}


                    {/* PLAYLIST */}
                    {topic.type === "playlist" && (
                        <p className="text-gray-400">Playlist view TBD…</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseContent;
