import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Pencil, PlusCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select-topic";
import { useNavigate, useParams } from "react-router-dom";

interface Playlist {
    id?: string;
    heading: string;
    subheading: string;
    description: string;
    logoURL?: string;
    courseId: string;
    topicIds: string[];
    keywords: string[];
    sortOrder: number;
}

interface Topic {
    id: string;
    title: string;
    type: string;
}

const AdminPlaylists: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [open, setOpen] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Playlist>({
        heading: "",
        description: "",
        logoURL: "",
        courseId,
        topicIds: [],
        keywords: [],
        sortOrder: 0,
        subheading: ''
    });
    console.log(courseId);

    // 🔹 Fetch all playlists for this course
    useEffect(() => {
        const fetchPlaylists = async () => {
            const q = query(collection(db, "playlists"), where("courseId", "==", courseId));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Playlist[];
            setPlaylists(data.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        };
        fetchPlaylists();
    }, [courseId]);

    // 🔹 Fetch topics of type 'question' for multi-select
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const q = query(collection(db, "topics"), where("courseId", "==", courseId), where("type", "==", "question"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Topic[];
                setTopics(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, [courseId]);

    // 🔹 Save (Add or Update)
    const handleSave = async () => {
        try {
            const { id, ...data } = formData;

            if (editingPlaylist) {
                await updateDoc(doc(db, "playlists", editingPlaylist.id!), data);
                setPlaylists((prev) =>
                    prev.map((p) => (p.id === editingPlaylist.id ? { ...editingPlaylist, ...data } : p))
                );
                toast({ title: "Playlist updated successfully" });
            } else {
                const docRef = await addDoc(collection(db, "playlists"), data);
                setPlaylists((prev) => [...prev, { id: docRef.id, ...data }]);
                toast({ title: "Playlist created successfully" });
            }

            setOpen(false);
            setEditingPlaylist(null);
            setFormData({
                heading: "",
                description: "",
                subheading: "",
                logoURL: "",
                courseId,
                topicIds: [],
                keywords: [],
                sortOrder: 0,
            });
        } catch (error) {
            console.error(error);
            toast({ title: "Error saving playlist", variant: "destructive" });
        }
    };

    // 🔹 Delete playlist
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this playlist?")) return;
        await deleteDoc(doc(db, "playlists", id));
        setPlaylists((prev) => prev.filter((p) => p.id !== id));
        toast({ title: "Playlist deleted" });
    };

    // 🔹 Open for edit
    const openEdit = (playlist: Playlist) => {
        setEditingPlaylist(playlist);
        setFormData(playlist);
        setOpen(true);
    };
    const openAdd = () => {
        setFormData({
            heading: "",
            description: "",
            subheading: "",
            logoURL: "",
            courseId,
            topicIds: [],
            keywords: [],
            sortOrder: 0,
        });
        setOpen(true);
    };



    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <h1 className="text-3xl font-bold">Playlists</h1>
                    </div>
                    <Button onClick={() => openAdd()} className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" /> Add Playlist
                    </Button>
                </div>

                {/* Playlist Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id} className="relative group border border-border hover:shadow-lg transition">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{playlist.heading}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {playlist.topicIds?.length || 0} questions linked
                                </p>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {playlist.keywords?.slice(0, 4)?.map((kw, i) => (
                                        <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-md">
                                            {kw}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs text-muted-foreground mb-2">
                                    Sort Order: {playlist.sortOrder ?? 0}
                                </p>
                                <p className="text-xs text-muted-foreground mb-2">
                                    sub heading: {playlist.subheading ?? 0}
                                </p>

                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <Button size="sm" variant="outline" onClick={() => openEdit(playlist)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(playlist.id!)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create/Edit Playlist Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingPlaylist ? "Edit Playlist" : "Add Playlist"}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Heading</Label>
                            <Input
                                value={formData.heading}
                                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Sub Heading</Label>
                            <Input
                                value={formData.subheading}
                                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Logo URL</Label>
                            <Input
                                placeholder="https://example.com/logo.png"
                                value={formData.logoURL}
                                onChange={(e) => setFormData({ ...formData, logoURL: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Sort Order</Label>
                            <Input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <Label>Linked Topics</Label>
                            <MultiSelect
                                options={topics.map((t) => ({ label: t.title, value: t.id }))}
                                selected={formData.topicIds}
                                onChange={(vals) => setFormData({ ...formData, topicIds: vals })}
                            />
                        </div>

                        <div>
                            <Label>Keywords</Label>
                            <Input
                                placeholder="comma,separated,values"
                                value={formData.keywords.join(",")}
                                onChange={(e) =>
                                    setFormData({ ...formData, keywords: e.target.value.split(",").map((s) => s.trim()) })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSave}>
                            {editingPlaylist ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPlaylists;
