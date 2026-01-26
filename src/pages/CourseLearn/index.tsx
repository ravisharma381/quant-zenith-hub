// CourseLearnPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import { db } from "@/firebase/config";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

import CourseSidebar from "./CourseSidebar";
import CourseContent from "./CourseContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

const CourseLearnPage: React.FC = () => {
    const { courseId: routeCourseId, topicId: routeTopicId } =
        useParams<{ courseId?: string; topicId?: string }>();

    const [loading, setLoading] = useState(true);

    // 🔥 Firestore data
    const [chapters, setChapters] = useState<any[]>([]);
    const [topicMeta, setTopicMeta] = useState<any[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
    const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
    const [writeTimer, setWriteTimer] = useState<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();
    const { user } = useAuth();

    // 🔥 UI state (sidebar)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(
        () => window.innerWidth >= 768 // default: open on desktop
    );

    const toggleSidebar = () => setSidebarOpen((s) => !s);

    // -----------------------------
    // FETCH CHAPTERS + TOPICS
    // -----------------------------
    useEffect(() => {
        if (!routeCourseId || !user) return;

        let mounted = true;

        const load = async () => {
            setLoading(true);

            try {
                // ---------------------------
                // 1. Fetch chapters
                // ---------------------------
                const q = query(
                    collection(db, "chapters"),
                    where("courseId", "==", routeCourseId),
                    orderBy("order", "asc")
                );

                const snaps = await getDocs(q);
                if (!mounted) return;

                if (snaps.empty) {
                    setChapters([]);
                    setTopicMeta([]);
                    setSelectedTopicId(null);
                    setLoading(false);
                    return;
                }

                const chapterList = snaps.docs.map((d) => ({
                    id: d.id,
                    ...d.data()
                }));

                setChapters(chapterList);

                const flattened = chapterList.flatMap((ch: any) => {
                    const sortedTopics = [...(ch.topicMeta || [])].sort(
                        (a: any, b: any) => a.order - b.order
                    );

                    return sortedTopics.map((t: any) => ({
                        ...t,
                        chapterId: ch.id,
                        chapterTitle: ch.title
                    }));
                });

                setTopicMeta(flattened);

                // ---------------------------
                // 2. Load Progress (1 read)
                // ---------------------------
                const pid = `${user.uid}_${routeCourseId}`;

                const progressRef = doc(db, "progress", pid);
                const progressSnap = await getDoc(progressRef);

                if (!progressSnap.exists()) {
                    await setDoc(progressRef, {
                        progressId: pid,
                        userId: user.uid,
                        courseId: routeCourseId,
                        completedTopics: [],
                        updatedAt: serverTimestamp()
                    });
                    setCompletedSet(new Set<string>());
                } else {
                    const arr = progressSnap.data()?.completedTopics || [];
                    setCompletedSet(new Set<string>(arr));
                }

                // ---------------------------
                // 3. Decide initial topic
                // ---------------------------
                if (routeTopicId) {
                    setSelectedTopicId(routeTopicId);
                } else {
                    setSelectedTopicId(flattened[0]?.topicId ?? null);
                }

            } catch (err) {
                console.error("Error loading chapters:", err);
                if (mounted) {
                    setChapters([]);
                    setTopicMeta([]);
                    setSelectedTopicId(null);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [routeCourseId, user]);


    useEffect(() => {
        if (routeTopicId) {
            setSelectedTopicId(routeTopicId);
        }
    }, [routeTopicId]);

    const flushProgressUpdates = async (finalSet: Set<string>) => {
        const progressId = `${user.uid}_${routeCourseId}`;
        const progressRef = doc(db, "progress", progressId);

        await setDoc(progressRef, {
            userId: user.uid,
            courseId: routeCourseId,
            completedTopics: Array.from(finalSet),
            updatedAt: serverTimestamp(),
        }, { merge: true });

        // Clear buffer
        setPendingChanges(new Set());
    };


    const onToggleComplete = (topicId: string) => {
        if (!user || !routeCourseId) return;

        const newSet = new Set(completedSet);

        if (newSet.has(topicId)) newSet.delete(topicId);
        else newSet.add(topicId);

        // UI updates immediately
        setCompletedSet(newSet);

        // Mark change in buffer
        const updatedBuffer = new Set(pendingChanges);
        updatedBuffer.add(topicId);
        setPendingChanges(updatedBuffer);

        // reset existing timer
        if (writeTimer) clearTimeout(writeTimer);

        // schedule a batched write
        const t = setTimeout(() => flushProgressUpdates(newSet), 500);
        setWriteTimer(t);
    };



    // -----------------------------
    // RENDER
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navigation />
                <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
                    <div className="flex flex-col items-center gap-6">
                        {/* Scaling Circle */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                            <div className="w-12 h-12 rounded-full bg-primary"></div>
                        </div>

                        {/* Loading Text */}
                        <p className="text-muted-foreground text-lg font-medium">
                            Loading Chapters...
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    if (chapters.length === 0) {
        return (
            <div className="min-h-screen text-white">
                <Navigation />

                <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-3">
                            <Lock className="h-5 w-5 text-purple-400" />
                            <h2 className="text-lg font-semibold">
                                Upgrade to Premium
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-white/70 leading-relaxed">
                            This content is locked. Upgrade to Premium to access
                            1,000+ high-quality problems and in-depth courses, and
                            prepare efficiently for quant interviews.
                        </p>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            {/* <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                                onClick={() => navigate(-1)}
                            >
                                Maybe Later
                            </Button> */}

                            <Button
                                className="bg-purple-600 hover:bg-purple-700"
                                onClick={() => navigate('/premium')}
                            >
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-black">
                <Navigation closeSidebar={() => sidebarOpen && toggleSidebar()} />

                <div className="flex min-h-[calc(100vh-80px)] relative overflow-hidden">

                    {/* Mobile backdrop when sidebar is open */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={toggleSidebar}
                        />
                    )}

                    {/* ============================
                       SIDEBAR (collapsible)
                    ============================= */}
                    {sidebarOpen && (
                        <CourseSidebar
                            chapters={chapters}
                            topicMeta={topicMeta}
                            selectedTopicId={selectedTopicId}
                            toggleSidebar={toggleSidebar}
                            onSelectTopic={(id) => {
                                navigate(`/course/${routeCourseId}/learn/${id}`);
                                if (window.innerWidth < 768) toggleSidebar(); // auto-close on mobile
                            }}
                            completedSet={completedSet}
                            onToggleComplete={onToggleComplete}
                        />
                    )}

                    {/* ============================
                       MAIN CONTENT
                    ============================= */}
                    <div id="main-scroll" className={cn(
                        "flex-1 relative min-w-0",
                        sidebarOpen ? "hidden md:block" : ""
                    )}>
                        <CourseContent
                            topicMeta={topicMeta}
                            topicId={selectedTopicId}
                            sidebarOpen={sidebarOpen}
                            toggleSidebar={toggleSidebar}
                            setSelectedTopicId={setSelectedTopicId}
                        />
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default CourseLearnPage;
