// Problems.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LogoWithSkeleton from "@/components/LogoWithSkeleton";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  getCountFromServer,
  startAt,
  endAt,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { PROBLEMS_COURSE_ID, PROBLEMS_PER_PAGE, SHOW_FREE_PAGES } from "@/statics";


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

const Problems: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const isSubscribed = userProfile?.isPremium === true;

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Solved" | "Unsolved">("All");
  const [goToPageInput, setGoToPageInput] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Data state
  const [problems, setProblems] = useState<ProblemDoc[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(60);
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const location = useLocation();

  const hasNextPage = currentPage < totalPages;
  const isLoggedIn = !!user;

  // Static lists
  const topics = ["All", "probability", "brainteasers", "combinatorics"];
  const difficulties = ["All", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10"];

  // helpers for colors (unchanged)
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


  // ---------- Fetch progress (only if logged in) ----------
  // Option B: fetch progress later and update badges without refetching problems.
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

  // ---------- Fetch total count (only when filters that affect count change) ----------
  useEffect(() => {
    let mounted = true;

    const fetchCount = async () => {
      try {
        // If searchTerm present, we will compute total pages after fetching search results.
        if (searchTerm && searchTerm.trim().length > 0) {
          return;
        }

        let countQuery;
        if (isSubscribed) {
          countQuery = query(
            collection(db, "topics"),
            where("courseId", "==", PROBLEMS_COURSE_ID),
            where("type", "==", "question")
          );
        } else {
          countQuery = query(
            collection(db, "topics"),
            where("courseId", "==", PROBLEMS_COURSE_ID),
            where("type", "==", "question"),
            where("isPrivate", "==", false)
          );
        }
        const snapshot = await getCountFromServer(countQuery);
        const totalItems = snapshot.data().count || 0;
        if (!mounted) return;
        if (!isSubscribed) {
          setTotalPages(60)
        } else {
          setTotalPages(Math.max(1, Math.ceil(totalItems / PROBLEMS_PER_PAGE)));
        }
      } catch (err) {
        console.error("Error fetching total count:", err);
      }
    };

    fetchCount();
    return () => { mounted = false; };
    // Dependencies that change the total count (topic/difficulty/search)
  }, [selectedTopic, selectedDifficulty]);

  // ---------- Fetch problems (core) ----------
  // This effect runs whenever: page, filters, search, status or completedSet (only if status != All)
  useEffect(() => {
    let mounted = true;

    const fetchProblems = async () => {
      // guard: free users cannot fetch beyond free pages
      if (!isSubscribed && currentPage > SHOW_FREE_PAGES) {
        setProblems([]);
        setProblemsLoading(false);
        return;
      }

      setProblemsLoading(true);

      try {
        // SEARCH mode: title prefix
        if (searchTerm && searchTerm.trim().length > 0) {
          const constraints: any[] = [
            where("courseId", "==", PROBLEMS_COURSE_ID),
            where("type", "==", "question"),
          ];

          if (selectedTopic !== "All") constraints.push(where("topic", "==", selectedTopic));
          if (selectedDifficulty !== "All") {
            const level = Number(selectedDifficulty.replace("Level ", ""));
            if (!Number.isNaN(level)) constraints.push(where("level", "==", String(level)));
          }

          // For free pages, still restrict to non-private first pages
          if (currentPage <= SHOW_FREE_PAGES) {
            // constraints.push(where("isPrivate", "==", false));
          }

          const q = query(
            collection(db, "topics"),
            ...constraints,
            orderBy("title"),
            startAt(searchTerm),
            endAt(searchTerm + "\uf8ff"),
            limit(1000) // safe upper bound for search results
          );

          const snap = await getDocs(q);
          if (!mounted) return;

          let docs = snap.docs.map((d) => {
            const data = d.data() as any;
            return {
              id: d.id,
              title: data.title ?? "",
              topic: data.topic ?? "",
              difficulty: parseInt(data.level ?? "1", 10),
              askedIn: Array.isArray(data.askedIn) ? data.askedIn : [],
              order: data.order ?? 0,
              isPrivate: data.isPrivate ?? false,
            } as ProblemDoc;
          });

          // apply solved/unsolved filter client-side (requires progress)
          if (selectedStatus === "Solved") docs = docs.filter((d) => completedSet.has(d.id));
          else if (selectedStatus === "Unsolved") docs = docs.filter((d) => !completedSet.has(d.id));

          const tp = Math.max(1, Math.ceil(docs.length / PROBLEMS_PER_PAGE));

          if (!isSubscribed) {
            setTotalPages(60)
          } else {
            setTotalPages(tp);
          }

          const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
          const pageDocs = docs.slice(startIndex, startIndex + PROBLEMS_PER_PAGE);

          setProblems(pageDocs);
          setProblemsLoading(false);
          return;
        }

        // Non-search: order-based pagination
        const startOrder = (currentPage - 1) * PROBLEMS_PER_PAGE + 1;
        const constraints: any[] = [
          where("courseId", "==", PROBLEMS_COURSE_ID),
          where("type", "==", "question"),
          where("order", ">=", startOrder),
        ];

        if (selectedTopic !== "All") constraints.push(where("topic", "==", selectedTopic));
        if (selectedDifficulty !== "All") {
          const level = Number(selectedDifficulty.replace("Level ", ""));
          if (!Number.isNaN(level)) constraints.push(where("level", "==", String(level)));
        }

        // free pages show only non-private
        if (currentPage <= SHOW_FREE_PAGES) {
          // constraints.push(where("isPrivate", "==", false));
        }

        const q = query(
          collection(db, "topics"),
          ...constraints,
          orderBy("order", "asc"),
          limit(PROBLEMS_PER_PAGE)
        );

        const snap = await getDocs(q);
        if (!mounted) return;

        let docs = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title ?? "",
            topic: data.topic ?? "",
            difficulty: parseInt(data.level ?? "1", 10),
            askedIn: Array.isArray(data.askedIn) ? data.askedIn : [],
            order: data.order ?? 0,
            isPrivate: data.isPrivate ?? false,
          } as ProblemDoc;
        });

        // client-side solved/unsolved filter
        if (selectedStatus === "Solved") docs = docs.filter((d) => completedSet.has(d.id));
        else if (selectedStatus === "Unsolved") docs = docs.filter((d) => !completedSet.has(d.id));

        setProblems(docs);

        // optionally refresh totalPages (non-search)
        try {
          const countQuery = query(
            collection(db, "topics"),
            where("courseId", "==", PROBLEMS_COURSE_ID),
            where("type", "==", "question")
          );
          const countSnap = await getCountFromServer(countQuery);
          const totalItems = countSnap.data().count || 0;
          setTotalPages(Math.max(1, Math.ceil(totalItems / PROBLEMS_PER_PAGE)));
        } catch (err) {
          // ignore count errors
        }
      } catch (err) {
        console.error("Error fetching problems:", err);
        setProblems([]);
      } finally {
        if (mounted) setProblemsLoading(false);
      }
    };

    fetchProblems();
    return () => { mounted = false; };
    // Note: include completedSet only when user explicitly requested solved/unsolved filter
  }, [
    currentPage,
    selectedTopic,
    selectedDifficulty,
    searchTerm,
    // include completedSet dependency only if user asked for solved/unsolved.
    selectedStatus === "All" ? null : completedSet,
    selectedStatus
  ]);

  useEffect(() => {
    if (!location.state?.fromProblems) return;

    const saved = location.state;

    setCurrentPage(saved.page ?? 1);
    setSearchTerm(saved.searchTerm ?? "");
    setSelectedTopic(saved.selectedTopic ?? "All");
    setSelectedDifficulty(saved.selectedDifficulty ?? "All");
    setSelectedStatus(saved.selectedStatus ?? "All");
    setGoToPageInput(saved.goToPageInput ?? "");

  }, [location.state]);

  // Pagination / navigation handler
  const handlePageClick = (page: number) => {
    if (page < 1) return;
    if (page > totalPages) return;
    if (!isSubscribed && page > SHOW_FREE_PAGES) {
      setShowUpgradeDialog(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // render pagination items (dynamic window)
  const renderPaginationItems = () => {
    const items: React.ReactNode[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) startPage = Math.max(1, endPage - maxPagesToShow + 1);

    // leading
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(1); }} className={`relative ${isPageLocked(1) ? "opacity-70" : ""}`}>
            1
            {isPageLocked(1) && <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />}
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
    }

    // window
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink href="#" isActive={currentPage === page} onClick={(e) => { e.preventDefault(); handlePageClick(page); }} className={`relative ${isPageLocked(page) ? "opacity-70" : ""}`}>
            {page}
            {isPageLocked(page) && <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // trailing
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageClick(totalPages); }} className={`relative ${isPageLocked(totalPages) ? "opacity-70" : ""}`}>
            {totalPages}
            {isPageLocked(totalPages) && <Lock className="absolute -top-1 -right-1 h-3 w-3 text-purple-500" />}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  function isPageLocked(page: number) {
    return !isSubscribed && page > SHOW_FREE_PAGES;
  }

  // Skeletons
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

  // Clear filters visible?
  // const anyFilterApplied = useMemo(() => {
  //   return !!(searchTerm || (selectedTopic && selectedTopic !== "All") || (selectedDifficulty && selectedDifficulty !== "All") || (selectedStatus && selectedStatus !== "All"));
  // }, [searchTerm, selectedTopic, selectedDifficulty, selectedStatus]);

  // Render
  return (
    <>
      <Helmet>
        <title>Quant Interview Questions & Problems – Practice for Top Firms</title>
        <meta name="description" content="Practice quant interview questions frequently asked at top firms." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Filters row: uses flex-wrap, fits in one row on normal screens, wraps on small screens */}
          {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            
            <div >
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <Input
                className="w-full"
                placeholder="Search (prefix)..."
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

            <div className="">
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <Select value={selectedStatus} onValueChange={(v: any) => { setSelectedStatus(v); setCurrentPage(1); }}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Solved">Solved</SelectItem>
                  <SelectItem value="Unsolved">Unsolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

             <div className="flex items-end gap-3">
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
                    setSelectedStatus("All");
                    setGoToPageInput("");
                    setCurrentPage(1);
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div> 
          </div>*/}

          {/* Problems Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50">
              <div className="col-span-1 text-sm font-medium text-foreground uppercase tracking-wide">#</div>
              <div className="col-span-3 md:col-span-3 text-sm font-medium text-foreground uppercase tracking-wide">TITLE</div>
              <div className="hidden md:block md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide">TOPIC</div>
              <div className="col-span-2 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">DIFFICULTY</div>
              <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">ASKED IN</div>
              <div className="col-span-3 md:col-span-2 text-sm font-medium text-foreground uppercase tracking-wide text-center">STATUS</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {problemsLoading && <TableSkeleton />}

              {!problemsLoading && problems.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">No problems found for this page.</div>
              )}

              {!problemsLoading && problems.map((problem, index) => {
                const displayIndex = (currentPage - 1) * PROBLEMS_PER_PAGE + index + 1;
                const locked = problem.isPrivate && !isSubscribed;
                const completed = completedSet.has(problem.id);

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
                          selectedStatus,
                          goToPageInput
                        }
                      });
                    }}
                  >
                    <div className="grid grid-cols-12 gap-4 relative">

                      {/* # */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-muted-foreground">{displayIndex}</span>
                      </div>

                      {/* Title */}
                      <div className="col-span-3 md:col-span-3 flex items-center gap-2">
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
                      <div className="col-span-2 md:col-span-2 flex items-center justify-center">
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
              <PaginationContent
                className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1"
              >
                {problemsLoading && <PaginationItem><div className="w-full"><PaginationSkeleton /></div></PaginationItem>}

                {!problemsLoading && (
                  <>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageClick(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!hasNextPage) return;
                          if (!isSubscribed && currentPage >= SHOW_FREE_PAGES) {
                            setShowUpgradeDialog(true);
                            return;
                          }
                          handlePageClick(currentPage + 1);
                        }}
                        className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
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
                This content is locked. Upgrade to Premium to access all 1200+
                problems and unlock your full potential in quant finance
                interviews.
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
