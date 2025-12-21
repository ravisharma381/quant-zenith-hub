// src/pages/admin/components/AnalyticsTab.tsx

import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// -------------------- DUMMY DATA --------------------

const kpis = [
    { label: "Today", value: 5 },
    { label: "Last 7 Days", value: 38 },
    { label: "This Month", value: 142 },
    { label: "Lifetime", value: 1240 },
];

const dailyTrend = [
    { date: "Mon", count: 4 },
    { date: "Tue", count: 6 },
    { date: "Wed", count: 7 },
    { date: "Thu", count: 9 },
    { date: "Fri", count: 8 },
    { date: "Sat", count: 3 },
    { date: "Sun", count: 1 },
];

const countryData = [
    { name: "India", value: 82 },
    { name: "United States", value: 31 },
    { name: "Canada", value: 11 },
    { name: "Germany", value: 6 },
];

const cityData = [
    { city: "Bengaluru", count: 28 },
    { city: "Mumbai", count: 21 },
    { city: "Delhi", count: 17 },
    { city: "New York", count: 9 },
    { city: "Toronto", count: 6 },
];

const planData = [
    { name: "Yearly", value: 78 },
    { name: "Lifetime", value: 22 },
];

const COLORS = ["#7c3aed", "#f59e0b"];

// -------------------- COMPONENT --------------------

const AnalyticsTab: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label}>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">{kpi.label}</p>
                            <p className="text-3xl font-bold">{kpi.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* TREND + PLAN SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Daily Purchases (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyTrend}>
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#7c3aed"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Plan Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={planData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                >
                                    {planData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* GEO ANALYTICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#7c3aed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Cities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b">
                                    <th className="py-2 text-left">City</th>
                                    <th className="py-2 text-right">Purchases</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cityData.map((c) => (
                                    <tr key={c.city} className="border-b">
                                        <td className="py-2">{c.city}</td>
                                        <td className="py-2 text-right font-medium">
                                            {c.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsTab;
