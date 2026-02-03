import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

import { Card } from "@/components/ui/card";
import { Users, Crown, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- TYPES ---------------- */

type AdminStats = {
    totalUsers?: number;
    premiumUsers?: number;
    lifetimeRevenue?: number;
    revenueByMonth?: Record<string, number>;
};

/* ---------------- HELPERS ---------------- */

function formatCurrency(amountSmallest = 0) {
    return `$${(amountSmallest / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function getMonthKey(date = new Date()) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
}

function getPreviousMonthKey() {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() - 1);
    return getMonthKey(d);
}

function calculateMoM(current = 0, previous = 0) {
    if (!previous || previous === 0) return null;
    return Math.round(((current - previous) / previous) * 1000) / 10;
}

// Frontend-only estimate
// function calculateExpectedNetRevenue(gross = 0) {
//     if (!gross) return 0;
//     return Math.max(Math.round(gross * (1 - 0.044)) - 30, 0);
// }

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

    useEffect(() => {
        (async () => {
            const snap = await getDoc(doc(db, "adminStats", "global"));
            setStats((snap.data() || {}) as AdminStats);
        })();
    }, []);

    const monthKey = useMemo(getMonthKey, []);
    const prevMonthKey = useMemo(getPreviousMonthKey, []);

    const thisMonthRevenue =
        stats?.revenueByMonth?.[monthKey] ?? 0;

    const lastMonthRevenue =
        stats?.revenueByMonth?.[prevMonthKey] ?? 0;

    const mom = calculateMoM(thisMonthRevenue, lastMonthRevenue);

    // const expectedActualRevenue = useMemo(
    //     () => calculateExpectedNetRevenue(stats?.lifetimeRevenue ?? 0),
    //     [stats?.lifetimeRevenue]
    // );

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
                    className="col-span-12 md:col-span-4"
                />

                <KpiCard
                    label="Premium Users"
                    value={(stats.premiumUsers ?? 0).toLocaleString()}
                    icon={<Crown className="w-6 h-6" />}
                    accent="amber-500"
                    className="col-span-12 md:col-span-4"
                />

                {/* Monthly Revenue – wider */}
                <KpiCard
                    label="This Month Revenue"
                    value={formatCurrency(thisMonthRevenue)}
                    icon={<TrendingUp className="w-6 h-6" />}
                    accent="green-500"
                    className="col-span-12 md:col-span-4"
                    subtext={
                        mom !== null && (
                            <span
                                className={cn(
                                    "font-medium",
                                    mom >= 0 ? "text-green-600" : "text-red-500"
                                )}
                            >
                                {mom >= 0 ? "▲" : "▼"} {Math.abs(mom)}% vs last month
                            </span>
                        )
                    }
                />

                {/* Lifetime Revenue – BIG */}
                <KpiCard
                    label="Lifetime Revenue"
                    value={formatCurrency(stats.lifetimeRevenue ?? 0)}
                    icon={<Wallet className="w-6 h-6" />}
                    accent="purple-500"
                    className="col-span-12 md:col-span-6"
                />

                {/* Expected Net Revenue – BIG */}
                {/* <KpiCard
                    label="Actual Revenue (Expected)"
                    value={formatCurrency(expectedActualRevenue)}
                    icon={<Wallet className="w-6 h-6" />}
                    accent="emerald-500"
                    className="col-span-12 md:col-span-6"
                    subtext="Estimated after PayPal fees"
                /> */}
            </div>
        </div>
    );
};

export default OverviewTab;
