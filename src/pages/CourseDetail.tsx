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
      <div className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
        showStickyBar ? 'translate-y-0' : '-translate-y-full'
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
                className="bg-primary hover:bg-primary/90 text-background font-semibold px-6"
                onClick={() => navigate("/course/quant-interview-masterclass/learn")}
              >
                Enroll Now - £299
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background via-primary/10 to-primary/20 overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Course Info */}
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Quant Interview Masterclass
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Master quantitative finance interviews with our comprehensive course designed by industry experts
              </p>
              
              {/* Features List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-background" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA and Rating */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  ref={enrollButtonRef}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-background font-semibold px-8"
                  onClick={() => navigate("/course/quant-interview-masterclass/learn")}
                >
                  Enroll Me Now - £299
                </Button>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium text-foreground">4.9/5</span>
                  </div>
                  <span className="text-muted-foreground">from 500+ students</span>
                </div>
              </div>
            </div>

            {/* Right Side - Course Preview */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <div className="bg-gradient-to-br from-primary/80 to-primary/60 rounded-xl w-full h-80 relative overflow-hidden flex items-center justify-center cursor-pointer hover:from-primary/90 hover:to-primary/70 transition-all duration-300">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <Play className="w-10 h-10 text-background ml-1" />
                  </div>
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-foreground font-semibold mb-2 text-xl">Course Preview</h3>
                  <p className="text-muted-foreground text-sm">Get a sneak peek of what you'll learn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Features</h2>
            <p className="text-lg text-muted-foreground">
              Discover what makes our course the ultimate preparation for quantitative finance success
            </p>
          </div>
          
          <div className="space-y-8">
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What You'll Master</h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive curriculum covers everything you need to excel in quantitative finance interviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masterTopics.map((topic, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <topic.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{topic.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{topic.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left text-foreground hover:text-primary [&[data-state=open]]:text-primary [&>svg]:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-background font-semibold px-12 py-6 text-lg"
            onClick={() => navigate("/course/quant-interview-masterclass/learn")}
          >
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;