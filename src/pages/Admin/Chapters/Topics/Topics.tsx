import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, X, PlusCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TopicModal from "./TopicModal";

interface Playlist {
    id: string;
    heading: string;
    subheading: string;
}

export interface TopicFormData {
    id?: string;
    courseId: string;
    chapterId: string;
    title: string;
    type: "layout" | "question" | "playlist";
    order: number;
    jsonContent?: string;
    question?: string;
    answer?: string;
    hint1?: string;
    hint2?: string;
    solution?: string;
    level?: string;
    playlistIds?: string[];
    askedIn?: { name: string; logoURL: string }[];
    isPublished: boolean;
}

const AdminTopics: React.FC = () => {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
    const [topics, setTopics] = useState<TopicFormData[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [open, setOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<TopicFormData | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    // ✅ Fetch topics
    useEffect(() => {
        if (!courseId || !chapterId) return;
        const fetchTopics = async () => {
            const q = query(
                collection(db, "topics"),
                where("courseId", "==", courseId),
                where("chapterId", "==", chapterId)
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as TopicFormData[];
            setTopics(data.sort((a, b) => a.order - b.order));
        };
        fetchTopics();
    }, [courseId, chapterId]);

    // ✅ Fetch playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const globalRef = collection(db, "playlists");
                const globalSnap = await getDocs(globalRef);
                let all = globalSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Playlist) }));

                if (!all.length && courseId) {
                    const nestedRef = collection(db, `courses/${courseId}/playlists`);
                    const nestedSnap = await getDocs(nestedRef);
                    all = nestedSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Playlist) }));
                }

                setPlaylists(all);
            } catch (err) {
                console.error("Error fetching playlists:", err);
            }
        };
        fetchPlaylists();
    }, [courseId]);



    // ✅ Save handler
    const handleSave = async (data: TopicFormData) => {
        try {
            const { id, ...payload } = data;
            if (id) {
                await updateDoc(doc(db, "topics", id), payload);
                setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
                toast({ title: "✅ Topic updated successfully" });
            } else {
                const docRef = await addDoc(collection(db, "topics"), payload);
                setTopics((prev) => [...prev, { ...payload, id: docRef.id }]);
                toast({ title: "🎉 Topic created successfully" });
            }
            // ✅ Reset modal state after save
            setOpen(false);
            setEditingTopic(null);
        } catch (error) {
            console.error(error);
            toast({ title: "Error saving topic", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this topic?")) return;
        await deleteDoc(doc(db, "topics", id));
        setTopics((prev) => prev.filter((t) => t.id !== id));
        toast({ title: "🗑️ Topic deleted" });
    };

    // ✅ handleEdit ensures modal state resets properly
    const handleEdit = (topic: TopicFormData) => {
        setEditingTopic(null); // clear any stale data
        setTimeout(() => {
            setEditingTopic(topic);
            setOpen(true);
        }, 0);
    };

    // ✅ handleAdd ensures fresh modal
    const handleAdd = () => {
        setEditingTopic(null);
        setTimeout(() => setOpen(true), 0);
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold">Topics</h1>
                    </div>

                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Add Topic
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="border p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-semibold">{topic.title}</h2>
                                <span className="text-xs text-muted-foreground">#{topic.order}</span>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">
                                {topic.type}
                            </p>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(topic)} // ✅ fixed edit handler
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(topic.id!)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TopicModal
                open={open}
                onOpenChange={(v) => {
                    if (!v) setEditingTopic(null); // ✅ clear state when closed
                    setOpen(v);
                }}
                onSubmit={handleSave}
                initialData={editingTopic || undefined}
                playlists={playlists}
            />
        </div>
    );
};

export default AdminTopics;
