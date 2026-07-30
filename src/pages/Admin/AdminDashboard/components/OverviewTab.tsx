import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/firebase/config";

import { Card } from "@/components/ui/card";
import { Users, Crown, TrendingUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

type AdminStats = {
    totalUsers?: number;
    premiumUsers?: number;
    lifetimeRevenueUSDCents?: number;
    revenueByMonth?: Record<string, number>;
};

type RazorpayMonthlyKpis = {
    monthKey: string;
    timezone?: string;
    currency: string;
    revenuePaise: number;
    refundsPaise: number;
    paymentCount: number;
    refundCount: number;
};

/* ---------------- HELPERS ---------------- */

function formatINR(paise = 0) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(paise / 100);
}

/* ---------------- KPI CARD ---------------- */

interface KpiCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    accent: string;
    className?: string;
    subtext?: React.ReactNode;
}

const KpiSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <Card
        className={cn(
            "relative overflow-hidden p-6 flex items-start gap-4",
            className
        )}
    >
        {/* soft background wash */}
        <div className="absolute inset-0 bg-muted/40" />

        {/* icon skeleton */}
        <div className="relative z-10 h-12 w-12 rounded-xl bg-muted animate-pulse" />

        {/* text skeletons */}
        <div className="relative z-10 flex flex-col gap-3 w-full">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded bg-muted animate-pulse" />
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
        </div>
    </Card>
);

const OverviewSkeleton = () => (
    <div className="space-y-8 w-full">
        {/* Header skeleton */}
        <div>
            <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>

        {/* KPI grid skeleton */}
        <div className="grid grid-cols-12 gap-6">
            <KpiSkeleton className="col-span-12 md:col-span-4" />
            <KpiSkeleton className="col-span-12 md:col-span-4" />
            <KpiSkeleton className="col-span-12 md:col-span-4" />
            <KpiSkeleton className="col-span-12 md:col-span-6" />
            <KpiSkeleton className="col-span-12 md:col-span-6" />
        </div>
    </div>
);


const KpiCard: React.FC<KpiCardProps> = ({
    label,
    value,
    icon,
    accent,
    className,
    subtext,
}) => (
    <Card
        className={cn(
            "relative overflow-hidden p-6 flex items-start gap-4",
            className
        )}
    >
        {/* Soft background wash */}
        <div
            className={cn(
                "absolute inset-0 opacity-[0.08]",
                `bg-${accent}`
            )}
        />

        {/* Icon */}
        <div
            className={cn(
                "relative z-10 p-3 rounded-xl",
                `bg-${accent}/15 text-${accent}`
            )}
        >
            {icon}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
                {label}
            </span>

            <span className="mt-1 text-3xl font-semibold tracking-tight">
                {value}
            </span>

            {subtext && (
                <div className="mt-2 text-xs text-muted-foreground">
                    {subtext}
                </div>
            )}
        </div>
    </Card>
);

/* ---------------- OVERVIEW TAB ---------------- */

const OverviewTab: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [razorpayKpis, setRazorpayKpis] = useState<RazorpayMonthlyKpis | null>(null);
    const [razorpayError, setRazorpayError] = useState<string | null>(null);
    const [razorpayLoading, setRazorpayLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const snap = await getDoc(doc(db, "adminStats", "global"));
            setStats((snap.data() || {}) as AdminStats);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setRazorpayLoading(true);
            setRazorpayError(null);
            try {
                const fn = httpsCallable(functions, "getRazorpayMonthlyKpis");
                const res = await fn({});
                const data = res.data as RazorpayMonthlyKpis & { ok?: boolean };
                setRazorpayKpis(data);
            } catch (err: any) {
                console.error("Failed to load Razorpay KPIs:", err);
                setRazorpayError(err?.message || "Failed to load Razorpay data");
            } finally {
                setRazorpayLoading(false);
            }
        })();
    }, []);

    if (!stats) {
        return <OverviewSkeleton />;
    }

    return (
        <div className="space-y-8 w-full">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                    Overview
                </h2>
                <p className="text-sm text-muted-foreground">
                    Platform usage and revenue snapshot
                </p>
            </div>

            {/* KPI GRID – 12 column layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Users */}
                <KpiCard
                    label="Total Users"
                    value={(stats.totalUsers ?? 0).toLocaleString()}
                    icon={<Users className="w-6 h-6" />}
                    accent="blue-500"
                    className="col-span-12 md:col-span-6 xl:col-span-3"
                />

                <KpiCard
                    label="Premium Users"
                    value={(stats.premiumUsers ?? 0).toLocaleString()}
                    icon={<Crown className="w-6 h-6" />}
                    accent="amber-500"
                    className="col-span-12 md:col-span-6 xl:col-span-3"
                />

                {razorpayLoading ? (
                    <>
                        <KpiSkeleton className="col-span-12 md:col-span-6 xl:col-span-3" />
                        <KpiSkeleton className="col-span-12 md:col-span-6 xl:col-span-3" />
                    </>
                ) : razorpayError ? (
                    <Card className="col-span-12 md:col-span-12 xl:col-span-6 p-6">
                        <p className="text-sm text-muted-foreground">
                            Unable to load Razorpay KPIs: {razorpayError}
                        </p>
                    </Card>
                ) : (
                    <>
                        <KpiCard
                            label="Revenue this month (INR)"
                            value={formatINR(razorpayKpis?.revenuePaise ?? 0)}
                            icon={<TrendingUp className="w-6 h-6" />}
                            accent="green-500"
                            className="col-span-12 md:col-span-6 xl:col-span-3"
                            subtext={`${razorpayKpis?.paymentCount ?? 0} payments · ${razorpayKpis?.monthKey ?? ""} IST`}
                        />

                        <KpiCard
                            label="Refunds this month (INR)"
                            value={formatINR(razorpayKpis?.refundsPaise ?? 0)}
                            icon={<RotateCcw className="w-6 h-6" />}
                            accent="red-500"
                            className="col-span-12 md:col-span-6 xl:col-span-3"
                            subtext={`${razorpayKpis?.refundCount ?? 0} refunds · ${razorpayKpis?.monthKey ?? ""} IST`}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default OverviewTab;
