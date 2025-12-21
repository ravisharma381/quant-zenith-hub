// src/pages/admin/components/UsersTab.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    where,
    updateDoc,
    doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

interface UserRecord {
    id: string;
    email: string;
    name: string;
    role: string;
    photoURL?: string;
    isPremium?: boolean;
    planType?: string;
    planPrice?: number;
    expiresAt?: string | null;
    lastLoginAt?: any;
    createdAt?: any;
}

const UsersTab: React.FC = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [premiumFilter, setPremiumFilter] = useState("All");  // All / Yes / No
    const [planFilter, setPlanFilter] = useState("All");        // All / Monthly / Yearly / Lifetime

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(handler);
    }, [search]);

    const loadUsers = useCallback(
        async (reset = false) => {
            setLoading(true);

            let constraints: any[] = [];

            // ---- SEARCH ----
            if (debouncedSearch) {
                constraints.push(orderBy("email"));
                constraints.push(where("email", ">=", debouncedSearch));
                constraints.push(where("email", "<=", debouncedSearch + "\uf8ff"));
            } else {
                constraints.push(orderBy("createdAt", "desc"));
            }

            // ---- PREMIUM FILTER ----
            if (premiumFilter === "Yes") constraints.push(where("isPremium", "==", true));
            if (premiumFilter === "No") constraints.push(where("isPremium", "==", false));

            // ---- PLAN FILTER ----
            if (planFilter !== "All") constraints.push(where("planType", "==", planFilter));

            let q = query(collection(db, "users"), ...constraints, limit(PAGE_SIZE));

            if (!reset && lastDoc) {
                q = query(collection(db, "users"), ...constraints, startAfter(lastDoc), limit(PAGE_SIZE));
            }

            const snap = await getDocs(q);
            const newUsers = snap.docs.map((d) => ({
                id: d.id,
                // @ts-ignore
                ...d.data(),
            })) as UserRecord[];

            setUsers((prev) => (reset ? newUsers : [...prev, ...newUsers]));
            setLastDoc(snap.docs[snap.docs.length - 1] || null);
            setLoading(false);
        },
        [debouncedSearch, premiumFilter, planFilter, lastDoc]
    );

    // Load when filters/search change
    useEffect(() => {
        setLastDoc(null);
        loadUsers(true);
    }, [debouncedSearch, premiumFilter, planFilter]);

    const updateRole = async (userId: string, role: string) => {
        await updateDoc(doc(db, "users", userId), { role, isPremium: (role === "admin" || role === "superAdmin") });
    };

    return (
        <div className="space-y-4">

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3">

                <div className="flex flex-col w-[240px]">
                    <label className="text-sm font-medium text-foreground mb-1">Search (email)</label>
                    <Input
                        placeholder="Type to search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-[160px]">
                    <label className="text-sm font-medium text-foreground mb-1">Premium</label>
                    <Select value={premiumFilter} onValueChange={setPremiumFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Premium" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Yes">Premium</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col w-[160px]">
                    <label className="text-sm font-medium text-foreground mb-1">Plan Type</label>
                    <Select value={planFilter} onValueChange={setPlanFilter}>
                        <SelectTrigger>
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
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-center">Premium</th>
                            <th className="p-3 text-center">Plan</th>
                            <th className="p-3 text-center">Last Login</th>
                            <th className="p-3 text-center">Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t">
                                <td className="p-3 flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={u.photoURL} alt="Profile" />
                                        <AvatarFallback>{u.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    {u.name}
                                </td>

                                <td className="p-3">{u.email}</td>

                                <td className="p-3 text-center">
                                    {u.isPremium ? (
                                        <Crown className="text-yellow-400 w-5 h-5 mx-auto" />
                                    ) : (
                                        <span className="text-muted-foreground">No</span>
                                    )}
                                </td>

                                <td className="p-3 text-center">
                                    {u.isPremium ? (
                                        <>
                                            <Badge>{u.planType}</Badge>
                                            <div className="text-xs text-muted-foreground">
                                                ${u.planPrice}
                                            </div>
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td className="p-3 text-center">
                                    {u.lastLoginAt?.toDate?.().toLocaleString() || "-"}
                                </td>

                                <td className="p-3 text-center">
                                    <Select
                                        defaultValue={u.role}
                                        onValueChange={(value) => updateRole(u.id, value)}
                                    >
                                        <SelectTrigger className="w-[130px] mx-auto">
                                            <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {lastDoc && (
                <div className="flex justify-center mt-4">
                    <Button variant="secondary" onClick={() => loadUsers(false)} disabled={loading}>
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UsersTab;
