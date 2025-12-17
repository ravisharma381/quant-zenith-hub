import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Copy, Upload } from "lucide-react";
import { toast } from "sonner";
import { storage } from "@/firebase/config";

const UPLOAD_FOLDER = "imageBucket";
const PAGE_SIZE = 9;

interface UploadedImage {
    name: string;
    url: string;
}

const ImageBucket: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadedNow, setUploadedNow] = useState<UploadedImage[]>([]);
    const [allImages, setAllImages] = useState<UploadedImage[]>([]);
    const [page, setPage] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ---------------- Fetch existing images ---------------- */

    const fetchImages = useCallback(async () => {
        const folderRef = ref(storage, UPLOAD_FOLDER);
        const res = await listAll(folderRef);

        const urls = await Promise.all(
            res.items.map(async (item) => ({
                name: item.name,
                url: await getDownloadURL(item),
            }))
        );

        // newest first (filename timestamp friendly)
        setAllImages(urls.reverse());
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    /* ---------------- Upload handler ---------------- */

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadedNow([]);

        const uploads: UploadedImage[] = [];

        try {
            for (const file of Array.from(files)) {
                const fileRef = ref(
                    storage,
                    `${UPLOAD_FOLDER}/${Date.now()}-${file.name}`
                );

                await uploadBytesResumable(fileRef, file);
                const url = await getDownloadURL(fileRef);

                uploads.push({ name: file.name, url });
            }

            setUploadedNow(uploads);
            setShowDialog(true);
            toast.success("Images uploaded successfully");
            fetchImages();
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    /* ---------------- Pagination ---------------- */

    const paginatedImages = useMemo(() => {
        const start = page * PAGE_SIZE;
        return allImages.slice(start, start + PAGE_SIZE);
    }, [allImages, page]);

    /* ---------------- Copy helper ---------------- */

    const copy = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("Copied public URL");
    };

    /* ===================================================== */

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
            <h3 className="text-2xl font-semibold text-center">Image Bucket</h3>
            {/* ================= Upload Box ================= */}
            <Card className="border-dashed border-2">
                <CardContent className="py-10 flex flex-col items-center justify-center gap-4">
                    <label className="cursor-pointer">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={uploading}
                            onChange={onFileChange}
                            className="hidden"
                        />

                        <Button
                            size="lg"
                            disabled={uploading}
                            className="gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Uploading…
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Upload Images
                                </>
                            )}
                        </Button>
                    </label>

                    <p className="text-xs text-muted-foreground">
                        Upload one or multiple images. Get instant public URLs.
                    </p>
                </CardContent>
            </Card>

            {/* ================= Grid View ================= */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {paginatedImages.map((img) => (
                        <Card key={img.url} className="overflow-hidden">
                            <img
                                src={img.url}
                                alt=""
                                className="h-40 w-full object-cover"
                            />
                            <CardContent className="p-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="w-full gap-2 cursor-pointer"
                                    onClick={() => copy(img.url)}
                                >
                                    <Copy size={14} />
                                    Copy URL
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {allImages.length > PAGE_SIZE && (
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            disabled={(page + 1) * PAGE_SIZE >= allImages.length}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* ================= Upload Result Dialog ================= */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Uploaded Images</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        {uploadedNow.map((img) => (
                            <div
                                key={img.url}
                                className="flex items-center justify-between gap-3 border rounded-md p-2"
                            >
                                <img
                                    src={img.url}
                                    alt=""
                                    className="h-10 w-10 rounded object-cover"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copy(img.url)}
                                >
                                    <Copy size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageBucket;
