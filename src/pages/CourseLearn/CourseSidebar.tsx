import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SidebarProps {
    chapters: any[];
    topicMeta: any[];
    selectedTopicId: string | null;
    onSelectTopic: (id: string) => void;
}

const CourseSidebar: React.FC<SidebarProps> = ({
    chapters,
    selectedTopicId,
    onSelectTopic
}) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [completed, setCompleted] = useState<Record<string, boolean>>({});
    const [search, setSearch] = useState("");

    const toggle = (id: string) =>
        setExpanded((p) => ({ ...p, [id]: !p[id] }));

    const toggleComplete = (topicId: string) =>
        setCompleted((p) => ({ ...p, [topicId]: !p[topicId] }));

    const filterMatch = (str: string) =>
        str.toLowerCase().includes(search.toLowerCase());

    return (
        <div className="w-full md:w-80 bg-black border-r border-gray-800 flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto">
            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Input
                        placeholder="Search topic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#1c1c1c] border-gray-700 text-white"
                    />
                </div>
            </div>

            <div className="px-4 pb-8 space-y-6">
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
                                                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition",
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
                                                        completed[topic.topicId]
                                                            ? "bg-[hsl(122_97%_50%)] border-[hsl(122_97%_50%)]"
                                                            : "border-gray-500"
                                                    )}
                                                >
                                                    {completed[topic.topicId] && (
                                                        <span className="text-black text-xs font-bold">✓</span>
                                                    )}
                                                </div>

                                                <span className="text-base">{topic.title}</span>
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
    );
};

export default CourseSidebar;
