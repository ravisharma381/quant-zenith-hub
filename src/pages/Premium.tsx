import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Crown, Lightbulb, Lock, Gamepad2, Tag, BookOpen } from "lucide-react";
import { Check } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const planTemplates = [
  // {
  //   name: "Monthly",
  //   description: "Gain access to our collection of over 1200+ questions.",
  //   originalPrice: "$360",
  //   price: "$25",
  //   period: "/month",
  //   borderColor: "border-blue-500 hover:border-blue-600",
  //   buttonColor: "bg-blue-600 hover:bg-blue-700",
  //   badgeColor: "bg-blue-100 text-blue-700",
  //   featured: false,
  //   features: [
  //     { text: "1200+ Quant Interview Questions", bold: "1200+" },
  //     { text: "Company playlists for top quant firms", bold: "top quant firms" },
  //     { text: "24/7 Support with priority feature requests from the dev team", bold: "24/7 Support" },
  //     { text: "Cheaper than a nice lunch 🍔", bold: null },
  //   ],
  // },
  {
    name: "Yearly",
    description: "Our most popular plan grants access to all premium features.",
    originalPrice: "$360",
    price: "$199",
    period: "/year",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    borderColor: "border-purple-500 hover:border-purple-600",
    badgeColor: 'text-purple-700',
    featured: true,
    features: [
      { text: "Everything in the monthly plan", bold: "monthly plan" },
      { text: "Save > 45% compared to monthly", bold: "Save > 45%" },
      { text: "24/7 Support with priority feature requests from the dev team", bold: "24/7 Support" },
      { text: "Cheaper than a nice lunch 🍔", bold: null },
    ],
  },
  {
    name: "Lifetime",
    description: "Get lifetime access to all premium features with a one-time payment.",
    originalPrice: "$599",
    price: "$399",
    period: " one-time",
    borderColor: "border-amber-500 hover:border-amber-600",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    featured: false,
    features: [
      { text: "1200+ Quant Interview Questions", bold: "1200+" },
      { text: "Company playlists for top quant firms", bold: "top quant firms" },
      { text: "Detailed solutions to every question", bold: "solutions" },
      { text: "Lifetime updates included", bold: "Lifetime updates" },
    ],
  },
];

const features = [
  {
    icon: Crown,
    title: "Premium Questions",
    description: "Gain exclusive access to our quickly-growing collection of over 1500 questions spanning probability, statistics, brainteasers, and much more.",
  },
  {
    icon: Lock,
    title: "Solutions",
    description: "See solutions written by real quants. Our solutions make learning easy, with detailed explanations and interview-focused thinking. QuantProf uniquely places large emphasis on how to think of the solution, rather than just the solution itself.",
  },
  {
    icon: Lightbulb,
    title: "Hints",
    description: "Need help? Just like in real interviews, all of our questions come with hints to point you in the right direction.",
  },
  {
    icon: Gamepad2,
    title: "Games",
    description: "Gain access to twice as many games and the ability to modify numerous parameters of existing games.",
  },
  {
    icon: Tag,
    title: "Topic Tags",
    description: "Enhance your prep by targeting sub-topics where you need more practice. With over 50 topics to filter by, you'll eliminate any weaknesses quickly!",
  },
  {
    icon: BookOpen,
    title: "Courses",
    description: "Hone your skills with access to the first ever quant recruiting textbooks. With over 500 pages of unique material crafted by quants with extensive teaching background, you will learn probability, statistics, game theory, and much more.",
  },
];

const faqs = [
  {
    question: "Can I cancel at any time?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
  },
  {
    question: "What makes QuantProf unique?",
    answer: "QuantProf is built by quants who have worked at top firms. Our focus on interview-style thinking and comprehensive solutions sets us apart from other platforms.",
  },
  {
    question: "What types of problems are included in Premium?",
    answer: "Premium includes problems covering probability, statistics, brain teasers, mental math, market making, options, and much more - all curated from real quant interviews.",
  },
  {
    question: "What do quant interviews look like?",
    answer: "Quant interviews typically include probability puzzles, mental math, market making games, coding challenges, and behavioral questions. Our platform covers all these areas.",
  },
  {
    question: "What is the expected time commitment for completing a course?",
    answer: "Most students complete our courses in 8-12 weeks studying 6-8 hours per week, though you can go at your own pace.",
  },
  {
    question: "What features do you receive with premium in the games?",
    answer: "Premium users get access to all games, customizable difficulty settings, detailed performance analytics, and the ability to practice specific question types.",
  },
];

