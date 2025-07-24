import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, Star } from "lucide-react";

const CourseLanding = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock course data - in real app this would come from API
  const course = {
    id: 1,
    title: "Quantitative Finance Fundamentals",
    instructor: "Dr. Michael Rodriguez",
    description: "Master the mathematical foundations of quantitative finance with this comprehensive course designed for both beginners and professionals looking to strengthen their quantitative skills.",
    duration: "47.1 total hours",
    students: 451000,
    rating: 4.7,
    reviews: "451K ratings",
    price: "$149",
    gradient: "from-orange-400 to-yellow-500",
    features: [
      "Mathematical foundations of finance",
      "Portfolio theory and optimization",
      "Risk management techniques",
      "Options pricing models",
      "Fixed income analysis",
      "Monte Carlo simulations",
      "Real-world case studies",
      "Lifetime access to materials"
    ],
    curriculum: [
      { module: "Introduction to Quantitative Finance", lessons: 8, duration: "3.5 hours" },
      { module: "Mathematical Foundations", lessons: 12, duration: "5.2 hours" },
      { module: "Portfolio Theory", lessons: 10, duration: "4.8 hours" },
      { module: "Risk Management", lessons: 15, duration: "6.5 hours" },
      { module: "Options and Derivatives", lessons: 18, duration: "8.2 hours" },
      { module: "Fixed Income", lessons: 14, duration: "6.1 hours" },
      { module: "Advanced Topics", lessons: 20, duration: "9.8 hours" },
      { module: "Practical Applications", lessons: 16, duration: "7.0 hours" }
    ]
  };

  const handleEnroll = () => {
    navigate(`/course-content/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Course Info */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-bold text-foreground">{course.rating}</span>
                <span className="text-muted-foreground ml-1">({course.reviews})</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-muted-foreground mr-1" />
                <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-muted-foreground mr-1" />
                <span className="text-muted-foreground">{course.duration}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">Created by <span className="text-foreground font-semibold">{course.instructor}</span></p>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-primary">{course.price}</span>
              <Button size="lg" onClick={handleEnroll} className="px-8">
                Enroll Me Now
              </Button>
            </div>
          </div>

          {/* Right Column - Course Preview */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className={`h-48 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center`}>
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {course.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">What you'll learn</h3>
              <div className="space-y-3">
                {course.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Course Curriculum</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {course.curriculum.map((module, index) => (
              <div key={index} className="border-b border-border last:border-b-0 p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{module.module}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{module.lessons} lessons</span>
                      <span>•</span>
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 text-center">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-foreground font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Master Quantitative Finance?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of students who have transformed their careers</p>
          <Button size="lg" onClick={handleEnroll} className="px-12">
            Enroll Me Now - {course.price}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseLanding;