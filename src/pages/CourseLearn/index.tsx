// CourseLearnPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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

const CourseLearnPage: React.FC = () => {
    const { courseId: routeCourseId } = useParams<{ courseId?: string }>();

    const [loading, setLoading] = useState(true);

    // 🔥 Firestore data
    const [chapters, setChapters] = useState<any[]>([]);
    const [topicMeta, setTopicMeta] = useState<any[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

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
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                setTopicMeta(flattened);

                setSelectedTopicId(flattened[0]?.topicId ?? null);
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

    // list of topicIds (for prev/next)
    const allTopicIds = useMemo(() => topicMeta.map((t) => t.topicId), [topicMeta]);

    // -----------------------------
    // RENDER
    // -----------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navigation />
                <div className="p-8">Loading chapters…</div>
            </div>
        );
    }

    if (chapters.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navigation />
                <div className="p-8">No chapter found in this course.</div>
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
                        <div className="w-full md:w-80 bg-black border-r border-gray-800 h-[calc(100vh-80px)] fixed md:relative z-50 md:z-auto">
                            <CourseSidebar
                                chapters={chapters}
                                topicMeta={topicMeta}
                                selectedTopicId={selectedTopicId}
                                onSelectTopic={(id) => {
                                    setSelectedTopicId(id);
                                    if (window.innerWidth < 768) toggleSidebar(); // auto-close on mobile
                                }}
                            />
                        </div>
                    )}

                    {/* ============================
                       MAIN CONTENT
                    ============================= */}
                    <div className={`flex-1 ${sidebarOpen ? "hidden md:block" : ""}`}>
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
