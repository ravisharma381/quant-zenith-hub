import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SidebarProps {
    chapters: any[];
    topicMeta: any[];
    selectedTopicId: string | null;
    onSelectTopic: (id: string) => void;
    toggleSidebar: () => void;
}

const CourseSidebar: React.FC<SidebarProps> = ({
    chapters,
    selectedTopicId,
    onSelectTopic,
    toggleSidebar
}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState("");

    const toggle = (id: string) =>
        setExpanded(p => ({ ...p, [id]: !(p[id] ?? true) }));

    const toggleComplete = (topicId: string) =>
        setCompleted((p) => ({ ...p, [topicId]: !p[topicId] }));

    const filterMatch = (str: string) =>
        str.toLowerCase().includes(search.toLowerCase());

    return (
        <div className="w-full md:w-96 bg-black border-r border-gray-800 h-[calc(100vh-80px)] flex flex-col fixed md:relative z-50 md:z-auto">
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

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    {chapters.map((chapter) => {
                        const topics = (chapter.topicMeta || []).filter((t: any) =>
                            filterMatch(t.title)
                        );

                        if (topics.length === 0) return null;

                        const isOpen = expanded[chapter.id] ?? true;

                        return (
                            <div key={chapter.id}>
                                {/* Chapter Header */}
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

                                            return (
                                                <div
                                                    key={topic.topicId}
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
                                                            "w-5 h-5 border-2 rounded bg-transparent flex items-center justify-center cursor-pointer",
                                                            completed[topic.topicId]
                                                                ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]"
                                                                : "border-gray-500"
                                                        )}
                                                    >
                                                        {completed[topic.topicId] && (
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
                </div>
            </div>
        </div>
    );
};

export default CourseSidebar;
