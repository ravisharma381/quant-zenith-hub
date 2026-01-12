
// Problems.tsx
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import {
    collection,
    getDocs,
    getCountFromServer,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";
import { CheckCircle, Circle, Lock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    PROBLEMS_COURSE_ID,
    PROBLEMS_PER_PAGE,
    SHOW_FREE_PAGES,
} from "@/statics";

/* ---------------- Types ---------------- */

interface AskedInItem {
    name: string;
    logoURL: string;
}

interface ProblemDoc {
    id: string;
    title: string;
    topic: string;
    difficulty: number;
    askedIn: AskedInItem[];
    order: number;
}

/* ---------------- Component ---------------- */

const Problems: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile } = useAuth();
    const isSubscribed = userProfile?.isPremium === true;

    /* ---------------- State ---------------- */

    const [problems, setProblems] = useState<ProblemDoc[]>([]);
    const [problemsLoading, setProblemsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("All");
    const [selectedDifficulty, setSelectedDifficulty] = useState("All");

    /* ---------------- Cursor Cache ---------------- */

    const pageCursors = useRef<Map<number, QueryDocumentSnapshot>>(new Map());

    /* ---------------- Helpers ---------------- */

    function isPageLocked(page: number) {
        return !isSubscribed && page > SHOW_FREE_PAGES;
    }

    function isRowLocked(globalIndex: number) {
        return !isSubscribed && globalIndex >= SHOW_FREE_PAGES * PROBLEMS_PER_PAGE;
    }

    function buildBaseConstraints() {
        const c: any[] = [
            where("courseId", "==", PROBLEMS_COURSE_ID),
        ];

        if (selectedTopic !== "All") {
            c.push(where("topic", "==", selectedTopic));
        }

        if (selectedDifficulty !== "All") {
            c.push(where("level", "==", selectedDifficulty.replace("Level ", "")));
        }

        return c;
    }

    /* ---------------- Count ---------------- */

    useEffect(() => {
        (async () => {
            const countQuery = query(
                collection(db, "problem_index"),
                ...buildBaseConstraints()
            );
            const snap = await getCountFromServer(countQuery);
            setTotalPages(Math.max(1, Math.ceil(snap.data().count / PROBLEMS_PER_PAGE)));
        })();
    }, [selectedTopic, selectedDifficulty, searchTerm]);

    /* ---------------- Reset cursors on filter/search ---------------- */

    useEffect(() => {
        pageCursors.current.clear();
        setCurrentPage(1);
    }, [selectedTopic, selectedDifficulty, searchTerm]);

    /* ---------------- Page Fetch ---------------- */

    async function fetchPage(page: number) {
        setProblemsLoading(true);

        try {
            let q = query(
                collection(db, "problem_index"),
                ...buildBaseConstraints(),
                orderBy("order", "asc"),
                limit(PROBLEMS_PER_PAGE)
            );

            if (page > 1) {
                const cursor = pageCursors.current.get(page - 1);
                if (!cursor) throw new Error("Missing cursor");
                q = query(q, startAfter(cursor));
            }

            const snap = await getDocs(q);

            const docs = snap.docs.map((d) => {
                const data = d.data() as any;
                return {
                    id: d.id,
                    title: data.title,
                    topic: data.topic,
                    difficulty: parseInt(data.level ?? "1", 10),
                    askedIn: Array.isArray(data.askedIn) ? data.askedIn : [],
                    order: data.order ?? 0,
                };
            });

            if (snap.docs.length > 0) {
                pageCursors.current.set(page, snap.docs[snap.docs.length - 1]);
            }

            setProblems(docs);
        } finally {
            setProblemsLoading(false);
        }
    }

    /* ---------------- Progressive Navigation ---------------- */

    async function goToPage(page: number) {
        if (isPageLocked(page)) {
            setShowUpgradeDialog(true);
            return;
        }

        if (pageCursors.current.has(page - 1) || page === 1) {
            setCurrentPage(page);
            return;
        }

        setProblemsLoading(true);

        let p = currentPage;
        while (p < page) {
            await fetchPage(p + 1);
            p++;
        }

        setCurrentPage(page);
    }

    /* ---------------- Load Page ---------------- */

    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage]);

    /* ---------------- Pagination Render ---------------- */

    function renderPaginationItems() {
        const items: React.ReactNode[] = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);

        if (start > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink onClick={() => goToPage(1)}>1</PaginationLink>
                </PaginationItem>
            );
            if (start > 2) items.push(<PaginationEllipsis key="e1" />);
        }

        for (let p = start; p <= end; p++) {
            items.push(
                <PaginationItem key={p}>
                    <PaginationLink
                        isActive={p === currentPage}
                        className={isPageLocked(p) ? "opacity-60" : ""}
                        onClick={() => goToPage(p)}
                    >
                        {p}
                        {isPageLocked(p) && <Lock className="ml-1 h-3 w-3 inline" />}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) items.push(<PaginationEllipsis key="e2" />);
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        className={isPageLocked(totalPages) ? "opacity-60" : ""}
                        onClick={() => goToPage(totalPages)}
                    >
                        {totalPages}
                        {isPageLocked(totalPages) && <Lock className="ml-1 h-3 w-3 inline" />}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    }

    /* ---------------- Render ---------------- */

    return (
        <>
            <Helmet>
                <title>Quant Interview Problems</title>
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-card border rounded-lg overflow-hidden">

                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50">
                        <div className="col-span-1">#</div>
                        <div className="col-span-3">TITLE</div>
                        <div className="col-span-2">TOPIC</div>
                        <div className="col-span-2 text-center">DIFFICULTY</div>
                        <div className="col-span-2 text-center">ASKED IN</div>
                        <div className="col-span-2 text-center">STATUS</div>
                    </div>

                    {/* Rows */}
                    {problems.map((p, idx) => {
                        const globalIndex = (currentPage - 1) * PROBLEMS_PER_PAGE + idx;
                        const locked = isRowLocked(globalIndex);

                        return (
                            <div
                                key={p.id}
                                className={`grid grid-cols-12 gap-4 p-4 border-t ${locked ? "opacity-60" : "hover:bg-muted/30 cursor-pointer"
                                    }`}
                                onClick={() => {
                                    if (locked) {
                                        setShowUpgradeDialog(true);
                                        return;
                                    }
                                    navigate(`/problems/${p.id}`);
                                }}
                            >
                                <div className="col-span-1">{globalIndex + 1}</div>
                                <div className="col-span-3 flex items-center gap-2">
                                    {p.title}
                                    {locked && <Lock className="h-4 w-4" />}
                                </div>
                                <div className="col-span-2">
                                    <Badge variant="outline">{p.topic}</Badge>
                                </div>
                                <div className="col-span-2 text-center">{p.difficulty}/10</div>
                                <div className="col-span-2 flex justify-center gap-1">
                                    {p.askedIn.map((logo) => (
                                        <LogoWithSkeleton
                                            key={idx}
                                            src={logo.logoURL}
                                            alt={logo?.name || '-'}
                                            companyName={logo?.name || '-'}
                                        />
                                    ))}
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {locked ? <Lock /> : <Circle />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
                        {renderPaginationItems()}
                        <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                    </PaginationContent>
                </Pagination>

                {/* Upgrade Dialog */}
                <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upgrade to Premium</DialogTitle>
                            <DialogDescription>
                                Access all problems and pages with Premium.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                                Later
                            </Button>
                            <Button onClick={() => navigate("/premium")}>Upgrade</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Problems;
