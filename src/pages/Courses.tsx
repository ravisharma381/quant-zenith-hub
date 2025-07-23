import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, Play, CheckCircle } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Quantitative Finance Fundamentals",
      description: "Master the core concepts of quantitative finance from basic statistics to advanced modeling",
      instructor: "Dr. Sarah Chen",
      rating: 4.8,
      students: 12453,
      duration: "8 weeks",
      lessons: 24,
      level: "Beginner",
      progress: 65,
      enrolled: true,
      premium: false
    },
    {
      id: 2,
      title: "Advanced Derivatives Pricing",
      description: "Deep dive into exotic options, structured products, and advanced pricing models",
      instructor: "Prof. Michael Rodriguez",
      rating: 4.9,
      students: 8742,
      duration: "12 weeks",
      lessons: 36,
      level: "Advanced",
      progress: 0,
      enrolled: false,
      premium: true
    },
    {
      id: 3,
      title: "Risk Management & VaR Models",
      description: "Comprehensive coverage of market risk, credit risk, and operational risk management",
      instructor: "Dr. James Liu",
      rating: 4.7,
      students: 9876,
      duration: "10 weeks",
      lessons: 30,
      level: "Intermediate",
      progress: 100,
      enrolled: true,
      premium: false
    },
    {
      id: 4,
      title: "Algorithmic Trading Strategies",
      description: "Build and backtest trading algorithms using Python and quantitative methods",
      instructor: "Emma Thompson",
      rating: 4.6,
      students: 6543,
      duration: "6 weeks",
      lessons: 18,
      level: "Intermediate",
      progress: 25,
      enrolled: true,
      premium: true
    },
    {
      id: 5,
      title: "Fixed Income Analytics",
      description: "Master bond pricing, yield curve modeling, and fixed income portfolio management",
      instructor: "Dr. Robert Kim",
      rating: 4.8,
      students: 5432,
      duration: "8 weeks",
      lessons: 24,
      level: "Intermediate",
      progress: 0,
      enrolled: false,
      premium: false
    },
    {
      id: 6,
      title: "Machine Learning in Finance",
      description: "Apply ML techniques to financial problems including fraud detection and portfolio optimization",
      instructor: "Dr. Anna Petrov",
      rating: 4.9,
      students: 11234,
      duration: "14 weeks",
      lessons: 42,
      level: "Advanced",
      progress: 0,
      enrolled: false,
      premium: true
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const enrolledCourses = courses.filter(course => course.enrolled);
  const availableCourses = courses.filter(course => !course.enrolled);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive quantitative finance education from industry experts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="text-2xl font-bold text-primary">{enrolledCourses.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">
                    {enrolledCourses.filter(c => c.progress === 100).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-primary">147</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)}%
                  </p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        {enrolledCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">My Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-card transition-all duration-300 border-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                          {course.title}
                          {course.premium && <Star className="w-5 h-5 text-primary" />}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                          by {course.instructor}
                        </p>
                      </div>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {course.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.lessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-foreground">{course.rating}</span>
                      </div>
                    </div>
                    <Button className="w-full" variant={course.progress === 100 ? "outline" : "premium"}>
                      <Play className="w-4 h-4 mr-2" />
                      {course.progress === 100 ? "Review Course" : "Continue Learning"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Courses */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-card transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {course.title}
                      {course.premium && <Star className="w-4 h-4 text-primary" />}
                    </CardTitle>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    by {course.instructor}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-foreground">{course.rating}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm" 
                    variant={course.premium ? "premium" : "default"}
                  >
                    {course.premium ? "Enroll Premium" : "Enroll Free"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;