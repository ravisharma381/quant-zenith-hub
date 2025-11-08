import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
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
    },
    {
      id: 2,
      title: "Machine Learning for Finance",
      instructor: "Sarah Chen",
      description: "Apply cutting-edge machine learning techniques to financial modeling, algorithmic trading, and market prediction. Learn neural networks, ensemble methods, and deep learning frameworks for quantitative analysis.",
      level: "Advanced",
      duration: "28.4 total hours",
      students: 35000,
      rating: 4.6,
      reviews: "3.5K ratings",
      price: "$299",
      image: "/placeholder.svg",
      gradient: "from-purple-500 to-blue-600"
    },
    {
      id: 3,
      title: "Risk Management & Portfolio Theory",
      instructor: "Prof. David Kim",
      description: "Advanced portfolio optimization techniques and comprehensive risk modeling strategies. Learn modern portfolio theory, value-at-risk calculations, stress testing, and sophisticated hedging methodologies for institutional portfolios.",
      level: "Intermediate",
      duration: "47.1 total hours",
      students: 219000,
      rating: 4.6,
      reviews: "219K ratings",
      price: "$199",
      image: "/placeholder.svg",
      gradient: "from-pink-500 to-purple-600"
    },
    {
      id: 4,
      title: "Derivatives Pricing Models",
      instructor: "Dr. Elena Petrov",
      description: "Deep dive into advanced derivatives pricing including Black-Scholes framework, Monte Carlo simulations, binomial trees, and exotic options valuation. Master volatility modeling and Greeks for professional trading.",
      level: "Advanced",
      duration: "32.8 total hours",
      students: 87000,
      rating: 4.8,
      reviews: "87K ratings",
      price: "$349",
      image: "/placeholder.svg",
      gradient: "from-green-400 to-blue-500"
    },
    {
      id: 5,
      title: "Machine Learning for Finance",
      instructor: "Alex Thompson",
      description: "Apply machine learning algorithms to solve complex financial problems. Learn predictive modeling, sentiment analysis, algorithmic trading strategies, and risk assessment using Python and advanced ML frameworks.",
      level: "Intermediate",
      duration: "41.2 total hours",
      students: 156000,
      rating: 4.7,
      reviews: "156K ratings",
      price: "$249",
      image: "/placeholder.svg",
      gradient: "from-cyan-400 to-purple-500"
    },
    {
      id: 6,
      title: "Fixed Income Securities",
      instructor: "Dr. James Wilson",
      description: "Comprehensive analysis of bonds, yield curves, duration, convexity, and credit risk assessment. Master fixed income valuation techniques and understand interest rate derivatives for portfolio management.",
      level: "Intermediate",
      duration: "36.5 total hours",
      students: 94000,
      rating: 4.5,
      reviews: "94K ratings",
      price: "$179",
      image: "/placeholder.svg",
      gradient: "from-indigo-400 to-pink-500"
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Expert-Led Courses</h1>
          <p className="text-muted-foreground text-lg">
            Learn from industry professionals and academics
          </p>
        </div>

        {/* Courses List */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer group flex flex-col md:flex-row"
              onClick={() => {
                if (course.id === 1) navigate('/course/quant-interview-masterclass');
                if (course.id === 2) navigate('/course/machine-learning-for-finance');
              }}
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
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
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
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Badge className={getLevelColor(course.level)} variant="outline">
                      {course.level}
                    </Badge>
                    <span className="text-lg font-bold text-primary">{course.price}</span>
                  </div>
                  
                  {/* View Course Button */}
                  <Button className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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

export default Courses;