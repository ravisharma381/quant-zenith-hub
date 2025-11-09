import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Course } from "./Courses";
import CourseCard from "@/components/CourseCard";

const MyCourses = () => {
  const { userProfile } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setLoading(true);
      try {
        if (!userProfile?.purchasedCourses?.length) {
          setMyCourses([]);
          setLoading(false);
          return;
        }

        // ✅ Filter invalid IDs
        const validIds = userProfile.purchasedCourses.filter(
          (id: string) => typeof id === "string" && id.trim() !== ""
        );

        if (validIds.length === 0) {
          setMyCourses([]);
          setLoading(false);
          return;
        }

        // ✅ Firestore supports only 10 items in an "in" clause — so batching in case :)
        const allCourses: Course[] = [];
        for (let i = 0; i < validIds.length; i += 10) {
          const batch = validIds.slice(i, i + 10);
          const q = query(collection(db, "courses"), where("__name__", "in", batch));
          const snapshot = await getDocs(q);
          allCourses.push(
            ...snapshot.docs.map(
              (doc) => ({ id: doc.id, ...(doc.data() as Omit<Course, "id">) })
            )
          );
        }

        setMyCourses(allCourses);
      } catch (err) {
        console.error("❌ Error fetching my courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [userProfile]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Courses</h1>
          <p className="text-muted-foreground text-lg">
            Continue your learning journey
          </p>
        </div>

        {
          loading && <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="flex flex-col items-center gap-6">
              {/* Scaling Circle */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                <div className="w-12 h-12 rounded-full bg-primary"></div>
              </div>

              {/* Loading Text */}
              <p className="text-muted-foreground text-lg font-medium">
                Loading My Courses...
              </p>
            </div>
          </div>
        }

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCourses.map((course) => {
            return (
              <CourseCard key={course.id} course={course} isEnrolled={true} />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;