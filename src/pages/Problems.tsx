
// Problems.tsx
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
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
  doc,
  getDoc,
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  isPrivate: boolean;
  level?: string;
}
const topics = ["All", "probability", "brainteasers", "combinatorics"];
const difficulties = ["All", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"];
/* ---------------- Component ---------------- */

const Problems: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const isSubscribed = userProfile?.isPremium === true;

  /* ---------------- State ---------------- */

  const [problems, setProblems] = useState<ProblemDoc[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const isLoggedIn = !!user;

  /* ---------------- Cursor Cache ---------------- */

  const pageCursors = useRef<Map<number, QueryDocumentSnapshot>>(new Map());

  /* ---------------- Helpers ---------------- */

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 1 && difficulty <= 3) {
      return "bg-green-500/20 text-green-400 border-green-500/30";
    } else if (difficulty >= 4 && difficulty <= 6) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    } else if (difficulty >= 7 && difficulty <= 10) {
      return "bg-red-500/20 text-red-400 border-red-500/30";
    }
    return "bg-muted text-muted-foreground";
  };

  const getTopicColor = (topic: string) => {
    const colors = [
      "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
    ];
    return colors[topic.length % colors.length];
  };

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

    const term = searchTerm.trim().toLowerCase();

    if (term.length > 0) {
      c.push(
        where("normalizedTitle", ">=", term),
        where("normalizedTitle", "<=", term + "\uf8ff"),
        orderBy("normalizedTitle")
      );
    }

    if (selectedTopic !== "All") {
      c.push(where("topic", "==", selectedTopic));
    }

    if (selectedDifficulty !== "All") {
      c.push(
        where(
          "level",
          "==",
          Number(selectedDifficulty.replace("Level ", ""))
        )
      );
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

  useEffect(() => {
    if (!isLoggedIn) return;

    const loadProgress = async () => {
      try {
        const progressId = `${user.uid}_${PROBLEMS_COURSE_ID}`;
        const ref = doc(db, "progress", progressId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const arr = snap.data()?.completedProblems || [];
          setCompletedSet(new Set(arr));
        }
      } catch (e) {
        console.error("Error fetching progress:", e);
      }
    };

    loadProgress();
  }, [isLoggedIn]);

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
          isPrivate: data.isPrivate ?? false
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setProblemsLoading(true);

    let p = currentPage;
    while (p < page) {
      await fetchPage(p + 1);
      p++;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- Load Page ---------------- */

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage, selectedTopic, selectedDifficulty, searchTerm]);

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
            className={`relative ${isPageLocked(p) ? 'opacity-70' : ''}`}
            onClick={() => goToPage(p)}
          >
            {p}
            {isPageLocked(p) && <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) items.push(<PaginationEllipsis key="e2" />);
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className={`relative ${isPageLocked(totalPages) ? 'opacity-70' : ''}`}
            onClick={() => goToPage(totalPages)}
          >
            {totalPages}
            {isPageLocked(totalPages) && <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }

  /* ---------------- Render ---------------- */

  const TableSkeleton = () => (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse bg-muted/20">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 flex items-center"><div className="h-4 w-6 bg-muted rounded" /></div>
            <div className="col-span-3 md:col-span-3 flex items-center"><div className="h-4 w-40 bg-muted rounded" /></div>
            <div className="hidden md:block md:col-span-2 items-center justify-center"><div className="h-5 w-20 bg-muted rounded" /></div>
            <div className="col-span-2 md:col-span-2 flex items-center justify-center"><div className="h-5 w-10 bg-muted rounded-full" /></div>
            <div className="col-span-2 md:col-span-2 flex items-center justify-center"><div className="flex gap-2"><div className="h-6 w-6 bg-muted rounded-full" /><div className="h-6 w-6 bg-muted rounded-full" /><div className="h-6 w-6 bg-muted rounded-full" /></div></div>
          </div>
        </div>
      ))}
    </>
  );

  const PaginationSkeleton = () => (
    <div className="flex items-center gap-2 animate-pulse w-full justify-center">
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-12 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Quant Interview Problems - Practice for Top Firms</title>
        <meta name="description" content="Practice quant interview questions frequently asked at top firms." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          {/* Filters row: uses flex-wrap, fits in one row on normal screens, wraps on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div >
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <Input
                className="w-full"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
              <Select value={selectedTopic} onValueChange={(v) => { setSelectedTopic(v); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Select a topic" /></SelectTrigger>
                <SelectContent>
                  {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="">
              <label className="block text-sm font-medium text-foreground mb-2">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(v) => { setSelectedDifficulty(v); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="">
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select value={selectedStatus} onValueChange={(v: any) => { setSelectedStatus(v); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Unsolved">Unsolved</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="flex-1" />

            {/* <div className="flex items-end gap-3">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-foreground mb-2">Go to page</label>
                <div className="flex items-center gap-2">
                  <Input
                    id="gotoPageInput"
                    className="w-28 no-spinner"
                    type="number"
                    min={1}
                    max={totalPages}
                    placeholder="1"
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const page = Number((e.target as HTMLInputElement).value || 1);
                        if (page >= 1 && page <= totalPages) handlePageClick(page);
                      }
                    }}
                  />
                  <Button onClick={() => {
                    const page = Number(goToPageInput || 0);
                    if (page >= 1 && page <= totalPages) handlePageClick(page);
                  }}>Go</Button>
                </div>
              </div>

              {anyFilterApplied && (
                <div className="flex items-center">
                  <Button variant="ghost" onClick={() => {
                    setSearchTerm("");
                    setSelectedTopic("All");
                    setSelectedDifficulty("All");
                    setCurrentPage(1);
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div> */}
          </div>
          {/* Problems Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50">
              <div className="col-span-1 text-sm font-medium text-foreground uppercase tracking-wide">#</div>
              <div className="col-span-4 md:col-span-3 text-sm font-medium text-foreground uppercase tracking-wide">TITLE</div>
              <div className="hidden md:block md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide">TOPIC</div>
              <div className="hidden md:block col-span-2 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">DIFFICULTY</div>
              <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">ASKED IN</div>
              <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">STATUS</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {problemsLoading && <TableSkeleton />}
              {!problemsLoading && problems.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No problems found for this page.</div>
              )}
              {!problemsLoading && problems.map((problem, idx) => {
                const globalIndex = (currentPage - 1) * PROBLEMS_PER_PAGE + idx + 1;
                let locked = true;
                if (isSubscribed) {
                  locked = false
                } else {
                  locked = problem.isPrivate
                }

                return (
                  <div
                    key={problem.id}
                    className={`p-4 transition-colors ${locked ? "opacity-60" : "hover:bg-muted/30 cursor-pointer"} group`}
                    onClick={() => {
                      if (locked) {
                        setShowUpgradeDialog(true);
                        return;
                      }
                      navigate(`/problems/${problem.id}`, {
                        state: {
                          fromProblems: true,
                          page: currentPage,
                          searchTerm,
                          selectedTopic,
                          selectedDifficulty,
                        }
                      });
                    }}
                  >
                    <div className="grid grid-cols-12 gap-4 relative">

                      {/* # */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-muted-foreground">{globalIndex}</span>
                      </div>

                      {/* Title */}
                      <div className="col-span-4 md:col-span-3 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold ${locked ? "text-muted-foreground" : "text-foreground"
                              } group-hover:text-primary transition-colors`}
                          >
                            {problem.title}
                          </h3>
                          {locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>

                      {/* Topic */}
                      <div className="hidden md:block md:col-span-2 flex items-center justify-center">
                        <Badge
                          className={`${getTopicColor(
                            problem.topic
                          )} text-center inline-flex items-center justify-center px-2 py-1`}
                          variant="outline"
                        >
                          {problem.topic}
                        </Badge>
                      </div>

                      {/* Difficulty */}
                      <div className="hidden col-span-2 md:col-span-2 md:flex items-center justify-center">
                        <div
                          className={`${getDifficultyColor(
                            problem.difficulty
                          )} inline-flex items-center rounded-full border px-3 md:px-5 py-0.5 text-xs md:text-sm font-semibold`}
                        >
                          {problem.difficulty}/10
                        </div>
                      </div>

                      {/* Asked In */}
                      <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                        <div className="flex flex-wrap gap-1 md:gap-2 justify-center items-center">
                          {problem.askedIn.length > 0 ? problem.askedIn.map((logo, idx) => (
                            <LogoWithSkeleton
                              key={idx}
                              src={logo.logoURL}
                              alt={logo?.name || '-'}
                              companyName={logo?.name || '-'}
                            />
                          )) : <span className="text-muted-foreground">-</span>}
                        </div>
                      </div>

                      <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                {problem.isPrivate && !isSubscribed ? (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                ) : completedSet.has(problem.id) ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" sideOffset={8}>
                              {problem.isPrivate && !isSubscribed
                                ? "Premium Problem"
                                : completedSet.has(problem.id)
                                  ? "Solved"
                                  : "Unsolved"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 w-full overflow-x-hidden">
            <Pagination>
              <PaginationContent className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1">
                {problemsLoading && <PaginationItem><div className="w-full"><PaginationSkeleton /></div></PaginationItem>}
                {!problemsLoading && (
                  <>
                    {currentPage > 1 && <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />}
                    {renderPaginationItems()}
                    <PaginationNext onClick={() => goToPage(currentPage + 1)} />
                  </>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
        {/* Upgrade Dialog */}
        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                Upgrade to Premium
              </DialogTitle>
              <DialogDescription>
                This content is locked. Upgrade to Premium to access 1,000+ high-quality problems and in-depth courses, and prepare efficiently for quant interviews.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Maybe Later</Button>
              <Button onClick={() => navigate("/premium")}>Upgrade Now</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Problems;
