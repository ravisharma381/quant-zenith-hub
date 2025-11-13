import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Quant Interview Masterclass",
      instructor: "Dr. Michael Rodriguez",
      description: "Master the mathematical foundations of quantitative finance including probability theory, stochastic calculus, linear algebra, and advanced statistical methods used in trading and risk management.",
      level: "Beginner",
      duration: "47.1 total hours",
      students: 451000,
      rating: 4.7,
      reviews: "451K ratings",
      price: "$149",
      image: "/placeholder.svg",
      gradient: "from-orange-400 to-yellow-500"
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

        {/* Courses List */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 group flex flex-col md:flex-row"
            >
              {/* Gradient Header with Instructor Photo */}
              <div className={`w-full md:w-64 h-52 md:h-auto bg-gradient-to-br ${course.gradient} relative flex items-center justify-center flex-shrink-0`}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                  
                  {/* Rating and Stats */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                    </div>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.reviews}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{course.duration}</span>
                  </div>
                </div>
                
                {/* Bottom Section */}
                <div className="flex items-center mt-4 pt-4 border-t border-border">
                  {/* View Course Button */}
                  <Button 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    View Course
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;