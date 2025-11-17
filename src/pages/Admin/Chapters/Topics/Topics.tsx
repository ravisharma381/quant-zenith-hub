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
    serverTimestamp,
    orderBy,
    startAt,
    limit,
    startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, X, PlusCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import TopicModal from "./TopicModal";
import { Input } from "@/components/ui/input";

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
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const PAGE_SIZE = 10;
    const [hasNext, setHasNext] = useState(true);
    const [pageStack, setPageStack] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [firstDoc, setFirstDoc] = useState<any>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [editingTopic, setEditingTopic] = useState<TopicFormData | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();
    // ✅ Fetch topics
    useEffect(() => {
        if (!courseId || !chapterId) return;

        const fetchTopics = async () => {
            // Count total
            const countSnap = await getDocs(
                query(
                    collection(db, "topics"),
                    where("courseId", "==", courseId),
                    where("chapterId", "==", chapterId)
                )
            );
            setTotalCount(countSnap.size);

            // If searching
            if (search.trim() !== "") {
                const snap = await getDocs(
                    query(
                        collection(db, "topics"),
                        where("courseId", "==", courseId),
                        where("chapterId", "==", chapterId),
                        orderBy("title")
                    )
                );

                const filtered: any = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .filter((t: any) =>
                        t.title.toLowerCase().includes(search.toLowerCase())
                    );

                setTopics(filtered);
                setHasNext(false);
                return;
            }

            // Normal paginated fetch (createdAt DESC)
            const q = query(
                collection(db, "topics"),
                where("courseId", "==", courseId),
                where("chapterId", "==", chapterId),
                orderBy("createdAt", "desc"),
                limit(PAGE_SIZE)
            );

            const snap = await getDocs(q);

            if (snap.empty) {
                setTopics([]);
                setHasNext(false);
                return;
            }

            const docs = snap.docs.map((d) => ({
                id: d.id,
                ...d.data()
            })) as TopicFormData[];

            setFirstDoc(snap.docs[0]);
            setLastDoc(snap.docs[snap.docs.length - 1]);
            setHasNext(snap.docs.length === PAGE_SIZE);

            setTopics(docs);
        };

        fetchTopics();
    }, [courseId, chapterId, search]);

    const nextPage = async () => {
        if (!lastDoc) return;

        const q = query(
            collection(db, "topics"),
            where("courseId", "==", courseId),
            where("chapterId", "==", chapterId),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(PAGE_SIZE)
        );

        const snap = await getDocs(q);

        if (snap.empty) {
            setHasNext(false);
            return;
        }

        setPageStack((prev) => [...prev, firstDoc]);
        setFirstDoc(snap.docs[0]);
        setLastDoc(snap.docs[snap.docs.length - 1]);
        setHasNext(snap.docs.length === PAGE_SIZE);

        setTopics(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TopicFormData[]);
    };

    const prevPage = async () => {
        if (pageStack.length === 0) return;

        const prevStart = pageStack[pageStack.length - 1];
        setPageStack((p) => p.slice(0, -1));

        const q = query(
            collection(db, "topics"),
            where("courseId", "==", courseId),
            where("chapterId", "==", chapterId),
            orderBy("createdAt", "desc"),
            startAt(prevStart),
            limit(PAGE_SIZE)
        );

        const snap = await getDocs(q);

        if (snap.empty) return;

        setFirstDoc(snap.docs[0]);
        setLastDoc(snap.docs[snap.docs.length - 1]);
        setHasNext(true);

        setTopics(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TopicFormData[]);
    };



    // ✅ Save handler
    const handleSave = async (data: TopicFormData) => {
        try {
            const { id, ...payload } = data;
            if (id) {
                await updateDoc(doc(db, "topics", id), payload);
                setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
                toast({ title: "✅ Topic updated successfully" });
            } else {
                const docRef = await addDoc(collection(db, "topics"), { ...payload, createdAt: serverTimestamp() });
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

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Total Topics: <b>{totalCount}</b>
                    </p>

                    <Input
                        placeholder="Search topics..."
                        className="w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                <div className="flex items-center justify-center gap-3 mt-6">
                    <Button
                        variant="outline"
                        disabled={pageStack.length === 0 || search.trim() !== ""}
                        onClick={prevPage}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!hasNext || search.trim() !== ""}
                        onClick={nextPage}
                    >
                        Next
                    </Button>
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
            />
        </div>
    );
};

export default AdminTopics;
