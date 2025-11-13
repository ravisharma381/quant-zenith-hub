import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="flex flex-col items-center gap-6">
                {/* Scaling Circle */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                    <div className="w-12 h-12 rounded-full bg-primary"></div>
                </div>

                {/* Loading Text */}
                <p className="text-muted-foreground text-lg font-medium">
                    Hang on tight, we're checking your credentials...
                </p>
            </div>
        </div>
    );

    if (!user && !loading) {
        // Pass the attempted route as state
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
