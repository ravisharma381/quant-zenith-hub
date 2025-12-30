import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { LANDING_PROBLEM_ID, SOLVE_FIRST_PROBLEM_ID } from "@/statics";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fireRandomCelebration } from "@/lib/confetti";
import PromoBanner from "@/components/PromoBanner";

const Index = () => {
  const typewriterPhrases = [
    "Practice real interview questions!",
    "Pass interviews at top firms!",
    "Cover all problem types!",
    "Learn from expert courses!",
    "Master all concepts needed for interviews!"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const success = searchParams.get("success");
    let t: any
    if (success === "true") {
      setShowPremiumPopup(true);
      fireRandomCelebration();

      t = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 0);
    }
    return () => clearTimeout(t);
  }, [searchParams, setSearchParams]);

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
      description: "Practice real quant interview problems from a collection of 1,000+ high quality problems.",
      link: "/problems"
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-primary" />,
      title: "Interactive Games",
      description: "Practice fast-paced games including mental math, sequences, memory, and reaction tests.",
      link: "/games",
      isCommingSoon: true,
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Expert Courses",
      description: "Comprehensive courses covering all topics needed to excel in quant interviews.",
      link: "/courses"
    },
    {
      icon: <PenTool className="w-8 h-8 text-primary" />,
      title: "Blogs",
      description: "Stay updated with the latest interview and industry trends in quant finance.",
      link: "/blogs",
      isCommingSoon: true,
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
    <>
      <Helmet>
        <title>QuantProf - #1 quant finance prep platform | 1000+ problems</title>
        <meta name="description" content="Practice quant interview questions frequently asked at top firms." />
      </Helmet>
      {/* Hero Section */}
      {showBanner && <PromoBanner onClose={() => setShowBanner(false)} />}
      <section className="relative pt-6 pb-8 md:pt-8 md:pb-12 px-4 lg:px-16 bg-gradient-accent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-accent opacity-30"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold mb-4 animate-fade-in leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Break into<br />Quant Finance
                </span>
              </h1>
              <div className="h-8 mb-6">
                <p className="text-xl md:text-2xl text-white font-medium">
                  {displayedText}
                </p>
              </div>
              <div className="flex justify-center lg:justify-start animate-fade-in">
                <Button size="lg" variant="premium" className="text-base lg:text-lg px-6 lg:px-8 shadow-none hover:shadow-none" asChild>
                  <Link to={`/problems/${SOLVE_FIRST_PROBLEM_ID}`}>
                    Solve your first problem
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Side - Problem Card */}
            <div className="animate-fade-in">
              <Card className="bg-card/95 backdrop-blur-sm border-border/50 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      Increasing Dice Rolls III
                    </CardTitle>
                  </div>
                  <div
                    className={` max-w-fit bg-green-500/20 text-green-400 border-green-500/30 inline-flex items-center rounded-full border px-3 md:px-5 py-0.5 text-xs md:text-sm font-semibold`}
                  >
                    1/10
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    A fair six-sided die is rolled twice, and the two outcomes are recorded in order. What is the probability that the number obtained on the second roll is strictly larger than the number obtained on the first roll?
                  </CardDescription>

                  {/* Multiple Choice Options */}
                  <div className="space-y-3">
                    <button className="w-full p-4 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors text-left">
                      <span className="text-foreground font-mono text-lg">
                        <span>5/12</span>
                      </span>
                    </button>
                    <button className="w-full p-4 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors text-left">
                      <span className="text-foreground font-mono text-lg">
                        <span>4/15</span>
                      </span>
                    </button>
                    <button className="w-full p-4 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors text-left">
                      <span className="text-foreground font-mono text-lg">
                        <span>3/11</span>
                      </span>
                    </button>
                    <button className="w-full p-4 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors text-left">
                      <span className="text-foreground font-mono text-lg">
                        <span>7/12</span>
                      </span>
                    </button>
                  </div>

                  {/* Bottom Section with Tags and Submit */}
                  <div className="flex flex-wrap items-center justify-end gap-4 pt-4">
                    {/* <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs text-red-500 border-red-500">
                        Expected Value/LOTUS
                      </Badge>
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                        Uniform
                      </Badge>
                      <Badge variant="outline" className="text-xs text-purple-500 border-purple-500">
                        Task Distribution
                      </Badge>
                    </div> */}
                    <Button
                      onClick={() => navigate(`/problems/${LANDING_PROBLEM_ID}`)}
                      size="lg" className="bg-[hsl(0,0%,20%)] text-white hover:bg-[hsl(0,0%,25%)] shadow-none hover:shadow-none">
                      Try it Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section >


      {/* Features Section */}
      < section className="pt-12 pb-7 md:pt-20 md:pb-9 px-4" >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              All the tools and resources you need to master concepts and excel in interviews.
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
                  {feature.isCommingSoon ? (
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                      <Link to={feature.link}>
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* Company Logo Ticker */}
      < CompanyLogoTicker />

      {/* Benefits Section */}
      < section className="py-12 md:py-20 bg-gradient-accent px-4" >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose QuantProf?
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-purple flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Company tagged questions
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Practice with company tagged questions from top quant trading firms, continuously updated with the latest problems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-purple flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Refunds
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      We offer a no-questions-asked full refund: 30 days on the yearly plan and 60 days on the lifetime plan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-purple flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Expert courses
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      In-depth courses covering everything you need to ace quant interviews, including brainteasers, combinatorics, probability, statistics, martingales, market making, and much more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-purple flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      Curated playlists
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Multiple problem playlists, some designed for rapid coverage of all concepts, others focused on targeted practice to strengthen specific areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm">
                <div className="text-center">
                  <Trophy className="w-12 h-12 md:w-16 md:h-16 text-purple mx-auto mb-4 md:mb-6" />
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Join the Elite
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6">
                    Candidates worldwide have successfully secured roles at top firms using QuantProf.
                  </p>
                  <Button size="lg" className="w-full sm:w-auto bg-[hsl(270,95%,60%)] hover:!bg-[hsl(270,95%,60%)]/90 hover:!shadow-[0_0_20px_hsl(270,95%,60%,0.3)] focus-visible:!ring-[hsl(270,95%,60%)] text-white" asChild>
                    <Link to={`/problems/${SOLVE_FIRST_PROBLEM_ID}`}>
                      Solve your first problem
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section >
      <Dialog open={showPremiumPopup} onOpenChange={setShowPremiumPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              You are now a Premium User 🎉
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your payment was successful. You now have full access to all premium
              problems, playlists, and courses.
            </p>
            <div>
              <Button variant="default" className="border-none focus-visible:border-none" onClick={() => setShowPremiumPopup(false)}>Start Learning</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default Index;
