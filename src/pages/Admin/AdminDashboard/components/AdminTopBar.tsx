// src/pages/admin/components/AdminTopBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminTopBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="flex gap-3">
                <Button onClick={() => navigate("/admin/pricing")}>Pricing</Button>
                <Button onClick={() => navigate("/admin/courses")}>Courses</Button>
            </div>
        </div>
    );
};

export default AdminTopBar;
