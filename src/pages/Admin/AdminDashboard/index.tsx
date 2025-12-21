// src/pages/admin/components/AnalyticsTab.tsx

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Rectangle,
} from "recharts";
import {
    ShoppingCart,
    DollarSign,
    CalendarDays,
    TrendingUp,
    Infinity,
    Globe,
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */

const timeSeries = {
    weekly: [
        { label: "W1", sales: 42, revenue: 8400 },
        { label: "W2", sales: 55, revenue: 11200 },
        { label: "W3", sales: 48, revenue: 9800 },
        { label: "W4", sales: 67, revenue: 13600 },
    ],
    monthly: [
        { label: "Jan", sales: 128, revenue: 25400 },
        { label: "Feb", sales: 112, revenue: 22100 },
        { label: "Mar", sales: 148, revenue: 29500 },
        { label: "Apr", sales: 167, revenue: 33200 },
        { label: "May", sales: 193, revenue: 38400 },
    ],
    yearly: [
        { label: "2023", sales: 1219, revenue: 245000 },
        { label: "2024", sales: 1678, revenue: 341000 },
        { label: "2025", sales: 412, revenue: 82400 },
    ],
};

const locationData = [
    { region: "India", sales: 312, revenue: 62400 },
    { region: "United States", sales: 124, revenue: 24800 },
    { region: "Canada", sales: 46, revenue: 9200 },
    { region: "Germany", sales: 29, revenue: 5800 },
];

const lifetime = {
    sales: 3821,
    revenue: 768200,
};

/* -------------------- HELPERS -------------------- */

function sum(data: { sales: number; revenue: number }[]) {
    return data.reduce(
        (acc, cur) => {
            acc.sales += cur.sales;
            acc.revenue += cur.revenue;
            return acc;
        },
        { sales: 0, revenue: 0 }
    );
}

/* -------------------- TOOLTIP -------------------- */

const SoftTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border bg-background px-4 py-3 shadow-md">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} className="text-sm font-medium">
                    {p.dataKey === "revenue"
                        ? `Revenue: $${p.value.toLocaleString()}`
                        : `Sales: ${p.value}`}
                </p>
            ))}
        </div>
    );
};

/* -------------------- KPI CARD -------------------- */

const KpiCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    accent,
}: any) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
        <CardContent className="p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{title}</p>
                <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-semibold mt-2 tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </CardContent>
    </Card>
);

/* -------------------- ACTIVE BAR OVERRIDE -------------------- */
/* This COMPLETELY removes the grey hover */

const NoGreyActiveBar = (props: any) => (
    <Rectangle
        {...props}
        fill={props.fill}
        opacity={0.85}
    />
);

/* -------------------- COMPONENT -------------------- */

const AnalyticsTab: React.FC = () => {
    const [mode, setMode] = useState<"sales" | "revenue">("sales");
    const [range, setRange] =
        useState<"weekly" | "monthly" | "yearly">("weekly");

    const series = timeSeries[range];
    const totals = sum(series);

    return (
        <div className="space-y-10">

            {/* ================= TOP SECTION ================= */}
            <Card>
                <CardHeader className="pb-4">
                    <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                        <TabsList>
                            <TabsTrigger value="sales">Sales</TabsTrigger>
                            <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <KpiCard
                            title="Today"
                            value={mode === "sales" ? "9" : "$1,791"}
                            subtitle="Compared to yesterday"
                            icon={CalendarDays}
                            accent="bg-purple-500"
                        />

                        <KpiCard
                            title="This Week"
                            value={
                                mode === "sales"
                                    ? totals.sales
                                    : `$${totals.revenue.toLocaleString()}`
                            }
                            subtitle="Last 7 days"
                            icon={TrendingUp}
                            accent="bg-green-500"
                        />

                        <KpiCard
                            title="This Month"
                            value={mode === "sales" ? "193" : "$38,400"}
                            subtitle="Month to date"
                            icon={mode === "sales" ? ShoppingCart : DollarSign}
                            accent="bg-blue-500"
                        />

                        <KpiCard
                            title="Lifetime"
                            value={
                                mode === "sales"
                                    ? lifetime.sales
                                    : `$${lifetime.revenue.toLocaleString()}`
                            }
                            subtitle="All-time"
                            icon={Infinity}
                            accent="bg-amber-500"
                        />
                    </div>

                    {/* RANGE TABS */}
                    <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
                        <TabsList>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* AREA CHART */}
                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={series}>
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip content={<SoftTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey={mode}
                                    name={mode === "sales" ? "Sales" : "Revenue"}
                                    stroke={mode === "sales" ? "#7c3aed" : "#22c55e"}
                                    fill={mode === "sales" ? "#7c3aed33" : "#22c55e33"}
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* ================= GEO SECTION ================= */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        User Location Analytics
                    </CardTitle>
                </CardHeader>

                <CardContent className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={locationData} barSize={30}>
                            <XAxis
                                dataKey="region"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#9ca3af", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Tooltip content={<SoftTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="sales"
                                name="Sales"
                                stackId="a"
                                fill="#7c3aed"
                                activeBar={<NoGreyActiveBar />}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="revenue"
                                name="Revenue"
                                stackId="a"
                                fill="#22c55e"
                                activeBar={<NoGreyActiveBar />}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsTab;
