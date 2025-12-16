import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SidebarProps {
    chapters: any[];
    topicMeta: any[];
    selectedTopicId: string | null;
    onSelectTopic: (id: string) => void;
    toggleSidebar: () => void;
    completedSet: Set<string>;
    onToggleComplete: (topicId: string) => void;
}

const CourseSidebar: React.FC<SidebarProps> = ({
    chapters,
    selectedTopicId,
    onSelectTopic,
    toggleSidebar,
    completedSet,
    onToggleComplete

}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState("");
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggle = (id: string) =>
        setExpanded(prev => {
            const currentlyOpen = Object.keys(prev).find(key => prev[key]);
            if (currentlyOpen === id) return {};
            return { [id]: true };
        });


    const toggleComplete = (topicId: string) => {
        onToggleComplete(topicId); // Only send id
    };

    const filterMatch = useCallback(
        (str: string) => str.toLowerCase().includes(search.toLowerCase()),
        [search]
    );

    const searchActive = search.trim().length > 0;

    const flatSearchResults = searchActive
        ? chapters.flatMap((chapter) =>
            (chapter.topicMeta || [])
                .filter((t: any) => filterMatch(t.title))
                .map((t: any) => ({
                    ...t,
                    chapterTitle: chapter.title,
                }))
        )
        : [];

    useEffect(() => {
        if (!selectedTopicId || !sidebarRef.current) return;

        const container = sidebarRef.current;
        const el = container.querySelector(`[data-topic-id="${selectedTopicId}"]`);
        if (!el) return;

        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // Calculate position relative to container
        const offset = elRect.top - containerRect.top;

        // Scroll so that selected item is ~25% from top (smooth UX)
        const targetScroll = container.scrollTop + offset - container.clientHeight * 0.25;

        container.scrollTo({
            top: targetScroll,
            behavior: "smooth",
        });
    }, [selectedTopicId]);

    useEffect(() => {
        if (!selectedTopicId) return;
        for (const chapter of chapters) {
            if (chapter.topicMeta?.some((t: any) => t.topicId === selectedTopicId)) {
                setExpanded({ [chapter.id]: true });
                return;
            }
        }
    }, [selectedTopicId, chapters]);


    return (
        <div className="w-full md:w-96 flex-shrink-0 bg-black border-r border-gray-800 h-[calc(100vh-80px)] flex flex-col fixed md:relative z-50 md:z-auto">
            <div className="flex justify-end px-4 pt-4 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-400 hover:text-[hsl(122_97%_50%)] hover:bg-gray-800 rounded-md transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
            </div>
            {/* Search */}
            <div className="px-6 mb-1 mt-2 md:mt-6 flex-shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search for lesson title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 border-gray-700 text-white placeholder-gray-400"
                        style={{ backgroundColor: '#1c1c1c' }}
                    />
                </div>
            </div>

            <div
                ref={sidebarRef}
                className="flex-1 overflow-y-auto custom-scrollbar no-scroll-reset">
                {/* <div className="p-6">
                    {chapters.map((chapter) => {
                        const topics = (chapter.topicMeta || []).filter((t: any) =>
                            filterMatch(t.title)
                        );

                        if (topics.length === 0) return null;

                        const isOpen = expanded[chapter.id] ?? false;

                        return (
                            <div key={chapter.id}>
                                <button
                                    className="w-full flex items-center justify-between text-left text-white py-2"
                                    onClick={() => toggle(chapter.id)}
                                >
                                    <span className="font-normal text-lg">{chapter.title}</span>
                                    {isOpen ? (
                                        <ChevronDown className="w-5 h-5 text-white" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-white" />
                                    )}
                                </button>

                                {isOpen && (
                                    <div className="mt-2 space-y-1 pl-2">
                                        {topics.map((topic: any) => {
                                            const active = selectedTopicId === topic.topicId;
                                            const isCompleted = completedSet.has(topic.topicId);

                                            return (
                                                <div
                                                    data-topic-id={topic.topicId}
                                                    key={topic.topicId}
                                                    className={cn(
                                                        "flex items-center gap-4 p-3 cursor-pointer transition-all rounded-lg",
                                                        active
                                                            ? "bg-[hsl(122_97%_50%_/_0.2)] text-[hsl(122_97%_50%)]"
                                                            : "text-white hover:bg-gray-800"
                                                    )}
                                                    onClick={() => onSelectTopic(topic.topicId)}
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleComplete(topic.topicId);
                                                        }}
                                                        className={cn(
                                                            "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                                            isCompleted
                                                                ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]"
                                                                : "border-gray-500"
                                                        )}
                                                    >
                                                        {isCompleted && (
                                                            <span className="text-black text-xs font-bold">✓</span>
                                                        )}
                                                    </div>

                                                    <span className="text-base font-normal">{topic.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div> */}
                <div className="p-6">
                    {searchActive ? (
                        <div className="space-y-1">
                            {flatSearchResults.map((topic) => {
                                const active = selectedTopicId === topic.topicId;
                                const isCompleted = completedSet.has(topic.topicId);

                                return (
                                    <div
                                        key={topic.topicId}
                                        data-topic-id={topic.topicId}
                                        className={cn(
                                            "flex items-center gap-4 p-3 cursor-pointer transition-all rounded-lg",
                                            active
                                                ? "bg-[hsl(122_97%_50%_/_0.2)] text-[hsl(122_97%_50%)]"
                                                : "text-white hover:bg-gray-800"
                                        )}
                                        onClick={() => onSelectTopic(topic.topicId)}
                                    >
                                        {/* Checkbox */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleComplete(topic.topicId);
                                            }}
                                            className={cn(
                                                "w-5 h-5 border-2 rounded flex items-center justify-center",
                                                isCompleted
                                                    ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]"
                                                    : "border-gray-500"
                                            )}
                                        >
                                            {isCompleted && (
                                                <span className="text-black text-xs font-bold">✓</span>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-base font-normal">{topic.title}</span>
                                            <span className="text-xs text-gray-400">
                                                {topic.chapterTitle}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {flatSearchResults.length === 0 && (
                                <div className="text-gray-500 text-sm px-2">
                                    No matching topics found
                                </div>
                            )}
                        </div>
                    ) : (
                        chapters.map((chapter) => {
                            const topics = (chapter.topicMeta || []).filter((t: any) =>
                                filterMatch(t.title)
                            );

                            if (topics.length === 0) return null;

                            const isOpen = expanded[chapter.id] ?? false;

                            return (
                                <div key={chapter.id} className="mb-6">
                                    {/* Chapter Header */}
                                    <button
                                        className="w-full flex items-center justify-between text-left text-white py-2"
                                        onClick={() => toggle(chapter.id)}
                                    >
                                        <span className="font-normal text-lg">{chapter.title}</span>
                                        {isOpen ? (
                                            <ChevronDown className="w-5 h-5" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5" />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="mt-2 space-y-1 pl-2">
                                            {topics.map((topic: any) => {
                                                const active = selectedTopicId === topic.topicId;
                                                const isCompleted = completedSet.has(topic.topicId);

                                                return (
                                                    <div
                                                        key={topic.topicId}
                                                        data-topic-id={topic.topicId}
                                                        className={cn(
                                                            "flex items-center gap-4 p-3 cursor-pointer transition-all rounded-lg  mb-1",
                                                            active
                                                                ? "bg-[hsl(122_97%_50%_/_0.2)] text-[hsl(122_97%_50%)]"
                                                                : "text-white hover:bg-gray-800"
                                                        )}
                                                        onClick={() => onSelectTopic(topic.topicId)}
                                                    >
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleComplete(topic.topicId);
                                                            }}
                                                            className={cn(
                                                                "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                                                isCompleted
                                                                    ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]"
                                                                    : "border-gray-500"
                                                            )}
                                                        >
                                                            {isCompleted && (
                                                                <span className="text-black text-xs font-bold">✓</span>
                                                            )}
                                                        </div>

                                                        <span className="text-base font-normal">{topic.title}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};

export default CourseSidebar;
