// PlaylistGrid.tsx
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RendererTopicSkeleton from "../TopicSkeleton";

interface playlistProps {
    playlistIds: string[];
    onBack?: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const PlaylistGrid: React.FC<playlistProps> = ({ playlistIds = [], loading, setLoading }) => {
    const navigate = useNavigate();
    const { courseId, topicId } = useParams<{ courseId?: string; topicId?: string }>();
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!playlistIds || playlistIds.length === 0) {
                    if (mounted) {
                        setPlaylists([]);
                        setLoading(false);
                    }
                    return;
                }

                // fetch playlists by id (parallel)
                const snaps = await Promise.all(playlistIds.map((id) => getDoc(doc(db, "playlists", id))));
                if (!mounted) return;

                const pls = snaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }));
                setPlaylists(pls);
            } catch (err) {
                console.error("Error loading playlists:", err);
                if (mounted) setError("Failed to load playlists");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [JSON.stringify(playlistIds)]);

    const openDetail = (playlistId: string) => {
        // navigate to playlist detail route
        if (courseId && topicId) {
            navigate(`/course/${courseId}/learn/${topicId}/playlist/${playlistId}`);
        }
    };

    if (loading) {
        return (
            <div
                className="absolute left-12 right-0 top-8"
            // className="pt-12 pb-4 px-4 md:px-6"
            >
                <RendererTopicSkeleton />
            </div>
        )
    }
    if (error) return <div className="text-red-400">{error}</div>;
    if (playlists.length === 0) return <div className="text-gray-400">No playlists attached.</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((pl) => (
                    <Card
                        key={pl.id}
                        className="
                            relative
                            bg-card
                            cursor-pointer
                            group
                            border-2
                            transition-all
                            duration-200
                            hover:border-primary/50
                            hover:-translate-y-1
                            h-[200px] sm:h-[220px]
                        "
                        onClick={() => openDetail(pl.id)}
                    >
                        {/* Top-right logo box */}
                        <div
                            className="
                                absolute
                                top-4
                                right-4
                                w-10 h-10 sm:w-12 sm:h-12
                                bg-white
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                overflow-hidden
                                z-10
                            "
                        >
                            {pl.logoURL ? (
                                <img
                                    src={pl.logoURL}
                                    alt={pl.heading}
                                    className="w-full h-full object-contain p-2"
                                />
                            ) : (
                                <span className="text-xs font-semibold text-primary">
                                    QP
                                </span>
                            )}
                        </div>

                        <CardContent
                            className="
                                p-6
                                pr-16 sm:pr-20
                                h-full
                                flex
                                flex-col
                                justify-between
                            "
                        >
                            {/* Top content */}
                            <div className="pt-1">
                                <h3
                                    className="
                                        text-lg sm:text-xl
                                        font-bold
                                        text-foreground
                                        mb-3
                                        group-hover:text-primary
                                        transition-colors
                                        line-clamp-2
                                    "
                                >
                                    {pl.heading}
                                </h3>

                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {pl.subheading}
                                </p>
                            </div>

                            {/* Bottom-fixed count */}
                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                    pt-4
                                    border-t
                                    border-border
                                "
                            >
                                <span className="text-xs text-muted-foreground">
                                    Questions
                                </span>
                                <span className="text-base font-bold text-primary">
                                    {pl.topicIds.length}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                ))}
            </div>
        </div>
    );
};

export default PlaylistGrid;
