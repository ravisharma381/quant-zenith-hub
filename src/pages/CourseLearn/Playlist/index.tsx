// PlaylistGrid.tsx
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PlaylistGrid: React.FC<{ playlistIds: string[] }> = ({ playlistIds = [] }) => {
    const navigate = useNavigate();
    const { courseId, topicId } = useParams<{ courseId?: string; topicId?: string }>();
    const [loading, setLoading] = useState(true);
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
            <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div className="flex flex-col items-center gap-6">
                    {/* Scaling Circle */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                        <div className="w-12 h-12 rounded-full bg-primary"></div>
                    </div>

                    {/* Loading Text */}
                    <p className="text-muted-foreground text-lg font-medium">
                        Loading Playlists...
                    </p>
                </div>
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
                        className="bg-card hover:scale-105 transition-all duration-200 cursor-pointer group border-2 hover:border-primary/50"
                        onClick={() => openDetail(pl.id)}
                    >
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {pl.heading}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {pl.subheading}
                                    </p>
                                </div>
                                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center ml-4">
                                    <span className="text-3xl font-bold text-primary">{pl.topicIds.length}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PlaylistGrid;
