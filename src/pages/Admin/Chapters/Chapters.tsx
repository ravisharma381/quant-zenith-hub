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
    orderBy,
    limit,
    startAt,
    startAfter,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, X, PlusCircle, ArrowLeft, ListMusic } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface TopicMeta {
    topicId: string;
    title: string;
    type: "layout" | "question" | "playlist";
    order: number;
}

interface Chapter {
    id?: string;
    courseId: string;
    title: string;
    order: number;
    isPublished: boolean;
    totalTopics?: number;
    topicMeta: TopicMeta[];
}

const AdminChapters: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [open, setOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
    const [formData, setFormData] = useState<Chapter>({
        courseId: courseId || "",
        title: "",
        order: 0,
        isPublished: true,
        topicMeta: [],
    });
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    // pagination
    const PAGE_SIZE = 10;
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [firstDoc, setFirstDoc] = useState<any>(null);
    const [pageStack, setPageStack] = useState<any[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();


    // 🔹 Fetch chapters
    useEffect(() => {
        if (!courseId) return;

        const fetchChapters = async () => {
            // Count total results (only once per load or search)
            const countSnap = await getDocs(
                query(collection(db, "chapters"), where("courseId", "==", courseId))
            );
            setTotalCount(countSnap.size);

            let q = query(
                collection(db, "chapters"),
                where("courseId", "==", courseId),
                orderBy("createdAt", "desc"),
                limit(PAGE_SIZE)
            );

            // search filter (case-insensitive substring match on title)
            if (search.trim() !== "") {
                const snap = await getDocs(
                    query(
                        collection(db, "chapters"),
                        where("courseId", "==", courseId),
                        orderBy("title")
                    )
                );

                const filtered: any = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .filter((c: any) =>
                        c.title.toLowerCase().includes(search.toLowerCase())
                    );

                setChapters(filtered);
                setLastDoc(null);
                return;
            }

            // Normal paginated fetch
            const snapshot = await getDocs(q);

            if (snapshot.docs.length > 0) {
                setFirstDoc(snapshot.docs[0]);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            }

            const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Chapter[];

            setChapters(data);
        };

        fetchChapters();
    }, [courseId, search]);


    // 🔹 Reset form on modal close/open (clean add mode)
    const handleOpenChange = (state: boolean) => {
        setOpen(state);
        if (!state) {
            // reset when modal closes
            setEditingChapter(null);
            setFormData({
                courseId: courseId || "",
                title: "",
                order: 0,
                isPublished: true,
                topicMeta: [],
            });
        }
    };

    // 🔹 Save (Add or Update)
    const handleSave = async () => {
        try {
            const { id, ...data } = formData;
            if (editingChapter) {
                await updateDoc(doc(db, "chapters", editingChapter.id!), data);
                setChapters((prev) =>
                    prev.map((ch) => (ch.id === editingChapter.id ? { ...editingChapter, ...data } : ch))
                );
                toast({ title: "✅ Chapter updated successfully" });
            } else {
                const docRef = await addDoc(collection(db, "chapters"), { ...data, createdAt: serverTimestamp(), });
                setChapters((prev) => [...prev, { id: docRef.id, ...data }]);
                toast({ title: "🎉 Chapter created successfully" });
            }

            setOpen(false);
            setEditingChapter(null);
            setFormData({
                courseId: courseId || "",
                title: "",
                order: 0,
                isPublished: true,
                topicMeta: [],
            });
        } catch (error) {
            console.error(error);
            toast({ title: "Error saving chapter", variant: "destructive" });
        }
    };

    // 🔹 Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this chapter?")) return;
        await deleteDoc(doc(db, "chapters", id));
        setChapters((prev) => prev.filter((c) => c.id !== id));
        toast({ title: "🗑️ Chapter deleted" });
    };

    // 🔹 Edit
    const openEdit = (chapter: Chapter) => {
        setEditingChapter(chapter);
        setFormData(chapter);
        setOpen(true);
    };

    const nextPage = async () => {
        if (!lastDoc) return;

        const q = query(
            collection(db, "chapters"),
            where("courseId", "==", courseId),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(PAGE_SIZE)
        );

        const snap = await getDocs(q);
        if (snap.empty) return;

        setPageStack((prev) => [...prev, firstDoc]);
        setFirstDoc(snap.docs[0]);
        setLastDoc(snap.docs[snap.docs.length - 1]);

        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Chapter[];
        setChapters(data);
    };

    const prevPage = async () => {
        if (pageStack.length === 0) return;

        const prevStart = pageStack[pageStack.length - 1];
        setPageStack((p) => p.slice(0, -1));

        const q = query(
            collection(db, "chapters"),
            where("courseId", "==", courseId),
            orderBy("createdAt", "desc"),
            startAt(prevStart),
            limit(PAGE_SIZE)
        );

        const snap = await getDocs(q);
        if (snap.empty) return;

        setFirstDoc(snap.docs[0]);
        setLastDoc(snap.docs[snap.docs.length - 1]);

        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Chapter[];
        setChapters(data);
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
                        <h1 className="text-3xl font-bold">Chapters</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/admin/course/${courseId}/playlists`)}
                            className="flex items-center gap-2"
                        >
                            <ListMusic className="w-4 h-4" />
                            Playlists
                        </Button>
                        <Button
                            onClick={() => {
                                setEditingChapter(null);
                                setFormData({
                                    courseId: courseId || "",
                                    title: "",
                                    order: 0,
                                    isPublished: true,
                                    topicMeta: [],
                                });
                                setOpen(true);
                            }}
                            className="flex items-center gap-2"
                        >
                            <PlusCircle className="w-4 h-4" /> Add Chapter
                        </Button>
                    </div>
                </div>
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Total Chapters: <b>{totalCount}</b>
                        </p>
                    </div>

                    <Input
                        placeholder="Search chapters..."
                        className="w-64"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Chapter Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map((chapter) => (
                        <Card
                            onClick={() =>
                                navigate(`/admin/course/${courseId}/chapter/${chapter.id}/topics`)
                            }
                            key={chapter.id} className="relative group border hover:shadow-md transition">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                                    {chapter.title}
                                    <span className="text-xs text-muted-foreground">#{chapter.order}</span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {chapter.isPublished ? "Published" : "Draft"} •{" "}
                                    {chapter.totalTopics || 0} topics
                                </p>
                            </CardHeader>

                            <CardContent>
                                {chapter.topicMeta?.length ? (
                                    <div className="border-t pt-2 mt-2">
                                        <p className="text-sm font-medium mb-2">Topics</p>
                                        <ul className="space-y-1 max-h-36 overflow-y-auto">
                                            {chapter.topicMeta
                                                .sort((a, b) => a.order - b.order)
                                                .map((meta) => (
                                                    <li
                                                        key={meta.topicId}
                                                        className="flex justify-between text-sm border-b border-border/40 pb-1"
                                                    >
                                                        <span className="truncate w-2/3">{meta.title}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {meta.type}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No topics added yet.
                                    </p>
                                )}

                                <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
                                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openEdit(chapter) }}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(chapter.id!) }}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-6">
                    <Button variant="outline" disabled={pageStack.length === 0} onClick={prevPage}>
                        Previous
                    </Button>

                    <Button variant="outline" disabled={!lastDoc} onClick={nextPage}>
                        Next
                    </Button>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingChapter ? "Edit Chapter" : "Add Chapter"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Order</Label>
                            <Input
                                type="number"
                                value={formData.order}
                                onChange={(e) =>
                                    setFormData({ ...formData, order: Number(e.target.value) })
                                }
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Label>Published</Label>
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) =>
                                    setFormData({ ...formData, isPublished: e.target.checked })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave}>
                            {editingChapter ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminChapters;
