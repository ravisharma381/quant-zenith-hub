import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Calendar, CreditCard, Clock } from "lucide-react";

const MyCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Quant Interview Masterclass",
      instructor: "Dr. Michael Rodriguez",
      description: "Master the mathematical foundations of quantitative finance",
      level: "Beginner",
      duration: "47.1 total hours",
      students: 451000,
      rating: 4.7,
      reviews: "451K ratings",
      price: "$149",
      image: "/placeholder.svg",
      gradient: "from-orange-400 to-yellow-500",
      purchaseDate: "March 15, 2024",
      paymentMethod: "Credit Card ending in ****1234",
      nextBilling: "March 15, 2025",
      progress: "45%"
    },
    {
      id: 2,
      title: "Machine Learning for Finance",
      instructor: "Sarah Chen",
      description: "Apply ML techniques to financial modeling and prediction",
      level: "Advanced",
      duration: "28.4 total hours",
      students: 35000,
      rating: 4.6,
      reviews: "3.5K ratings",
      price: "$299",
      image: "/placeholder.svg",
      gradient: "from-purple-500 to-blue-600",
      purchaseDate: "January 8, 2024",
      paymentMethod: "Credit Card ending in ****5678",
      nextBilling: "January 8, 2025",
      progress: "72%"
    },
    {
      id: 3,
      title: "Risk Management & Portfolio Theory",
      instructor: "Prof. David Kim",
      description: "Advanced portfolio optimization and risk modeling techniques",
      level: "Intermediate",
      duration: "47.1 total hours",
      students: 219000,
      rating: 4.6,
      reviews: "219K ratings",
      price: "$199",
      image: "/placeholder.svg",
      gradient: "from-pink-500 to-purple-600",
      purchaseDate: "February 22, 2024",
      paymentMethod: "PayPal",
      nextBilling: "February 22, 2025",
      progress: "28%"
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 hover:scale-105 group"
            >
              {/* Gradient Header with Instructor Photo */}
              <div className={`h-52 bg-gradient-to-br ${course.gradient} relative flex items-center justify-center`}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
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
                  <span className="text-muted-foreground">{course.reviews}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
                
                {/* Level Badge */}
                <div className="flex items-center justify-between">
                  <Badge className={getLevelColor(course.level)} variant="outline">
                    {course.level}
                  </Badge>
                  <span className="text-lg font-bold text-primary">{course.price}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button 
                    className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Continue Learning
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedCourse(course)}
                      >
                        View Purchase Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Purchase Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Purchase Date</p>
                            <p className="text-sm text-muted-foreground">{course.purchaseDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Payment Method</p>
                            <p className="text-sm text-muted-foreground">{course.paymentMethod}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Progress</p>
                            <p className="text-sm text-muted-foreground">{course.progress} completed</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Next Billing</p>
                            <p className="text-sm text-muted-foreground">{course.nextBilling}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Amount Paid</span>
                            <span className="text-lg font-bold text-primary">{course.price}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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