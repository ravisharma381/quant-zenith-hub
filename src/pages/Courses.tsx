import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import CourseCard from "@/components/CourseCard";

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  thumbnailURL: string;
  gradient?: string; // for UI themes (optional)

  category: string;
  level: string;
  courseDuration: string;
  totalChapters: number;

  price: {
    yearly: number;
    lifetime: number;
  };

  currency: "USD" | "INR"; // restrict to valid options
  currencySymbol: "$" | "₹";

  rating: string; // e.g. "4.7"
  noOfRatings: string; // e.g. "451K ratings"
  noOfStudentsEnrolled: number;

  tags: string[];
  isPublished: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile }: any = useAuth();
  const isPremium = userProfile?.isPremium || false;

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, "courses"), where("isPublished", "==", true), where("isProblemType", "==", false), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Course, "id">),
      })) as Course[];

      setCourses(list);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Expert-Led Courses</h1>
          <p className="text-muted-foreground text-lg">
            Learn from industry professionals and academics
          </p>
        </div>

        {/* Courses Grid */}
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
                Loading Courses
              </p>
            </div>
          </div>
        }
        {!loading && <div className="space-y-6">
          {courses.map((course) => {
            const isEnrolled = isPremium;
            return (
              <CourseCard key={course.id} course={course} isEnrolled={isEnrolled} />
            )
          })}
        </div>}
      </div>
    </div>
  );
};

export default Courses;