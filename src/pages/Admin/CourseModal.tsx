import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseForm, { CourseFormData } from "./CourseForm";
import { DialogDescription } from "@radix-ui/react-dialog";

interface CourseModalProps {
    open: boolean;
    onOpenChange: (val: boolean) => void;
    mode: "create" | "edit";
    initialData?: CourseFormData;
    onSubmit: (data: CourseFormData, thumbnailFile?: File | null) => Promise<void>;
    loading?: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({
    open,
    onOpenChange,
    mode,
    initialData,
    onSubmit,
    loading,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{mode === "create" ? "Add New Course" : "Edit Course"}</DialogTitle>
                <DialogDescription>
                    {mode === "create"
                        ? "Fill in the fields below to add a new course."
                        : "Modify the fields below to update this course."}
                </DialogDescription>
            </DialogHeader>
            <CourseForm mode={mode} initialData={initialData} onSubmit={onSubmit} loading={loading} />
        </DialogContent>
    </Dialog>
);

export default CourseModal;
