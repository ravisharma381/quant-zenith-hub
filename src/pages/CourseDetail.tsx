import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Check, Star, BookOpen, TrendingUp, Target, Users, Lightbulb, Award, Brain, Calculator, BarChart3, FileText, Building2, GraduationCap, Dices, Coins, LineChart, ScatterChart, Grid3x3, Crown, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Autoplay from "embla-carousel-autoplay";
const CourseDetail = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const enrollButtonRef = useRef<HTMLButtonElement>(null);


  const masterTopics = [
    {
      icon: Lightbulb,
      title: "Brainteasers",
      description: "Sharpen your logical thinking with classic and modern quantitative puzzles."
    },
    {
      icon: Calculator,
      title: "Combinatorics",
      description: "Master counting techniques, permutations, and combinations essential for probability."
    },
    {
      icon: Coins,
      title: "Probability",
      description: "Master probability theory from basics to advanced concepts used in interviews."
    },
    {
      icon: Dices,
      title: "Betting Games",
      description: "Learn optimal strategies for dice games, card games, and expected value problems."
    },
    {
      icon: TrendingUp,
      title: "Market Making",
      description: "Understand bid-ask spreads, inventory management, and pricing strategies."
    },
    {
      icon: BarChart3,
      title: "Statistics",
      description: "Build strong foundations in statistical inference and hypothesis testing."
    },
    {
      icon: ScatterChart,
      title: "Regression",
      description: "Master linear regression, time series analysis, and predictive modeling."
    },
    {
      icon: LineChart,
      title: "Martingales",
      description: "Explore martingale theory and its applications in finance and betting."
    },
    {
      icon: Grid3x3,
      title: "Random Walks",
      description: "Understand Brownian motion, stochastic processes, and their financial applications."
    }
  ];

  const courseFeatures = [
    {
      icon: Crown,
      title: "Premium Questions with Detailed Solutions",
      description: "Gain exclusive access to our quickly-growing collection of over 1500 questions spanning probability, statistics, brainteasers, and much more. Each question comes with hints and detailed solutions written by real quants.",
    },
    {
      icon: BookOpen,
      title: "Theory",
      description: "Master the fundamentals with 100+ chapters covering all the topics needed to excel at quant interviews. From probability to market making, we've got you covered.",
    },
    {
      icon: Tag,
      title: "Company Tagged Questions",
      description: "Practice with questions tagged by company. Know exactly what to expect from interviews at top quant firms like Jane Street, Citadel, Two Sigma, and more.",
    },
    {
      icon: Award,
      title: "30 Days Full Refund",
      description: "Not satisfied? Get a full refund within 30 days, no questions asked. We're confident you'll love our course.",
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
      const scrollY = window.scrollY;
      // Only show sticky bar after scrolling down at least 100px
      if (scrollY < 100) {
        setShowStickyBar(false);
        return;
      }
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
              <div className="animate-fade-in text-center lg:text-left">
                <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                  #1 Rated Quant Prep Course
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  Quant Interview
                  <span className="block bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                    Masterclass
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Master quantitative finance interviews with our comprehensive course designed by industry experts from top trading firms.
                </p>
                

                {/* CTA and Rating */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start sm:justify-center lg:justify-start gap-6">
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

              {/* Right Side - Auto-playing Stats Carousel */}
              <div className="flex justify-center lg:justify-end w-full lg:w-auto px-4 lg:px-0 lg:mr-8">
                <div className="w-full lg:max-w-md">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {[
                        {
                          icon: FileText,
                          stat: "1000+",
                          title: "Practice Problems",
                          description: "Comprehensive question bank covering all interview topics",
                          gradient: "from-primary/90 via-primary/70 to-emerald-600/80"
                        },
                        {
                          icon: Building2,
                          stat: "50+",
                          title: "Company Specific Problems",
                          description: "Real questions from top trading firms and hedge funds",
                          gradient: "from-purple-600/90 via-purple-500/70 to-indigo-600/80"
                        },
                        {
                          icon: GraduationCap,
                          stat: "100+",
                          title: "Chapters",
                          description: "Complete theory coverage from basics to advanced",
                          gradient: "from-emerald-600/90 via-teal-500/70 to-cyan-600/80"
                        },
                        {
                          icon: Target,
                          stat: "95%",
                          title: "Success Rate",
                          description: "Students landing offers at top quant firms",
                          gradient: "from-amber-600/90 via-orange-500/70 to-red-500/80"
                        }
                      ].map((item, index) => (
                        <CarouselItem key={index}>
                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
                            <div className={`bg-gradient-to-br ${item.gradient} h-56 lg:h-64 flex items-center justify-center relative`}>
                              <div className="text-center text-white">
                                <item.icon className="w-14 h-14 mx-auto mb-4 opacity-90" />
                                <div className="text-5xl lg:text-6xl font-bold">{item.stat}</div>
                              </div>
                            </div>
                            <CardContent className="p-6 lg:p-8">
                              <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-2">{item.title}</h3>
                              <p className="text-muted-foreground text-sm lg:text-base">{item.description}</p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {courseFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <feature.icon className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
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

    </div>
  );
};

export default CourseDetail;