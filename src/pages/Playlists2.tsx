import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Helmet } from "react-helmet-async";


const COURSE_ID = "F1KgN5OpoAcUBQh82CMB";

type FirebasePlaylist = {
  heading: string;
  logoURL?: string;
  courseId: string;
  topicIds?: string[];
  keywords?: string[];
  sortOrder?: number;
  description?: string;
  subheading?: string;
};

type PlaylistItem = {
  id: string;
  name: string;
  problems: number;
  topics: number;
  color: string;
  iconBg: string;
  icon: string;
  description?: string;
  logoURL?: string;
};

const colors = [
  {
    color: "bg-purple-500/20 border-purple-500/30",
    iconBg: "bg-purple-500/10",
  },
  {
    color: "bg-blue-500/20 border-blue-500/30",
    iconBg: "bg-blue-500/10",
  },
  {
    color: "bg-orange-500/20 border-orange-500/30",
    iconBg: "bg-orange-500/10",
  },
  {
    color: "bg-green-500/20 border-green-500/30",
    iconBg: "bg-green-500/10",
  },
  {
    color: "bg-yellow-500/20 border-yellow-500/30",
    iconBg: "bg-yellow-500/10",
  },
  {
    color: "bg-cyan-500/20 border-cyan-500/30",
    iconBg: "bg-cyan-500/10",
  },
  {
    color: "bg-pink-500/20 border-pink-500/30",
    iconBg: "bg-pink-500/10",
  },
  {
    color: "bg-red-500/20 border-red-500/30",
    iconBg: "bg-red-500/10",
  },
  {
    color: "bg-indigo-500/20 border-indigo-500/30",
    iconBg: "bg-indigo-500/10",
  },
  {
    color: "bg-emerald-500/20 border-emerald-500/30",
    iconBg: "bg-emerald-500/10",
  },
];

const categories = [
  { id: "company", label: "Company Specific", icon: "🏢" },
  { id: "quick-revision", label: "Quick Revision", icon: "⚡" },
  { id: "tags", label: "Tags", icon: "🏷️" },
  { id: "misc", label: "Miscellaneous", icon: "✨" },
] as const;

const PlaylistCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card h-[134px] p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="h-4 w-32 rounded bg-muted mb-3" />

          <div className="space-y-2 mb-4">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
          </div>

          <div className="h-3 w-24 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Tabs Skeleton */}
        <div className="inline-flex flex-wrap gap-2 p-2 mb-8 rounded-full bg-card border border-border">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-10 w-36 rounded-full bg-muted animate-pulse"
            />
          ))}
        </div>

        {/* Heading Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-80 rounded bg-muted animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <PlaylistCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlaylistLogo = ({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt: string;
  fallback: string;
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
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
            }`}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {fallback}
        </div>
      )}
    </div>
  );
};

const Playlists = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory =
    (searchParams.get(
      "category"
    ) as (typeof categories)[number]["id"]) || "company";

  const [playlists, setPlaylists] = useState<{
    company: PlaylistItem[];
    "quick-revision": PlaylistItem[];
    tags: PlaylistItem[];
    misc: PlaylistItem[];
  }>({
    company: [],
    "quick-revision": [],
    tags: [],
    misc: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsRef = collection(db, "playlists");

        const q = query(
          playlistsRef,
          where("courseId", "==", COURSE_ID),
          orderBy("sortOrder", "asc")
        );

        const snapshot = await getDocs(q);

        const grouped = {
          company: [] as PlaylistItem[],
          "quick-revision": [] as PlaylistItem[],
          tags: [] as PlaylistItem[],
          misc: [] as PlaylistItem[],
        };

        snapshot.docs.forEach((doc, index) => {
          const data = doc.data() as FirebasePlaylist;

          const randomColor = colors[index % colors.length];

          const item: PlaylistItem = {
            id: doc.id,
            name: data.heading,
            problems: data.topicIds?.length || 0,
            topics: data.topicIds?.length || 0,
            color: randomColor.color,
            iconBg: randomColor.iconBg,
            icon: "📚",
            description:
              data.description ||
              data.subheading ||
              "Curated problems to help you prepare effectively.",
            logoURL: data.logoURL,
          };

          const keywords = data.keywords || [];

          if (keywords.includes("Company Specific")) {
            grouped.company.push(item);
          } else if (keywords.includes("Quick revision")) {
            grouped["quick-revision"].push(item);
          } else if (keywords.length > 0) {
            grouped.tags.push(item);
          } else {
            grouped.misc.push(item);
          }
        });

        setPlaylists(grouped);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const items = useMemo(() => {
    if (activeCategory === "quick-revision") {
      return playlists["quick-revision"];
    }

    if (activeCategory === "tags") {
      return playlists.tags;
    }

    if (activeCategory === "misc") {
      return playlists.misc;
    }

    return playlists.company;
  }, [activeCategory, playlists]);

  const heading = useMemo(() => {
    if (activeCategory === "quick-revision") {
      return "Quick revision playlists";
    }

    if (activeCategory === "tags") {
      return "Playlists by topic & tag";
    }

    if (activeCategory === "misc") {
      return "Miscellaneous playlists";
    }

    return "Curated quant interview question playlists";
  }, [activeCategory]);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>
          Playlists | QuantProf
        </title>

        <meta
          name="description"
          content={
            `Practice curated quantitative interview questions from the playlists collection.`
          }
        />

        <meta
          property="og:title"
          content={
            `Practice curated quantitative interview questions from the playlists collection.`
          }
        />
      </Helmet>

      <div className="px-4 py-8 h-full overflow-y-auto mx-0">
        <div className="max-w-5xl mx-auto">
          {/* Category Tabs */}
          <div className="inline-flex flex-wrap gap-2 p-2 mb-8 rounded-full bg-card border border-border">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-colors ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-foreground/70 hover:text-foreground hover:bg-muted/40"
                    }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {heading}
            </h1>
          </div>
          <div className="flex-1 min-h-[70vh] overflow-y-auto pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((company) => (
                <Card
                  key={company.id}
                  className="relative overflow-hidden bg-card border border-border hover:-translate-y-1 transition-transform duration-300 cursor-pointer group h-[134px]"
                  onClick={() => navigate(`/playlists/${company.id}`)}
                >
                  {/* Decorative gradient blob */}
                  <div
                    className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-60 ${company.iconBg}`}
                  />

                  <CardContent className="relative p-5 h-full">
                    <div className="flex items-start gap-4 h-full">
                      <div
                        className={`flex items-center justify-center w-14 h-14 rounded-xl text-3xl shrink-0 border border-border/60 bg-background/40 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 overflow-hidden`}
                      >
                        <PlaylistLogo
                          src={company.logoURL}
                          alt={company.name}
                          fallback={company.icon}
                        />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="text-base font-bold text-foreground leading-tight mb-1.5">
                          {company.name}
                        </h3>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {company.description ??
                            "Curated problems to help you prepare effectively."}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mt-auto">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {company.problems} problems
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Playlists;