import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";

import { ArrowLeft, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PROBLEMS_COURSE_ID } from "@/statics";
const COURSE_ID = "F1KgN5OpoAcUBQh82CMB";

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 animate-pulse">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-16 h-16 rounded-xl bg-muted shrink-0" />

        <div className="min-w-0">
          <div className="h-8 w-56 rounded bg-muted mb-3" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
};

const LevelSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      {/* Accordion Header */}
      <div className="w-full flex items-center justify-between px-6 py-4">
        <div className="h-6 w-32 rounded bg-muted" />

        <div className="w-5 h-5 rounded bg-muted" />
      </div>

      {/* Problems */}
      <div className="border-t border-border">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-6 py-4 ${idx !== 3 ? "border-b border-border/50" : ""
              }`}
          >
            <div className="h-4 w-56 rounded bg-muted" />

            <div className="h-7 w-24 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaylistDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="h-5 w-32 rounded bg-muted mb-6 animate-pulse" />

        {/* Header */}
        <HeaderSkeleton />

        {/* Levels */}
        <div className="space-y-4">
          <LevelSkeleton />
          <LevelSkeleton />
          <LevelSkeleton />
        </div>
      </div>
    </div>
  );
};

interface PlaylistProps {
  playlistId?: string | null;
  onBack?: () => void;
}

type TopicType = {
  id: string;
  title: string;
  level?: number | string;
};

const chunk = <T,>(arr: T[], size: number): T[][] =>
  arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) {
      acc.push(arr.slice(i, i + size));
    }

    return acc;
  }, []);

const PlaylistLogo = ({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted rounded-xl" />
      )}

      {src ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
            }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
          QP
        </div>
      )}
    </div>
  );
};

const CompanyPlaylist: React.FC<PlaylistProps> = ({
  playlistId: propPlaylistId,
  onBack,
}) => {
  const navigate = useNavigate();

  const params = useParams();

  const routePlaylistId = params.companyId;

  const playlistId = propPlaylistId || routePlaylistId;

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(true);

  const [playlist, setPlaylist] = useState<any | null>(null);

  const [topicsMap, setTopicsMap] = useState<Record<string, any>>({});

  const [error, setError] = useState<string | null>(null);

  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({});

  const [completedProblemsSet, setCompletedProblemsSet] = useState<Set<string>>(new Set());

  const { user } = useAuth();


  const loadProblemsProgress = async () => {
    try {
      const progressId = `${user?.uid}_${PROBLEMS_COURSE_ID}`;
      const ref = doc(db, "progress", progressId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const arr = snap.data()?.completedProblems || [];

        setCompletedProblemsSet(new Set(arr));
      }
    } catch (e) {
      console.error("Error fetching progress:", e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        if (!playlistId) {
          if (mounted) {
            setError("Missing playlist id");
          }

          return;
        }

        const playlistSnap = await getDoc(
          doc(db, "playlists", playlistId)
        );

        if (!playlistSnap.exists()) {
          if (mounted) {
            setError("Playlist not found");
          }

          return;
        }

        const playlistData: any = {
          id: playlistSnap.id,
          ...playlistSnap.data(),
        };

        if (!mounted) {
          return;
        }

        setPlaylist(playlistData);

        const topicIds = Array.isArray(playlistData.topicIds)
          ? playlistData.topicIds.filter(Boolean)
          : [];

        const map: Record<string, any> = {};

        const batches = chunk(topicIds, 10);

        for (const batch of batches) {
          const q = query(
            collection(db, "problem_index"),
            where("__name__", "in", batch)
          );

          const snaps = await getDocs(q);

          snaps.forEach((d) => {
            map[d.id] = {
              id: d.id,
              ...d.data(),
            };
          });
        }

        if (!mounted) {
          return;
        }

        setTopicsMap(map);
      } catch (err) {
        console.error("Error loading playlist detail:", err);

        if (mounted) {
          setError("Failed to load playlist detail");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [playlistId]);

  const topics = useMemo(() => {
    if (!playlist) {
      return [];
    }

    const ids = Array.isArray(playlist.topicIds)
      ? playlist.topicIds
      : [];

    return ids
      .map((id: string) => topicsMap[id])
      .filter(Boolean);
  }, [playlist, topicsMap]);

  useEffect(() => {

    let mounted = true;

    const load = async () => {
      setProgressLoading(true);

      try {
        if (user?.uid) {
          await loadProblemsProgress();
        }

      } catch (err) {
        console.error("Error loading chapters:", err);
      } finally {
        if (mounted) setProgressLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [user]);

  const groupedLevels = useMemo(() => {
    const grouped: Record<string, TopicType[]> = {};

    topics.forEach((topic: TopicType) => {
      const level = (topic.level ?? "1").toString();

      grouped[level] = grouped[level] || [];

      grouped[level].push(topic);
    });

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => Number(a) - Number(b)
    );

    return sortedKeys.map((key) => ({
      id: `level-${key}`,
      name: `Level ${key}`,
      level: key,
      problems: grouped[key],
    }));
  }, [topics]);

  useEffect(() => {
    if (!groupedLevels.length) {
      return;
    }

    const initialState: Record<string, boolean> = {};

    groupedLevels.forEach((level, index) => {
      initialState[level.id] = index === 0;
    });

    setOpenLevels(initialState);
  }, [groupedLevels]);

  const toggleLevel = (id: string) => {
    setOpenLevels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div>
        <PlaylistDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        {error}
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-gray-400 p-4">
        Playlist not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto min-h-[94vh]">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Playlists
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 bg-card border border-border rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <PlaylistLogo
                src={playlist.logoURL}
                alt={playlist.heading}
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {playlist.heading}
              </h1>

              {!!playlist.subheading && (
                <p className="text-muted-foreground mt-1">
                  {playlist.subheading}
                </p>
              )}
            </div>
          </div>

          {!!playlist.description && (
            <div className="flex-1">
              <p className="text-muted-foreground leading-relaxed">
                {playlist.description}
              </p>
            </div>
          )}
        </div>

        {/* Levels */}
        {groupedLevels.length > 0 ? (
          <div className="space-y-4">
            {groupedLevels.map((level) => {
              const isOpen = openLevels[level.id];

              return (
                <div
                  key={level.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleLevel(level.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xl font-bold text-foreground">
                      {level.name}
                    </span>

                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-border">
                      {level.problems.map(
                        (
                          problem: TopicType,
                          idx: number
                        ) => (
                          <Link
                            key={problem.id}
                            to={`/problems/${problem.id}`}
                            target="_blank"
                          >
                            <div
                              className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${idx !==
                                level.problems.length - 1
                                ? "border-b border-border/50"
                                : ""
                                }`}
                            >
                              <span className="text-foreground font-medium">
                                {problem.title}
                              </span>

                              <Badge
                                variant="outline"
                                className={
                                  completedProblemsSet.has(
                                    problem.id
                                  )
                                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                                    : "bg-red-500/10 text-red-400 border-red-500/30"
                                }
                              >
                                {completedProblemsSet.has(
                                  problem.id
                                )
                                  ? "Solved"
                                  : "Not Solved"}
                              </Badge>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 p-4">
            No topics found.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPlaylist;