import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TopicFormData {
    id?: string;
    courseId: string;
    chapterId: string;
    title: string;
    type: "layout" | "question" | "playlist";
    order: number;
    htmlContent?: string;
    question?: string;
    answer?: string;
    hint1?: string;
    hint2?: string;
    solution?: string;
    level?: string;
    playlistIds?: string[];
    askedIn?: { name: string; logoURL: string }[];
    isPublished?: boolean;
}

interface Playlist {
    id: string;
    heading: string;
    subheading: string;
}

interface TopicModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: TopicFormData) => void;
    initialData?: TopicFormData;
    playlists: Playlist[];
}

const TopicModal: React.FC<TopicModalProps> = ({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    playlists,
}) => {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"layout" | "question" | "playlist">("layout");
    const [order, setOrder] = useState<number>(0);
    const [level, setLevel] = useState("1");
    const [htmlContent, setHtmlContent] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [hint1, setHint1] = useState("");
    const [hint2, setHint2] = useState("");
    const [solution, setSolution] = useState("");
    const [playlistIds, setPlaylistIds] = useState<string[]>([]);
    const [askedIn, setAskedIn] = useState<{ name: string; logoURL: string }[]>([]);
    const { toast } = useToast();

    // 🔹 preload for editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setType(initialData.type);
            setOrder(initialData.order ?? 0);
            setLevel(initialData.level ?? "1");
            setHtmlContent(initialData.htmlContent ?? "");
            setQuestion(initialData.question ?? "");
            setAnswer(initialData.answer ?? "");
            setHint1(initialData.hint1 ?? "");
            setHint2(initialData.hint2 ?? "");
            setSolution(initialData.solution ?? "");
            setPlaylistIds(initialData.playlistIds ?? []);
            setAskedIn(initialData.askedIn ?? []);
        } else {
            setTitle("");
            setType("layout");
            setOrder(0);
            setLevel("1");
            setHtmlContent("");
            setQuestion("");
            setAnswer("");
            setHint1("");
            setHint2("");
            setSolution("");
            setPlaylistIds([]);
            setAskedIn([]);
        }
    }, [initialData]);

    // 🔹 askedIn field controls
    const handleAddAskedIn = () => setAskedIn([...askedIn, { name: "", logoURL: "" }]);
    const handleAskedInChange = (index: number, field: string, value: string) => {
        const updated = [...askedIn];
        updated[index] = { ...updated[index], [field]: value };
        setAskedIn(updated);
    };
    const handleRemoveAskedIn = (index: number) =>
        setAskedIn(askedIn.filter((_, i) => i !== index));

    const handleSubmit = () => {
        if (!title || !courseId || !chapterId) {
            toast({
                title: "Missing fields",
                description: "Title, course, or chapter is missing.",
                variant: "destructive",
            });
            return;
        }

        const topicData: TopicFormData = {
            id: initialData?.id,
            courseId,
            chapterId,
            title,
            type,
            order,
            ...(type === "layout" && { htmlContent }),
            ...(type === "question" && {
                question,
                answer,
                hint1,
                hint2,
                solution,
                level,
                askedIn: askedIn.filter((a) => a.name.trim() && a.logoURL.trim()),
            }),
            ...(type === "playlist" && { playlistIds }),
            isPublished: initialData?.isPublished ?? false,
        };

        onSubmit(topicData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Topic" : "Add Topic"}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update topic details below."
                            : "Fill details to create a new topic."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="layout">Layout</SelectItem>
                                <SelectItem value="question">Question</SelectItem>
                                <SelectItem value="playlist">Playlist</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Order</Label>
                        <Input
                            type="number"
                            min={0}
                            value={order}
                            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
                        />
                    </div>

                    {type === "layout" && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>HTML Builder</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const builderUrl = `${window.location.origin}/admin/builder`;
                                        const newWindow = window.open(builderUrl, "_blank");
                                        if (newWindow) newWindow.opener = null;
                                    }}
                                >
                                    <Maximize2 className="h-4 w-4 mr-1" /> Open Builder
                                </Button>
                            </div>
                            <Textarea
                                rows={8}
                                placeholder="<div>Custom layout...</div>"
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                            />
                        </div>
                    )}

                    {type === "question" && (
                        <>
                            <div>
                                <Label>Question</Label>
                                <Textarea
                                    rows={3}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Answer</Label>
                                <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Hint 1</Label>
                                    <Input value={hint1} onChange={(e) => setHint1(e.target.value)} />
                                </div>
                                <div>
                                    <Label>Hint 2</Label>
                                    <Input value={hint2} onChange={(e) => setHint2(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <Label>Solution</Label>
                                <Textarea
                                    rows={4}
                                    value={solution}
                                    onChange={(e) => setSolution(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Level</Label>
                                <Select value={level} onValueChange={setLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 🏢 Asked In Section */}
                            <div>
                                <Label>Asked In (Companies)</Label>
                                <div className="space-y-3">
                                    {askedIn.map((a, i) => (
                                        <div key={i} className="grid grid-cols-2 gap-2 items-center">
                                            <Input
                                                placeholder="Company name"
                                                value={a.name}
                                                onChange={(e) =>
                                                    handleAskedInChange(i, "name", e.target.value)
                                                }
                                            />
                                            <Input
                                                placeholder="Logo URL"
                                                value={a.logoURL}
                                                onChange={(e) =>
                                                    handleAskedInChange(i, "logoURL", e.target.value)
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveAskedIn(i)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={handleAddAskedIn}>
                                        + Add Company
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    {type === "playlist" && (
                        <div>
                            <Label>Playlists</Label>
                            <MultiSelect
                                options={playlists.map((p) => ({ label: p.heading, value: p.id }))}
                                value={playlistIds}
                                onChange={setPlaylistIds}
                                placeholder="Select playlists"
                            />
                        </div>
                    )}

                    <Button onClick={handleSubmit} className="w-full">
                        {initialData ? "Save Changes" : "Add Topic"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TopicModal;
