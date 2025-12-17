import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import RendererTopicSkeleton from "../TopicSkeleton";

interface playlistProps {
    playlistId: string | null,
    onBack: () => void
}

const chunk = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce((acc: T[][], _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size));
        return acc;
    }, []);

const PlaylistDetail: React.FC<playlistProps> = ({ playlistId, onBack }) => {
    const { courseId, topicId } = useParams<{ courseId?: string; topicId?: string }>();
    const navigate = useNavigate();


    const [loading, setLoading] = useState(true);
    const [playlist, setPlaylist] = useState<any | null>(null);
    const [topicsMap, setTopicsMap] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                if (!playlistId) {
                    if (mounted) setError("Missing playlist id");
                    return;
                }

                const psnap = await getDoc(doc(db, "playlists", playlistId));
                if (!psnap.exists()) {
                    if (mounted) setError("Playlist not found");
                    return;
                }
                const pdata: any = { id: psnap.id, ...psnap.data() };
                if (!mounted) return;
                setPlaylist(pdata);

                const topicIds = Array.isArray(pdata.topicIds) ? pdata.topicIds.filter(Boolean) : [];

                // fetch topic docs in batches
                const map: Record<string, any> = {};
                const batches = chunk(topicIds, 10);
                for (const b of batches) {
                    const q = query(collection(db, "topics"), where("__name__", "in", b));
                    const snaps = await getDocs(q);
                    snaps.forEach((d) => {
                        map[d.id] = { id: d.id, ...d.data() };
                    });
                }

                if (!mounted) return;
                setTopicsMap(map);
            } catch (err) {
                console.error("Error loading playlist detail:", err);
                if (mounted) setError("Failed to load playlist detail");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [playlistId]);

    const topics = useMemo(() => {
        if (!playlist) return [];
        const ids = Array.isArray(playlist.topicIds) ? playlist.topicIds : [];
        return ids.map((id: string) => topicsMap[id]).filter(Boolean);
    }, [playlist, topicsMap]);

    // group by level, maintain numeric order
    const grouped = useMemo(() => {
        const g: Record<string, any[]> = {};
        topics.forEach((t: any) => {
            const lvl = (t.level ?? "1").toString();
            g[lvl] = g[lvl] || [];
            g[lvl].push(t);
        });
        const sortedKeys = Object.keys(g).sort((a, b) => Number(a) - Number(b));
        return sortedKeys.map(k => ({ level: k, items: g[k] }));
    }, [topics]);


    if (loading) return (
        <div className="">
            <RendererTopicSkeleton />
        </div>
    );
    if (error) return <div className="text-red-400 p-4">{error}</div>;
    if (!playlist) return <div className="text-gray-400 p-4">Playlist not found.</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
            </div>

            <div className="flex items-center gap-8 mb-12">
                {/* Logo section - 25% width */}
                <div className="w-1/4 flex-shrink-0">
                    <div className="w-full aspect-square bg-primary/10 rounded-3xl flex items-center justify-center">
                        <span className="text-6xl font-bold text-primary">{topics?.length}</span>
                    </div>
                </div>

                {/* About content - 75% width */}
                <div className="flex-1">
                    <p className="text-muted-foreground leading-relaxed">
                        {playlist.description}
                    </p>
                </div>
            </div>

            {grouped.length > 0 ? <div className="space-y-4">
                {grouped.map((grp) => (
                    <div key={grp.level} className="border border-border rounded-lg overflow-hidden">
                        <Accordion type="single" collapsible defaultValue={grp.level} className="w-full">
                            <AccordionItem value={grp.level} className="border-none">
                                <AccordionTrigger className="text-white font-medium text-lg py-4 px-6 hover:no-underline hover:text-white data-[state=open]:text-white border-b border-border/30">
                                    <span>{`Level ${grp.level}`}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0 px-0">
                                    <div className="divide-y divide-border">
                                        {grp.items.map((problem, index) => (
                                            <Link key={problem.id} to={`/problems/${problem.id}`} target="_blank">
                                                <div key={problem.id} className="hover:bg-green-500/10 transition-colors cursor-pointer">
                                                    <div className="px-6 py-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-normal text-foreground">
                                                                    {problem.title}
                                                                </h4>
                                                            </div>
                                                            <div className="flex items-center justify-center w-28">
                                                                <Badge
                                                                    variant="outline"
                                                                    //     className={`text-xs ${problem.solved
                                                                    //         ? "text-green-400 border-green-400/30"
                                                                    //         : "text-red-400 border-red-400/30"
                                                                    //         }`}
                                                                    // >
                                                                    //     {problem.solved ? "Solved" : "Not Solved"}
                                                                    className={`text-xs text-green-400 border-green-400/30`}
                                                                >
                                                                    {'Solve Now'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}
            </div> : <div className="text-gray-400 p-4">No topics.</div>}
        </div>
    );
};

export default PlaylistDetail;
