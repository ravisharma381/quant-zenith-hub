import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Check, Star, BookOpen, TrendingUp, Target, Users, Lightbulb, Award, Brain, Calculator, BarChart3, FileText, Building2, GraduationCap, Dices, Coins, LineChart, ScatterChart, Grid3x3, Crown, Tag, RefreshCcw, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";
import Autoplay from "embla-carousel-autoplay";

const CourseDetail = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const enrollButtonRef = useRef<HTMLButtonElement>(null);
  const { userProfile } = useAuth();
  const slug = window.location.pathname.split("/course/")[1];
  const courseId = 'pxeKbx6V6C2IeBy1UnWm';

  const isBought = userProfile?.isPremium


  const masterTopics = [
    {
      icon: Lightbulb,
      title: "Brainteasers",
      description: "Learn how to solve difficult quant puzzles by identifying commonly occurring patterns such as the pigeonhole principle and monovariants."
    },
    {
      icon: Calculator,
      title: "Combinatorics",
      description: "Master essential counting techniques such as permutations, combinations, reflection principle etc."
    },
    {
      icon: Coins,
      title: "Probability",
      description: "Master probability and expectation from basics to advanced."
    },
    {
      icon: Dices,
      title: "Betting Games",
      description: "Learn how to identify optimal strategies for betting games, such as parameter optimization and optimal stopping conditions."
    },
    {
      icon: TrendingUp,
      title: "Market Making",
      description: "Understand core market-making concepts and learn how to quickly estimate probabilities/expected values and communicate effectively in market-making games."
    },
    {
      icon: BarChart3,
      title: "Statistics",
      description: "Build a strong foundation in statistics, including regression and hypothesis testing."
    },
    {
      icon: Ruler,
      title: "Fermi Estimation",
      description: "Master order-of-magnitude estimates and back-of-the-envelope calculations for interview problems."
    },
    {
      icon: LineChart,
      title: "Martingales",
      description: "Master core martingale concepts and commonly used martingales."
    },
    {
      icon: Grid3x3,
      title: "Random Walks",
      description: "Learn how to analyze random walks, and apply them to interview-style problems."
    }
  ];

  const courseFeatures = [
    {
      icon: BookOpen,
      title: "Detailed Theory",
      description: "Learn from the ground up with 100+ chapters covering the full spectrum of quant interview topics. Master all the topics needed to excel in your interviews. From probability to market making, we've got you covered.",
    },
    {
      icon: Brain,
      title: "Learn How to Think",
      description: "We place strong emphasis on teaching you how to think through problems and independently identify the correct approaches on your own.",
    },
    {
      icon: FileText,
      title: "Premium Questions and Solutions",
      description: "Access a growing library of 1,000+ high-quality quant interview problems. Each problem has detailed hints and solutions.",
    },
    {
      icon: RefreshCcw,
      title: "Full Refunds",
      description: "We offer a 30-day refund for yearly access and a 60-day refund for lifetime access-no questions asked. To request a refund, simply email us from the address linked to your premium account, no billing details are required.",
    }
  ];

  const faqs = [
    {
      question: "What prerequisite knowledge is required to take this course?",
      answer: "Only basic high school mathematics. All topics are covered from the basics."
    },
    {
      question: "Do you offer a refund?",
      answer: "Yes. We offer a 30-day full refund for yearly access and a 60-day full refund for lifetime access. There are no terms and conditions.",
    },
    {
      question: "How do I request a refund?",
      answer: "Simply email us at quantprof@proton.me from the email ID associated with your premium account. No billing details are required.",
    },
    {
      question: "What if I cannot afford premium?",
      answer: "You can purchase premium and request a refund. You may repeat this as often as needed, using the same payment method - effectively accessing premium for free for as long as you need. Our only request is that this is not misused.",
    },
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
    <>
      <Helmet>
        <title>Quant Interview Questions | Probability, Puzzles & Trading Problems</title>

        <meta
          name="description"
          content="Practice the most common quant interview questions asked at Jane Street, Optiver, HRT, IMC, Citadel and top trading firms. Includes probability problems, mental math, market making scenarios and brainteasers."
        />

        <link rel="canonical" href="https://quantprof.org/quant-interview-questions" />

        <meta property="og:title" content="Top Quant Interview Questions (2025)" />
        <meta
          property="og:description"
          content="Solve real quant interview questions with step-by-step solutions. Probability puzzles, expected value problems, bid/ask scenarios and HFT brainteasers."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://quantprof.org/quant-interview-questions" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Sticky Enrollment Bar */}
        <div className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 transition-all duration-300 ${showStickyBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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
                  onClick={() => navigate(
                    isBought
                      ? `/course/${courseId}/learn`
                      : `/premium`,
                  )}
                >
                  {isBought ? "Go to Course" : "Get Premium"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative w-full overflow-hidden max-w-full">
          {/* MAIN SECTION GRADIENT (RESTORED) */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/10" />

          {/* SOFT BACKGROUND BLOBS */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[60vw] max-w-[360px] aspect-square bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[70vw] max-w-[420px] aspect-square bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* CONTENT */}
          <div className="relative z-10 w-full overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Side */}
                <div className="text-center lg:text-left w-full">
                  <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
                    #1 Rated Quant Prep Course
                  </Badge>

                  <h1 className="font-bold text-foreground mb-6 leading-tight text-[clamp(1.75rem,5vw,3.75rem)]">
                    Quant Interview
                    <span className="block bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                      Masterclass
                    </span>
                  </h1>

                  <p className="text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 text-[clamp(0.95rem,2.5vw,1.25rem)]">
                    Master quantitative finance interviews with our comprehensive course designed by industry experts from top trading firms.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                    <Button
                      ref={enrollButtonRef}
                      size="lg"
                      className="px-10 py-6 text-lg shadow-lg"
                      onClick={() =>
                        navigate(isBought ? `/course/${courseId}/learn` : `/premium`)
                      }
                    >
                      {isBought ? "Go to Course" : "Get Premium"}
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <div>
                        <span className="font-semibold">4.9/5</span>
                        <span className="text-muted-foreground ml-1">• 500+ students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="w-full flex justify-center lg:justify-end overflow-hidden">
                  <div className="w-full max-w-[360px] sm:max-w-[420px] mx-auto lg:mx-0">
                    <Carousel
                      opts={{ align: "start", loop: true }}
                      plugins={[Autoplay({ delay: 3000 })]}
                      className="w-full overflow-hidden"
                    >
                      <CarouselContent className="flex w-full items-stretch">
                        {[
                          {
                            icon: FileText,
                            stat: "1000+",
                            title: "Practice Problems",
                            description:
                              "Comprehensive question bank covering all interview topics",
                            gradient: "from-primary/90 via-primary/70 to-emerald-600/80",
                          },
                          {
                            icon: GraduationCap,
                            stat: "100+",
                            title: "Chapters",
                            description:
                              "Complete theory coverage from basics to advanced",
                            gradient:
                              "from-emerald-600/90 via-teal-500/70 to-cyan-600/80",
                          },
                          {
                            icon: Award,
                            stat: "30 Days",
                            title: "Full Refund",
                            description:
                              "Not satisfied? Get a complete refund, no questions asked",
                            gradient:
                              "from-pink-600/90 via-rose-500/70 to-red-400/80",
                          },
                        ].map((item, index) => (
                          <CarouselItem
                            key={index}
                            className="flex w-full min-w-full max-w-full shrink-0 grow-0 items-stretch"
                          >
                            <Card className="w-full h-full overflow-hidden flex flex-col">
                              {/* ⬆️ INCREASED HEADER HEIGHT */}
                              <div
                                className={`bg-gradient-to-br ${item.gradient} h-56 sm:h-60 lg:h-64 flex items-center justify-center`}
                              >
                                <div className="text-center text-white">
                                  <item.icon className="w-14 h-14 mx-auto mb-4" />
                                  <div className="text-4xl sm:text-5xl font-bold">
                                    {item.stat}
                                  </div>
                                </div>
                              </div>

                              {/* CONTENT */}
                              <CardContent className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">
                                  {item.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {item.description}
                                </p>
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
    </>
  );
};

export default CourseDetail;