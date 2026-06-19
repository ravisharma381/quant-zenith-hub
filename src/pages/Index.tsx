import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import CompanyLogoTicker from "@/components/CompanyLogoTicker";
import MathBackground from "@/components/MathBackground";
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
      link: "/games",
      comingSoon: true
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Expert Courses",
      description: "Comprehensive courses taught by industry professionals",
      link: "/courses"
    },
    {
      icon: <PenTool className="w-8 h-8 text-primary" />,
      title: "Blogs",
      description: "Stay updated with latest trends and analysis in quant finance",
      link: "/blogs",
      comingSoon: true
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
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes heroFloatBack {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .hero-float-front { animation: heroFloat 6s ease-in-out infinite; }
        .hero-float-back { animation: heroFloatBack 7s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-8 pb-12 md:pt-12 md:pb-20 px-4 lg:px-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270 70% 8% / 0.6), hsl(220 13% 8%) 40%, hsl(122 60% 10% / 0.3))' }}>
        <MathBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium animate-fade-in">
                <Zap className="w-4 h-4" />
                Built by quants. Optimized for 2026.
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 animate-fade-in leading-[1.05] tracking-tight">
                <span className="text-foreground">Train for quant interviews.</span>
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">Get hired.</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl lg:max-w-none leading-relaxed">
                Master every hurdle: from Mental math and Probability to Machine Learning and Statistics. Practice full mock interviews with readiness scores that tell you when you're ready for the offer.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 md:gap-8 mb-8 max-w-xl mx-auto lg:mx-0">
                {[
                  { value: "800+", label: "Questions" },
                  { value: "50+", label: "Free" },
                  { value: "30+", label: "Top Companies" },
                  { value: "1000+", label: "Hours Saved" },
                ].map((s) => (
                  <div key={s.label} className="text-left">
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center lg:items-start gap-2 animate-fade-in">
                <Button size="lg" variant="premium" className="text-base lg:text-lg px-7 lg:px-9 rounded-full shadow-none hover:shadow-none" asChild>
                  <Link to="/problems">
                    Start Practicing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">Free to start. Upgrade anytime.</p>
              </div>
            </div>

            {/* Right Side - Floating mock app windows */}
            <div className="relative h-[420px] md:h-[520px] hidden lg:block">
              {/* Back window */}
              <div className="hero-float-back absolute left-0 top-10 w-[58%] origin-center">
                <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-background/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-xs text-muted-foreground font-medium">QuantProf</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/20 via-purple/20 to-primary/10 border border-border/60 flex items-center justify-center text-5xl">
                      △
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Coins — 0 / 1</div>
                      <div className="px-3 py-2 rounded-md bg-background/60 border border-border/60 text-xs text-foreground">4. Coin Sequence I</div>
                      <div className="text-xs text-muted-foreground pt-1">Dice — 0 / 1</div>
                      <div className="px-3 py-2 rounded-md bg-background/60 border border-border/60 text-xs text-foreground flex items-center justify-between">
                        <span>5. Conditional Dice I</span>
                        <Badge variant="outline" className="text-[10px] border-purple/50 text-purple">Medium</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front window */}
              <div className="hero-float-front absolute right-0 top-0 w-[78%] origin-center">
                <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/40">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-3 text-xs text-muted-foreground font-medium">QuantProf</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="text-primary">Questions</span>
                      <span>Mental Math</span>
                      <span>Challenge</span>
                      <span>Pricing</span>
                    </div>
                  </div>
                  <div className="p-4">
                    {/* Featured cards row */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { title: "50 Dice problems", grad: "from-blue-500/30 to-cyan-500/20" },
                        { title: "Quant Trading 50", grad: "from-purple/40 to-pink-500/20" },
                        { title: "Quant Essentials 100", grad: "from-orange-500/30 to-amber-500/20" },
                      ].map((c) => (
                        <div key={c.title} className={`relative rounded-lg p-3 h-24 bg-gradient-to-br ${c.grad} border border-border/60 overflow-hidden`}>
                          <div className="text-[10px] font-bold text-foreground leading-tight">{c.title}</div>
                        </div>
                      ))}
                    </div>

                    {/* Filter chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {["Quant Trader", "Quant Researcher", "Quant Analyst"].map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">{t}</span>
                      ))}
                    </div>

                    {/* Search bar mock */}
                    <div className="px-3 py-2 rounded-md bg-background/60 border border-border/60 text-[11px] text-muted-foreground mb-3">
                      Search questions...
                    </div>

                    {/* Rows */}
                    <div className="space-y-1.5">
                      {[
                        { n: "1.", title: "Asymptotic coins", tag: "Premium", cat: "Statistics", diff: "Easy", diffColor: "text-green-500" },
                        { n: "10.", title: "Auction game", tag: "Premium", cat: "Probability", diff: "Hard", diffColor: "text-red-500" },
                      ].map((r) => (
                        <div key={r.n} className="flex items-center gap-2 px-2 py-1.5 rounded border border-border/40 text-[11px]">
                          <span className="text-muted-foreground w-6">{r.n}</span>
                          <span className="text-foreground flex-1 truncate">{r.title}</span>
                          <Badge variant="outline" className="text-[9px] border-primary/40 text-primary">{r.tag}</Badge>
                          <span className="text-muted-foreground w-20 truncate">{r.cat}</span>
                          <span className={`${r.diffColor} font-medium w-12 text-right`}>{r.diff}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Features Section */}
      <section className="pt-12 pb-7 md:pt-20 md:pb-9 px-4">
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
                  {feature.comingSoon ? (
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
                  <Button variant="purple" size="lg" className="w-full sm:w-auto" asChild>
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
