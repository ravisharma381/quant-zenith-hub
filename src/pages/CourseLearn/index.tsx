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
    orderBy
} from "firebase/firestore";

import CourseSidebar from "./CourseSidebar";
import CourseContent from "./CourseContent";
import { Button } from "@/components/ui/button";

const CourseLearnPage: React.FC = () => {
    const { courseId: routeCourseId, topicId: routeTopicId } =
        useParams<{ courseId?: string; topicId?: string }>();

    const [loading, setLoading] = useState(true);

    // 🔥 Firestore data
    const [chapters, setChapters] = useState<any[]>([]);
    const [topicMeta, setTopicMeta] = useState<any[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const navigate = useNavigate();

    // 🔥 UI state (sidebar)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(
        () => window.innerWidth >= 768 // default: open on desktop
    );

    const toggleSidebar = () => setSidebarOpen((s) => !s);

    // -----------------------------
    // FETCH CHAPTERS + TOPICS
    // -----------------------------
    useEffect(() => {
        if (!routeCourseId) return;

        let mounted = true;

        const load = async () => {
            setLoading(true);

            try {
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

                // Flatten topicMeta for sidebar + prev/next navigation
                const flattened = chapterList
                    .flatMap((ch: any) =>
                        (ch.topicMeta || []).map((t: any) => ({
                            ...t,
                            chapterId: ch.id,
                            chapterTitle: ch.title
                        }))
                    )

                setTopicMeta(flattened);

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
        return () => {
            mounted = false;
        };
    }, [routeCourseId]);

    useEffect(() => {
        if (routeTopicId) {
            setSelectedTopicId(routeTopicId);
        }
    }, [routeTopicId]);

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
            <div className="min-h-screen bg-black text-white">
                <Navigation />
                <div className="p-8">No chapter found in this course.</div>
                <Button onClick={() => navigate('/courses')}>Purchase To Continue</Button>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-black">
                <Navigation />

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
                        />
                    )}

                    {/* ============================
                       MAIN CONTENT
                    ============================= */}
                    <div id="main-scroll" className={`flex-1 relative ${sidebarOpen ? "hidden md:block" : ""}`}>
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
