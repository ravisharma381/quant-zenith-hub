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
  Trophy, 
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Brain,
  Sparkles
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
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Practice Problems",
      description: "Solve real quantitative finance problems with step-by-step solutions",
      link: "/problems",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Interactive Games",
      description: "Learn through engaging games and competitive challenges",
      link: "/games",
      gradient: "from-purple/20 to-purple/5"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Expert Courses",
      description: "Comprehensive courses taught by industry professionals",
      link: "/courses",
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Industry Insights",
      description: "Stay updated with latest trends and analysis in quant finance",
      link: "/blogs",
      gradient: "from-amber-500/20 to-amber-500/5"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: <Sparkles className="w-5 h-5" /> },
    { label: "Problems Solved", value: "1M+", icon: <Target className="w-5 h-5" /> },
    { label: "Success Rate", value: "89%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Expert Instructors", value: "25+", icon: <Brain className="w-5 h-5" /> }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 md:pt-16 md:pb-20 px-4 lg:px-16 overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-background to-primary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple/5 to-transparent rounded-full blur-2xl" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                <Sparkles className="w-4 h-4" />
                <span>Your path to quant finance starts here</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold animate-fade-in leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Get into<br />Quant Finance
                </span>
              </h1>
              
              <div className="h-10 flex items-center justify-center lg:justify-start">
                <p className="text-xl md:text-2xl text-foreground/90 font-medium">
                  {displayedText}
                  <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse" />
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                <Button size="lg" variant="premium" className="text-base lg:text-lg px-8 group" asChild>
                  <Link to="/problems">
                    Solve your first problem
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base lg:text-lg px-8 border-border/50 hover:bg-accent/50" asChild>
                  <Link to="/courses">
                    Browse Courses
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Side - Problem Card */}
            <div className="animate-fade-in">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple/20 to-primary/20 rounded-2xl blur-xl opacity-50" />
                
                <Card className="relative bg-card/95 backdrop-blur-sm border-border/50 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent" />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-2xl font-bold text-foreground">
                        Nearest Diagonal I
                      </CardTitle>
                    </div>
                    <Badge className="w-fit bg-[hsl(142,76%,36%)] text-white hover:bg-[hsl(142,76%,36%)] border-none">
                      Easy
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      A point is selected uniformly at random from the unit square. Find the expected distance of the point from the <span className="italic">y = x</span> line.
                    </CardDescription>
                    
                    {/* Multiple Choice Options */}
                    <div className="space-y-3">
                      {[
                        { num: "1", denom: "3" },
                        { num: "1", denom: "3√2" },
                        { num: "1", denom: "6" },
                        { num: "1", denom: "6√2" }
                      ].map((option, i) => (
                        <button 
                          key={i}
                          className="w-full p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 text-left group"
                        >
                          <span className="text-foreground text-lg inline-flex items-center">
                            <span className="inline-flex flex-col items-center leading-none group-hover:text-primary transition-colors">
                              <span className="border-b border-current px-1">{option.num}</span>
                              <span className="px-1">{option.denom}</span>
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Bottom Section with Tags and Submit */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs text-red-400 border-red-400/50 bg-red-400/5">
                          Expected Value/LOTUS
                        </Badge>
                        <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/50 bg-emerald-400/5">
                          Uniform
                        </Badge>
                        <Badge variant="outline" className="text-xs text-purple border-purple/50 bg-purple/5">
                          Task Distribution
                        </Badge>
                      </div>
                      <Button size="lg" className="bg-secondary hover:bg-secondary/80 text-foreground">
                        Try it Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4 border-y border-border/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Comprehensive tools and resources designed by quantitative finance experts 
              to help you master the field and excel in interviews.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="relative pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <Button variant="ghost" size="sm" className="group/btn text-primary hover:text-primary hover:bg-primary/10" asChild>
                    <Link to={feature.link}>
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4 text-purple border-purple/30">
                  <Trophy className="w-3 h-3 mr-1" />
                  Why Choose Us
                </Badge>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-purple to-purple-glow bg-clip-text text-transparent">
                    QuantProf?
                  </span>
                </h2>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: <CheckCircle className="w-6 h-6" />, title: "Real Interview Questions", desc: "Practice with actual questions from top financial institutions like Goldman Sachs, JPMorgan, and Two Sigma." },
                  { icon: <Zap className="w-6 h-6" />, title: "Interactive Learning", desc: "Engage with hands-on simulations, games, and interactive problem-solving tools that make learning effective and enjoyable." },
                  { icon: <Target className="w-6 h-6" />, title: "Personalized Learning Path", desc: "AI-powered recommendations adapt to your learning style and help you focus on areas that need improvement." },
                  { icon: <Brain className="w-6 h-6" />, title: "Expert Guidance", desc: "Learn from industry professionals with years of experience at leading quantitative finance firms." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="p-2 rounded-lg bg-purple/10 text-purple group-hover:bg-purple group-hover:text-purple-foreground transition-colors flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-purple transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
              
              <Card className="relative p-8 md:p-10 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/20 to-transparent" />
                
                <div className="text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple to-purple-glow text-white mb-6 shadow-lg shadow-purple/30">
                    <Trophy className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Join the Elite
                  </h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Over <span className="text-primary font-semibold">10,000</span> professionals have successfully landed positions at top firms using QuantProf.
                  </p>
                  <Button variant="purple" size="lg" className="w-full sm:w-auto px-8 group" asChild>
                    <Link to="/problems">
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
