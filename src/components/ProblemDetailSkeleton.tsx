import { Skeleton } from "@/components/ui/skeleton";

const ProblemDetailSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto animate-pulse px-4 py-8 space-y-8">

            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                {/* Tabs */}
                <div className="flex gap-3 w-48">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16 rounded-md" /> {/* Difficulty badge */}
                    <Skeleton className="h-6 w-28 rounded-md" /> {/* Asked in text */}
                    <Skeleton className="h-6 w-6 rounded-full" /> {/* Share button */}
                </div>
            </div>

            {/* Question text skeleton */}
            <div className="space-y-3 mb-10">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Answer input + button */}
            <div className="flex gap-4 items-center mt-12">
                <Skeleton className="h-[46px] w-full rounded-md" />
                <Skeleton className="h-[46px] w-28 rounded-md" />
            </div>

            {/* Feedback space */}
            <Skeleton className="h-4 w-32 mt-4" />

            {/* Solution / Hints accordion skeleton */}
            <div className="mt-10 space-y-4">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>

        </div>
    );
};

export default ProblemDetailSkeleton;