const Premium = () => {
  const [pricingMap, setPricingMap] = useState<Record<string, { price?: number; originalPrice?: number }>>({});
  const [loading, setLoading] = useState(true);
  const [payInitiated, setPayInitiated] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const autoBuy = searchParams.get("autobuy");
    if (autoBuy && user) {
      handleGetStarted(decodeURIComponent(autoBuy));
    }
  }, [user]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const q = query(collection(db, "pricing"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const map: Record<string, any> = {};
        snap.forEach((d) => {
          const data = d.data();
          if (data && data.name) {
            map[String(data.name).toLowerCase()] = {
              price: data.price,
              originalPrice: data.originalPrice,
            };
          }
        });
        setPricingMap(map);
      } catch (err) {
        console.error("Error fetching pricing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const handleGetStarted = async (planName: string) => {
    const encodedPlan = encodeURIComponent(planName);

    // Require login
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/premium?autobuy=${encodedPlan}`)}`);
      return;
    }

    if (payInitiated) return;
    setPayInitiated(planName);

    try {
      const createPayPalOrder = httpsCallable(functions, "createPayPalOrder");

      const resp: any = await createPayPalOrder({
        planType: planName,
      });

      const payload = resp?.data?.data;
      if (!payload?.approvalUrl) {
        throw new Error("PayPal approval URL not returned");
      }

      // Open PayPal checkout
      window.open(payload.approvalUrl, "_blank");

    } catch (err: any) {
      console.error("PayPal checkout failed", err);
      toast({
        title: "Payment failed",
        description: err?.message || "Unable to start PayPal checkout",
        variant: "destructive",
      });
    } finally {
      setPayInitiated(null);
    }
  };

  const plans = planTemplates.map((tpl) => {
    const found = pricingMap[tpl.name.toLowerCase()];
    return {
      ...tpl,
      price: found && typeof found.price === "number" ? `$${found.price}` : "$—",
      originalPrice: found && typeof found.originalPrice === "number" ? `$${found.originalPrice}` : "",
    };
  });


  const SkeletonBox = ({ className = "" }) => (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock All The Tools For Quant Interview Success
          </h1>
          <p className="text-lg text-muted-foreground">
            Start practicing with our extensive set of questions, courses, and games.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-2 ${plan.borderColor} bg-card overflow-hidden rounded-xl h-full flex flex-col`}
            >
              <CardContent className="p-8 flex flex-col h-full">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-3xl font-bold text-foreground">{plan.name}</h3>
                    {plan.featured && (
                      <Badge className={`bg-purple-100 ${plan.badgeColor} border-0 text-xs px-2 py-1`}>
                        🎉 Most Popular
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                  <div className="mb-4 h-[64px] flex flex-col justify-end">
                    {loading ? (
                      <>
                        <SkeletonBox className="h-4 w-20 mb-2" />
                        <SkeletonBox className="h-10 w-32" />
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground line-through text-sm">
                          {plan.originalPrice}
                        </span>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground ml-1">{plan.period}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    className={`w-full ${plan.buttonColor} text-white font-semibold py-6 rounded-lg mb-6
                    !shadow-none
                    hover:!shadow-none
                    focus:!shadow-none
                    focus-visible:!shadow-none
                    active:!shadow-none
                    !ring-0
                    focus-visible:!ring-0
                    focus-visible:!ring-offset-0`}
                    disabled={loading || payInitiated !== null}
                    onClick={() => handleGetStarted(plan.name)}
                  >
                    {payInitiated === plan.name ? "Redirecting to PayPal…" : "Get Started"}
                  </Button>
                </div>

                {/* Features stay below, card height still stable */}
                <div className="space-y-3 mt-auto">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-500 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature.bold ? (
                          <>
                            {feature.text.split(feature.bold)[0]}
                            <span className="font-semibold text-foreground">{feature.bold}</span>
                            {feature.text.split(feature.bold)[1]}
                          </>
                        ) : (
                          feature.text
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          ))}
        </div>


        {/* Why Premium Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Why <span className="text-purple-400">Premium</span>?
            </h2>
            <p className="text-muted-foreground mt-2">
              We provide our users an unparalleled preparation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              If you have any additional questions, please feel free to contact us directly at{" "}
              <a href="mailto:quantprof@proton.me" className="text-purple-400 hover:underline">
                quantprof@proton.me
              </a>
              .
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-purple-400 [&[data-state=open]]:text-purple-400 [&>svg]:text-foreground">
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
    </div>
  );
};

export default Premium;
