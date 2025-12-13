import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Star, BookOpen, TrendingUp, Target, Users, Lightbulb, Award, Play, Brain, Calculator, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeatureRow from "@/components/FeatureRow";

const CourseDetail = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const enrollButtonRef = useRef<HTMLButtonElement>(null);

  const features = [
    "Comprehensive interview preparation framework",
    "Real quantitative finance interview questions", 
    "Advanced mathematical concepts and modeling",
    "Python and R programming for quants"
  ];

  const masterTopics = [
    {
      icon: BookOpen,
      title: "Quantitative Methods",
      description: "Master the mathematical foundations essential for quantitative finance interviews."
    },
    {
      icon: TrendingUp,
      title: "Financial Modeling", 
      description: "Learn advanced modeling techniques used in top-tier investment firms."
    },
    {
      icon: Target,
      title: "Interview Strategy",
      description: "Develop winning strategies to tackle any quantitative finance interview."
    },
    {
      icon: Users,
      title: "Mock Interviews",
      description: "Practice with realistic interview scenarios and get expert feedback."
    },
    {
      icon: Lightbulb,
      title: "Problem Solving",
      description: "Master complex problem-solving techniques for quantitative challenges."
    },
    {
      icon: Award,
      title: "Career Guidance",
      description: "Get insider tips on landing positions at top quantitative finance firms."
    }
  ];

  const courseFeatures = [
    {
      icon: Brain,
      title: "Learn The Right Approach",
      description: "Each question is paired with a comprehensive solution that systematically walks you through how to solve the question. Each question also has a hint to guide you towards the right approach.",
      imageType: "mockup"
    },
    {
      icon: Calculator,
      title: "Mathematical Excellence",
      description: "Master advanced mathematical concepts including stochastic calculus, probability theory, and statistical inference essential for quantitative finance roles.",
      imageType: "formula"
    },
    {
      icon: BarChart3,
      title: "Real-World Applications",
      description: "Apply theoretical knowledge to practical scenarios used in top investment banks and hedge funds. Learn through case studies from Goldman Sachs, JPMorgan, and Two Sigma.",
      imageType: "chart"
    }
  ];

  const faqs = [
    {
      question: "What level of mathematics background do I need?",
      answer: "A solid foundation in calculus, linear algebra, and probability theory is recommended. We provide refresher materials for key concepts."
    },
    {
      question: "How long does the course take to complete?",
      answer: "The course contains 70+ hours of content. Most students complete it in 8-12 weeks studying 6-8 hours per week."
    },
    {
      question: "Do you provide job placement assistance?",
      answer: "Yes, we offer career guidance, resume reviews, and connections to our network of industry professionals."
    },
    {
      question: "What programming languages are covered?",
      answer: "The course covers Python and R extensively, with practical applications in quantitative finance and data analysis."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not completely satisfied with the course."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (enrollButtonRef.current) {
        const rect = enrollButtonRef.current.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        setShowStickyBar(!isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Enrollment Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ${
        showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Quant Interview Masterclass</h2>
              <p className="text-sm text-muted-foreground">Master quantitative finance interviews</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-foreground">4.9/5</span>
              </div>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                onClick={() => navigate("/premium")}
              >
                Get Premium
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Course Info */}
              <div className="animate-fade-in">
                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                  #1 Rated Quant Prep Course
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Quant Interview
                  <span className="block bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                    Masterclass
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  Master quantitative finance interviews with our comprehensive course designed by industry experts from top trading firms.
                </p>
                
                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA and Rating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Button 
                    ref={enrollButtonRef}
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    onClick={() => navigate("/premium")}
                  >
                    Get Premium Access
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">4.9/5</span>
                      <span className="text-muted-foreground ml-1">• 500+ students</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Course Preview Card */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 group">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-primary/90 via-primary/70 to-emerald-600/80 h-56 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                          Free Preview
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">Watch Course Preview</h3>
                      <p className="text-muted-foreground text-sm mb-4">Get a sneak peek of what you'll learn in this masterclass</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration: 5 min</span>
                        <span className="text-primary font-medium">100+ chapters</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "1200+", label: "Practice Problems" },
              { value: "100+", label: "Video Chapters" },
              { value: "500+", label: "Students Enrolled" },
              { value: "95%", label: "Success Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why Choose Us</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Everything You Need to
              <span className="block text-primary">Ace Your Interview</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover what makes our course the ultimate preparation for quantitative finance success
            </p>
          </div>
          
          <div className="space-y-12">
            {courseFeatures.map((feature, index) => (
              <FeatureRow
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
                theme="primary"
              />
            ))}
          </div>
        </div>
      </div>

      {/* What You'll Master Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Curriculum</Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">What You'll Master</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive curriculum covers everything you need to excel in quantitative finance interviews
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masterTopics.map((topic, index) => (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80 transition-all duration-300 group h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors">
                      <topic.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{topic.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">FAQ</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border border-border/50 rounded-xl px-6 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors data-[state=open]:bg-card/60"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary py-6 text-lg [&[data-state=open]]:text-primary [&>svg]:text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-primary/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Land Your
              <span className="block text-primary">Dream Quant Job?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join 500+ successful students who landed positions at top trading firms and hedge funds.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-12 py-7 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              onClick={() => navigate("/premium")}
            >
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;