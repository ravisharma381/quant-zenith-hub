import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import CompanyLogoTicker from "@/components/CompanyLogoTicker";
import { 
  TrendingUp, 
  BookOpen, 
  Gamepad2, 
  PenTool, 
  Users, 
  Trophy, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Brain
} from "lucide-react";

const Index = () => {
  const typewriterPhrases = [
    "Practice real interview questions!",
    "Pass interviews at top firms!",
    "Play interactive games!",
    "Learn from expert courses!",
    "Master probability and statistics!"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 20 : 50;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Practice Problems",
      description: "Solve real quantitative finance problems with step-by-step solutions",
      link: "/problems"
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-primary" />,
      title: "Interactive Games",
      description: "Learn through engaging games and competitive challenges",
      link: "/games"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Expert Courses",
      description: "Comprehensive courses taught by industry professionals",
      link: "/courses"
    },
    {
      icon: <PenTool className="w-8 h-8 text-primary" />,
      title: "Industry Insights",
      description: "Stay updated with latest trends and analysis in quant finance",
      link: "/blogs"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Problems Solved", value: "1M+" },
    { label: "Success Rate", value: "89%" },
    { label: "Expert Instructors", value: "25+" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Quantitative Analyst at Goldman Sachs",
      content: "QuantProf helped me ace my quant interviews. The practice problems are incredibly realistic."
    },
    {
      name: "Michael Rodriguez",
      role: "Portfolio Manager at Two Sigma",
      content: "The interactive approach made learning complex concepts enjoyable and memorable."
    },
    {
      name: "Emma Thompson",
      role: "Risk Manager at JPMorgan",
      content: "Best platform for quantitative finance preparation. Highly recommend to anyone in the field."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-30"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary">
              #1 Quant Interview Prep Platform
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 animate-fade-in leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Get into<br />Quant Finance
              </span>
            </h1>
            <div className="h-8 mb-8">
              <p className="text-xl md:text-2xl text-white font-medium">
                {displayedText}
              </p>
            </div>
            <div className="flex justify-center animate-fade-in px-4">
              <Button size="lg" variant="premium" className="text-lg px-8 w-full sm:w-auto" asChild>
                <Link to="/problems">
                  Solve your first problem
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Comprehensive tools and resources designed by quantitative finance experts 
              to help you master the field and excel in interviews.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300 hover:scale-105 text-center">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 text-sm md:text-base">
                    {feature.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                    <Link to={feature.link}>
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logo Ticker */}
      <CompanyLogoTicker />

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-gradient-accent px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose QuantProf?
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Real Interview Questions
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Practice with actual questions from top financial institutions like Goldman Sachs, 
                      JPMorgan, and Two Sigma.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Interactive Learning
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Engage with hands-on simulations, games, and interactive problem-solving tools 
                      that make learning effective and enjoyable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Personalized Learning Path
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      AI-powered recommendations adapt to your learning style and help you focus 
                      on areas that need improvement.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <Brain className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Expert Guidance
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Learn from industry professionals with years of experience at leading 
                      quantitative finance firms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm">
                <div className="text-center">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Join the Elite
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Over 10,000 professionals have successfully landed positions at top firms 
                    using QuantProf.
                  </p>
                  <Button variant="premium" size="lg" className="w-full sm:w-auto" asChild>
                    <Link to="/problems">
                      Solve your first problem
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>


    </Layout>
  );
};

export default Index;
