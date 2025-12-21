// src/pages/admin/components/TransactionsTab.tsx
import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    limit,
    orderBy,
    startAfter,
    getDocs,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 20;

interface TransactionDoc {
    id: string;
    userId: string;
    planType: string;
    planPrice: number;
    provider: string;
    status: string;
    orderId: string;
    paymentId: string;
    amountSmallest: number;
    currency: string;
    createdAt: any;
    expiresAt?: string; // NEW
}

const TransactionsTab: React.FC = () => {
    const [txns, setTxns] = useState<TransactionDoc[]>([]);
    const [filteredTxns, setFilteredTxns] = useState<TransactionDoc[]>([]);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({
        planType: "All",
        status: "All",
    });

    const [userCache, setUserCache] = useState<Record<string, any>>({});

    // Fetch user (name + email) once & cache
    const fetchUser = async (uid: string) => {
        if (userCache[uid]) return userCache[uid];
        const snap = await getDoc(doc(db, "users", uid));
        const data = snap.data() || {};
        setUserCache((prev) => ({ ...prev, [uid]: data }));
        return data;
    };

    // Load transactions from Firestore
    const loadTxns = async (reset = false) => {
        let q: any = query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));

        if (filters.planType !== "All") q = query(q, where("planType", "==", filters.planType));
        if (filters.status !== "All") q = query(q, where("status", "==", filters.status));

        if (!reset && lastDoc) q = query(q, startAfter(lastDoc));

        const snap = await getDocs(q);
        const newTxns = snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as TransactionDoc[];

        if (reset) setTxns(newTxns);
        else setTxns((prev) => [...prev, ...newTxns]);

        setLastDoc(snap.docs[snap.docs.length - 1] || null);
    };

    // First load + reload on filter change
    useEffect(() => {
        loadTxns(true);
    }, [filters]);

    // Fetch all users referenced
    useEffect(() => {
        txns.forEach((t) => fetchUser(t.userId));
    }, [txns]);

    // Local search filter by email
    useEffect(() => {
        if (!search.trim()) {
            setFilteredTxns(txns);
            return;
        }

        const queryLower = search.toLowerCase();

        const result = txns.filter((t) => {
            const user = userCache[t.userId];
            const email = (user?.email || "").toLowerCase();
            return email.includes(queryLower);
        });

        setFilteredTxns(result);
    }, [search, txns, userCache]);

    // Always show filtered list
    useEffect(() => {
        setFilteredTxns(txns);
    }, [txns]);

    return (
        <div>
            {/* Filters */}
            <div className="flex gap-4 mb-4 items-end">
                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground">Plan Type:</Label>
                    <Select
                        value={filters.planType}
                        onValueChange={(v) => setFilters((f) => ({ ...f, planType: v }))}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Plan Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                            <SelectItem value="Lifetime">Lifetime</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-foreground">Status:</Label>
                    <Select
                        value={filters.status}
                        onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search by email */}
                <div className="flex flex-col">
                    <Label className="text-sm font-medium text-foreground">Search Email:</Label>
                    <Input
                        placeholder="search@email..."
                        className="w-[220px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3">Plan</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Provider</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Expires</th>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTxns.map((t) => {
                            const user = userCache[t.userId];

                            const expires = t.expiresAt ? new Date(t.expiresAt) : null;
                            const now = new Date();
                            const isExpired = expires ? expires < now : false;

                            return (
                                <tr key={t.id} className="border-t">
                                    <td className="p-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user?.name || "-"}</span>
                                            <span className="text-muted-foreground text-xs">{user?.email || t.userId}</span>
                                        </div>
                                    </td>

                                    <td className="p-3 text-center">
                                        <Badge>{t.planType}</Badge>
                                    </td>

                                    <td className="p-3 text-center">
                                        {t.currency} {(t.amountSmallest / 100).toFixed(2)}
                                    </td>

                                    <td className="p-3 text-center">{t.provider}</td>

                                    <td className="p-3 text-center">
                                        <Badge variant={t.status === "success" ? "default" : "destructive"}>
                                            {t.status}
                                        </Badge>
                                    </td>

                                    {/* Expiry column */}
                                    <td className="p-3 text-center">
                                        {t.expiresAt ? (
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-muted-foreground">
                                                    {isExpired ? "Expired At" : "Expires On"}
                                                </span>
                                                <span className={isExpired ? "text-red-500 font-semibold" : "text-foreground"}>
                                                    {expires?.toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="p-3 text-center text-xs">{t.orderId}</td>

                                    <td className="p-3 text-center">
                                        {t.createdAt?.toDate?.().toLocaleString() || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {lastDoc && (
                <div className="flex justify-center mt-4">
                    <Button variant="secondary" onClick={() => loadTxns(false)}>
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TransactionsTab;
