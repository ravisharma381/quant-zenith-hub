import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";

import CourseModal from "./CourseModal";
import { CourseFormData } from "./CourseForm";

const AdminCourses: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCourse, setEditCourse] = useState<any | null>(null);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const { toast } = useToast();
    const navigate = useNavigate();

    // 🔹 Fetch all courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCourses(data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            toast({
                title: "Error loading courses",
                description: "Failed to fetch courses. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // 🔹 Open create modal
    const handleAdd = () => {
        setMode("create");
        setEditCourse(null);
        setModalOpen(true);
    };

    // 🔹 Open edit modal
    const handleEdit = (course: any) => {
        setMode("edit");
        setEditCourse(course);
        setModalOpen(true);
    };

    // 🔹 Delete course
    const handleDelete = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
            setUpdateLoading(true);
            await deleteDoc(doc(db, "courses", courseId));
            setCourses((prev) => prev.filter((c) => c.id !== courseId));
            toast({ title: "Deleted", description: "Course deleted successfully." });
        } catch (err) {
            console.error("Error deleting course:", err);
            toast({
                title: "Error",
                description: "Failed to delete course.",
                variant: "destructive",
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    // 🔹 Handle form submit from modal
    const handleSubmit = async (data: CourseFormData, thumbnailFile?: File | null) => {
        try {
            const { serverTimestamp, addDoc, updateDoc } = await import("firebase/firestore");
            const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
            const { storage } = await import("@/firebase/config");

            let thumbnailURL = data.thumbnailURL || "";
            setUpdateLoading(true);

            // ✅ Upload thumbnail if a new file is selected
            if (thumbnailFile) {
                const fileRef = ref(
                    storage,
                    `course-thumbnails/${data.slug}_${Date.now()}`
                );
                await uploadBytes(fileRef, thumbnailFile);
                thumbnailURL = await getDownloadURL(fileRef);
            }

            if (mode === "create") {
                await addDoc(collection(db, "courses"), {
                    ...data,
                    thumbnailURL,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                toast({ title: "✅ Course created successfully!" });
            } else if (editCourse) {
                const refDoc = doc(db, "courses", editCourse.id);
                await updateDoc(refDoc, {
                    ...data,
                    thumbnailURL,
                    updatedAt: serverTimestamp(),
                });
                toast({ title: "✅ Course updated successfully!" });
            }

            setModalOpen(false);
            fetchCourses();
        } catch (err) {
            console.error("Error saving course:", err);
            toast({
                title: "❌ Error",
                description: "Could not save course data.",
                variant: "destructive",
            });
        } finally {
            setUpdateLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-muted/30 py-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* 🔹 Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground">Courses Management</h1>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Course
                    </Button>
                </div>

                {/* 🔹 Courses Grid */}
                {loading ? (
                    <div className="flex justify-center items-center min-h-[60vh] text-muted-foreground">
                        Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-20">
                        No courses available.
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Card
                                key={course.id}
                                className="relative group border border-border/50 hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/admin/courses/${course.id}`)}
                            >
                                {/* Thumbnail */}
                                <CardHeader className="p-0">
                                    {course.thumbnailURL ? (
                                        <img
                                            src={course.thumbnailURL}
                                            alt={course.title}
                                            className="w-full h-40 object-cover rounded-t-md"
                                        />
                                    ) : (
                                        <div className={`w-full h-40 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center flex-shrink-0`}>
                                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {course.author.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardHeader>

                                {/* Card content */}
                                <CardContent className="p-4 space-y-2">
                                    <CardTitle className="text-lg font-semibold line-clamp-1">
                                        {course.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{course.author}</p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {course.currencySymbol}
                                            {course.price?.yearly ?? 0} / yr
                                        </span>
                                        <Badge
                                            variant={course.isPublished ? "default" : "secondary"}
                                            className={
                                                course.isPublished
                                                    ? "bg-green-500/15 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }
                                        >
                                            {course.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(course);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(course.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* 🔹 Modal for Add/Edit */}
            <CourseModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                mode={mode}
                initialData={editCourse || undefined}
                onSubmit={handleSubmit}
                loading={updateLoading}
            />
        </div>
    );
};

export default AdminCourses;
