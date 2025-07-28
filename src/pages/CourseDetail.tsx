import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Users, Star, Award, Target, BookOpen, Video, Download, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {
  const navigate = useNavigate();

  const features = [
    "70+ Hours of Expert-Led Content",
    "Real Interview Questions from Top Firms",
    "Interactive Coding Challenges",
    "Probability & Statistics Deep Dive",
    "Options Pricing Models",
    "Risk Management Frameworks",
    "Mock Interview Sessions",
    "Lifetime Access & Updates",
    "Community Access",
    "Certificate of Completion"
  ];

  const curriculum = [
    {
      title: "Probability & Statistics Foundations",
      duration: "12 hours",
      lessons: 15
    },
    {
      title: "Options Pricing & Derivatives",
      duration: "18 hours", 
      lessons: 22
    },
    {
      title: "Risk Management & VaR",
      duration: "14 hours",
      lessons: 17
    },
    {
      title: "Coding Challenges & Brain Teasers",
      duration: "16 hours",
      lessons: 28
    },
    {
      title: "Mock Interviews & Case Studies",
      duration: "10 hours",
      lessons: 12
    }
  ];

  const stats = [
    { icon: Users, label: "Students", value: "15,000+" },
    { icon: Star, label: "Rating", value: "4.9/5" },
    { icon: Award, label: "Success Rate", value: "87%" },
    { icon: Clock, label: "Duration", value: "70+ Hours" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
              Most Popular Course
            </Badge>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Quant Interview Masterclass
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Master quantitative finance interviews at top-tier firms like Goldman Sachs, 
              JP Morgan, Citadel, and Jane Street. From probability puzzles to derivatives pricing.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary-glow">
                Enroll Now - $299
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Preview Course
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8">What You'll Master</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course Curriculum */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8">Course Curriculum</h2>
                <div className="space-y-4">
                  {curriculum.map((module, index) => (
                    <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {index + 1}. {module.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {module.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {module.lessons} lessons
                              </div>
                            </div>
                          </div>
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Course Features */}
              <section>
                <h2 className="text-3xl font-bold text-foreground mb-8">Course Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Video className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Video Lectures</h3>
                      </div>
                      <p className="text-muted-foreground">
                        High-quality video content with clear explanations of complex concepts
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Download className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Downloadable Resources</h3>
                      </div>
                      <p className="text-muted-foreground">
                        PDF guides, practice problems, and reference materials
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MessageCircle className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Community Support</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Access to exclusive community of quant professionals
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-semibold text-foreground">Certification</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Industry-recognized certificate upon completion
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-border sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">$299</div>
                    <div className="text-muted-foreground line-through">$499</div>
                    <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
                      40% OFF - Limited Time
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground font-medium">70+ Hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Intermediate
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="text-foreground font-medium">English</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Access</span>
                      <span className="text-foreground font-medium">Lifetime</span>
                    </div>
                  </div>

                  <Button className="w-full mb-4 bg-primary hover:bg-primary-glow">
                    Enroll Now
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;