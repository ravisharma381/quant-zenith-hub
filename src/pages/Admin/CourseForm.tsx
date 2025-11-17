import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface CourseFormData {
    title: string;
    slug: string;
    author: string;
    category: string;
    level: string;
    description: string;
    courseDuration: string;
    currency: string;
    currencySymbol: string;
    price: { yearly: number; lifetime: number };
    rating: string;                 // e.g. "4.7"
    noOfRatings: string;            // e.g. "451K ratings"
    noOfStudentsEnrolled: number;   // e.g. 451000
    totalChapters: number;          // e.g. 120
    tags: string[];                 // comma separated in UI
    gradient: string;               // e.g. "from-orange-400 to-yellow-500"
    isPublished: boolean;
    thumbnailURL?: string;
    isComingSoon?: boolean;
}

interface CourseFormProps {
    mode: "create" | "edit";
    initialData?: CourseFormData;
    onSubmit: (data: CourseFormData, thumbnailFile?: File | null) => Promise<void>;
    loading?: boolean;
}


const CourseForm: React.FC<CourseFormProps> = ({ mode, initialData, onSubmit, loading }) => {
    const [formData, setFormData] = useState<CourseFormData>(
        initialData || {
            title: "",
            slug: "",
            author: "",
            category: "",
            level: "Intermediate",
            description: "",
            courseDuration: "",
            currency: "USD",
            currencySymbol: "$",
            price: { yearly: 0, lifetime: 0 },
            rating: "4.7",
            noOfRatings: "0 ratings",
            noOfStudentsEnrolled: 0,
            totalChapters: 0,
            tags: [],
            gradient: "from-blue-500 to-purple-500",
            isPublished: false,
            thumbnailURL: "",
            isComingSoon: false
        }
    );

    const [tagsInput, setTagsInput] = useState<string>((initialData?.tags || []).join(", "));
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(initialData?.thumbnailURL || "");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Generate preview when a new file is selected
    useEffect(() => {
        if (!thumbnailFile) return;
        const url = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnailFile]);

    // Keep tags array in sync with input
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            tags: tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        }));
    }, [tagsInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // numeric fields normalization
        if (name === "noOfStudentsEnrolled" || name === "totalChapters") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (field: "yearly" | "lifetime", value: string) => {
        setFormData((prev) => ({
            ...prev,
            price: { ...prev.price, [field]: Number(value) || 0 },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData, thumbnailFile);
    };

    const hasPreview = useMemo(() => Boolean(thumbnailPreview), [thumbnailPreview]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Title</Label>
                    <Input name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Slug</Label>
                    <Input
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="quant-interview-masterclass"
                        required
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Author</Label>
                    <Input name="author" value={formData.author} onChange={handleChange} />
                </div>
                <div>
                    <Label>Category</Label>
                    <Input name="category" value={formData.category} onChange={handleChange} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Level</Label>
                    <Input name="level" value={formData.level} onChange={handleChange} />
                </div>
                <div>
                    <Label>Course Duration</Label>
                    <Input
                        name="courseDuration"
                        value={formData.courseDuration}
                        onChange={handleChange}
                        placeholder="47.1 total hours"
                    />
                </div>
            </div>

            <div>
                <Label>Description</Label>
                <textarea
                    name="description"
                    className="w-full p-2 border rounded-md border-border bg-background"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            {/* Money + Appearance */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Price (Yearly)</Label>
                    <Input
                        type="number"
                        value={formData.price.yearly}
                        onChange={(e) => handlePriceChange("yearly", e.target.value)}
                    />
                </div>
                <div>
                    <Label>Price (Lifetime)</Label>
                    <Input
                        type="number"
                        value={formData.price.lifetime}
                        onChange={(e) => handlePriceChange("lifetime", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <Label>Currency</Label>
                    <Input name="currency" value={formData.currency} onChange={handleChange} />
                </div>
                <div>
                    <Label>Currency Symbol</Label>
                    <Input name="currencySymbol" value={formData.currencySymbol} onChange={handleChange} />
                </div>
                <div>
                    <Label>Gradient</Label>
                    <Input
                        name="gradient"
                        value={formData.gradient}
                        onChange={handleChange}
                        placeholder="from-orange-400 to-yellow-500"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <Label>Rating (string)</Label>
                    <Input name="rating" value={formData.rating} onChange={handleChange} />
                </div>
                <div>
                    <Label>No. of Ratings (string)</Label>
                    <Input
                        name="noOfRatings"
                        value={formData.noOfRatings}
                        onChange={handleChange}
                        placeholder="451K ratings"
                    />
                </div>
                <div>
                    <Label>No. of Students Enrolled</Label>
                    <Input
                        type="number"
                        name="noOfStudentsEnrolled"
                        value={formData.noOfStudentsEnrolled}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label>Total Chapters</Label>
                    <Input
                        type="number"
                        name="totalChapters"
                        value={formData.totalChapters}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label>Tags (comma separated)</Label>
                    <Input
                        name="tagsInput"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="quant, finance, interview"
                    />
                </div>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex items-center gap-4">
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    />
                    {hasPreview && (
                        <div className="flex items-center gap-2">
                            <img
                                src={thumbnailPreview}
                                alt="preview"
                                className="h-12 w-12 rounded object-cover border"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setThumbnailFile(null);
                                    setThumbnailPreview(initialData?.thumbnailURL || "");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
                {mode === "edit" && !thumbnailFile && formData.thumbnailURL ? (
                    <p className="text-xs text-muted-foreground">
                        Using existing thumbnail: <span className="underline break-all">{formData.thumbnailURL}</span>
                    </p>
                ) : null}
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between pt-2">
                <Label>Publish Course</Label>
                <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData((p) => ({ ...p, isPublished: checked }))}
                />
            </div>
            <div className="flex items-center justify-between pt-2">
                <Label>IS coming Soon (make sure Publish is true)</Label>
                <Switch
                    checked={formData.isComingSoon}
                    onCheckedChange={(checked) => setFormData((p) => ({ ...p, isComingSoon: checked }))}
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {mode === "create" ? "Create Course" : "Update Course"}
            </Button>
        </form>
    );
};

export default CourseForm;
