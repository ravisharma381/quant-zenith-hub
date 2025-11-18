import React from "react";

const PlaylistsSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card border-2 border-border rounded-lg p-0 animate-pulse"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1 space-y-3">
                                    {/* Title */}
                                    <div className="h-6 w-3/4 bg-gray-700/40 rounded"></div>

                                    {/* Subheading */}
                                    <div className="h-4 w-1/2 bg-gray-700/30 rounded"></div>
                                </div>

                                {/* Right box */}
                                <div className="w-20 h-20 bg-gray-700/20 rounded-2xl ml-4 flex items-center justify-center">
                                    <div className="h-6 w-8 bg-gray-700/30 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default PlaylistsSkeleton;
