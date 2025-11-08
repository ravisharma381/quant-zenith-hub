import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

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
  const purchased = userProfile?.purchasedCourses || [];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, "courses"), where("isPublished", "==", true));
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
  console.log(userProfile);

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
        {!loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isEnrolled = purchased.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                {/* Gradient Header with Instructor Photo */}
                <div className="h-52 relative flex items-center justify-center overflow-hidden rounded-2xl">
                  <img
                    src={course.thumbnailURL}
                    alt={course.title}
                    className="h-full w-full"
                  />
                </div>


                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.author}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Rating and Stats */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.noOfRatings}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.courseDuration}</span>
                  </div>

                  {/* Level Badge */}
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(course.level)} variant="outline">
                      {course.level}
                    </Badge>
                    <span className="text-lg font-bold text-primary">{`${course.currencySymbol} ${course.price.yearly}`}</span>
                  </div>

                  {/* Enroll Button */}
                  <Button
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() =>
                      navigate(
                        isEnrolled
                          ? `/course/${course.slug}/learn`
                          : `/course/${course.slug}/checkout`,
                      )
                    }
                  >
                    {isEnrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>}
      </div>
    </div>
  );
};

export default Courses;