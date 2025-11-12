import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db, storage } from "@/firebase/config";
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select-topic"; // your multiselect component

interface PlaylistModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    courseId: string;
    playlist?: any;
    refresh: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
    open,
    setOpen,
    courseId,
    playlist,
    refresh,
}) => {
    const isEdit = Boolean(playlist);
    const { toast } = useToast();

    const [heading, setHeading] = useState(playlist?.heading || "");
    const [description, setDescription] = useState(playlist?.description || "");
    const [keywords, setKeywords] = useState<string[]>(playlist?.keywords || []);
    const [topicIds, setTopicIds] = useState<string[]>(playlist?.topicIds || []);
    const [logo, setLogo] = useState<File | null>(null);
    const [topics, setTopics] = useState<{ id: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTopics = async () => {
            const q = query(collection(db, `courses/${courseId}/topics`), where("type", "==", "question"));
            const snap = await getDocs(q);
            const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
            setTopics(data);
        };
        fetchTopics();
    }, [courseId]);

    const handleSave = async () => {
        setLoading(true);
        try {
            let logoURL = playlist?.logo || "";
            if (logo) {
                const storageRef = ref(storage, `playlist-logos/${Date.now()}_${logo.name}`);
                await uploadBytes(storageRef, logo);
                logoURL = await getDownloadURL(storageRef);
            }

            const payload = {
                heading,
                description,
                keywords,
                topicIds,
                logo: logoURL,
                updatedAt: new Date(),
            };

            if (isEdit) {
                await updateDoc(doc(db, `courses/${courseId}/playlists/${playlist.id}`), payload);
                toast({ title: "Playlist updated" });
            } else {
                await addDoc(collection(db, `courses/${courseId}/playlists`), {
                    ...payload,
                    createdAt: new Date(),
                });
                toast({ title: "Playlist created" });
            }

            setOpen(false);
            refresh();
        } catch (err) {
            console.error(err);
            toast({ title: "Error saving playlist", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Playlist" : "Add Playlist"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label>Heading</Label>
                        <Input value={heading} onChange={(e) => setHeading(e.target.value)} />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <Label>Keywords (comma separated)</Label>
                        <Input
                            value={keywords.join(", ")}
                            onChange={(e) =>
                                setKeywords(e.target.value.split(",").map((k) => k.trim()).filter(Boolean))
                            }
                        />
                    </div>

                    <div>
                        <Label>Questions (Topics)</Label>
                        <MultiSelect
                            options={topics.map((t) => ({ label: t.title, value: t.id }))}
                            selected={topicIds}
                            onChange={setTopicIds}
                        />
                    </div>

                    <div>
                        <Label>Logo</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                    </div>

                    <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : isEdit ? "Update Playlist" : "Create Playlist"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
