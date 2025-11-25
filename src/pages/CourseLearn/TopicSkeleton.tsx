// RendererSkeleton.tsx
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import React from "react";

const SkeletonLine = ({ width = "100%" }: { width?: string }) => (
    <div
        className="animate-pulse bg-gray-700/50 rounded-md h-4"
        style={{ width }}
    ></div>
);

const SkeletonBlock = ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine key={i} width={`${90 - i * 5}%`} />
        ))}
    </div>
);

const RendererTopicSkeleton = () => {
    return (
        <div className="space-y-10">
            {/* Title */}
            <div className="animate-pulse bg-gray-700/50 h-10 w-2/3 rounded-md"></div>

            {/* Blocks */}
            <div className="space-y-12">

                {/* Subheading */}
                <div className="animate-pulse bg-gray-700/50 h-6 w-1/3 rounded-md"></div>

                {/* Paragraph */}
                <SkeletonBlock lines={4} />

                {/* Image */}
                {/* <div className="w-full flex justify-center my-6">
                    <div className="animate-pulse bg-gray-700/30 rounded-lg h-64 w-3/4"></div>
                </div> */}

                {/* Input Question */}
                {/* <div className="flex gap-4">
                    <div className="animate-pulse bg-gray-700/40 h-11 w-full rounded-md"></div>
                    <div className="animate-pulse bg-gray-700/40 h-11 w-24 rounded-md"></div>
                </div> */}

                {/* More Paragraphs */}
                <SkeletonBlock lines={4} />

            </div>
        </div>
    );
};

export default RendererTopicSkeleton;
