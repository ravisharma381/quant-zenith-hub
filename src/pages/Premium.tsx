import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Crown, Lightbulb, Lock, Gamepad2, Tag, BookOpen, RefreshCcw, GraduationCap, ListMusic } from "lucide-react";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PromoBanner from "@/components/PromoBanner";

const planTemplates = [
  {
    name: "SixMonth",
    label: "6 Months",
    description: "Access all premium features for six months, with no automatic renewal and a 30-day, no-questions-asked full refund.",
    originalPrice: "$180",
    price: "$99",
    discount: "LIMITED TIME 30% OFF",
    period: "/6 months",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    borderColor: "border-purple-500 hover:border-purple-600",
    badgeColor: 'text-purple-700',
    featured: false,
    features: [
      { text: "30-day, no-questions-asked full refund.", bold: "full refund" },
      { text: "1,000+ high-quality quant interview problems", bold: "1,000+" },
      { text: "Detailed hints and solution for every problem", bold: "" },
      { text: "Hundreds of company-tagged questions", bold: 'company-tagged' },
      { text: "Curated playlists for fast, focused revision", bold: 'Curated playlists' },
      { text: "100+ chapters with in-depth theory", bold: '100+' },
    ],
  },
  {
    name: "TwoYear",
    label: "2 Years",
    description: "Access all premium features for two years at the best value, with no automatic renewal and a 30-day, no-questions-asked full refund.",
    originalPrice: "$720",
    price: "$299",
    discount: "BEST VALUE 🔥",
    period: "/2 years",
    borderColor: "border-amber-500 hover:border-amber-600",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    featured: true,
    features: [
      { text: "30-day, no-questions-asked full refund.", bold: "full refund" },
      { text: "Includes all premium features in the 6 monthly plan", bold: null },
      { text: "Access to all upcoming features with no price increases.", bold: "no price increases" },
    ],
  },
  {
    name: "Yearly",
    label: "Yearly",
    description: "Access all premium features for one year, with no automatic renewal and a 30-day, no-questions-asked full refund.",
    originalPrice: "$360",
    price: "$199",
    discount: "LIMITED TIME 30% OFF",
    period: "/year",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    borderColor: "border-purple-500 hover:border-purple-600",
    badgeColor: 'text-purple-700',
    featured: false,
    features: [
      { text: "30-day, no-questions-asked full refund.", bold: "full refund" },
      { text: "1,000+ high-quality quant interview problems", bold: "1,000+" },
      { text: "Detailed hints and solution for every problem", bold: "" },
      { text: "Hundreds of company-tagged questions", bold: 'company-tagged' },
      { text: "Curated playlists for fast, focused revision", bold: 'Curated playlists' },
      { text: "100+ chapters with in-depth theory", bold: '100+' },
    ],
  },
  {
    name: "Lifetime",
    label: "Lifetime",
    description: "Get lifetime access to all premium features with a one-time payment and a 30-day, no-questions-asked full refund.",
    originalPrice: "$599",
    price: "$399",
    discount: "LIMITED TIME 30% OFF",
    period: " one-time",
    borderColor: "border-amber-500 hover:border-amber-600",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    badgeColor: "bg-amber-100 text-amber-700",
    featured: false,
    features: [
      { text: "30-day, no-questions-asked full refund.", bold: "full refund" },
      { text: "Includes all premium features in the yearly plan", bold: null },
      { text: "Access to all upcoming features with no price increases.", bold: "no price increases" },
    ],
  },
];

const features = [
  {
    icon: Crown,
    title: "Premium questions",
    description: "Unlock 1,000+ carefully selected, high-quality problems. Our library is continuously updated and expanding. We also have company tagged playlists.",
  },
  {
    icon: Lightbulb,
    title: "Hints",
    description: "Stuck on a problem? Each problem includes carefully crafted hints that simulate the interview experience - helping you converge on the correct approach.",
  },
  {
    icon: BookOpen,
    title: "Solutions",
    description: "Every problem has a detailed solution. Our solutions make learning easier through clear explanations and interview-focused reasoning. QuantProf places a strong emphasis on how to think about a problem, not just on the final answer.",
  },
  {
    icon: RefreshCcw,
    title: "Refunds",
    description: "We offer a 30-day refund - no questions asked. To request a refund, simply email us from the email ID linked to your premium account, no billing details are required. If you cannot afford premium, you are free to purchase it, request a refund, and repeat this as often as needed - effectively accessing premium for free.",
  },
  {
    icon: GraduationCap,
    title: "Courses",
    description: "In-depth courses covering everything you need to ace quant interviews, including brainteasers, combinatorics, probability, statistics, martingales, market making, and much more.",
  },
  {
    icon: ListMusic,
    title: "Company tagged playlists",
    description: "Playlists featuring company-specific interview problems from top firms, along with quick-revision playlists and targeted topic playlists to strengthen weak areas.",
  },
];

const faqs = [
  {
    question: "Do you offer a refund?",
    answer: "Yes. We offer a 30-day refund - no questions asked. There are no terms and conditions.",
  },
  {
    question: "How do I request a refund?",
    answer: "Simply email us at quantprof@proton.me from the email ID associated with your premium account. No billing details are required.",
  },
  {
    question: "What if I cannot afford premium?",
    answer: "You can purchase premium and request a refund. You may repeat this as often as needed, using the same payment method - effectively accessing premium for free for as long as you need. Our only request is that this is not misused.",
  },
  {
    question: "What prerequisite knowledge is required to take the courses?",
    answer: "Only basic high school mathematics. All topics are covered from the basics.",
  },
  {
    question: "How are firm-specific problems updated?",
    answer: "Firm-specific problems are carefully curated using direct interview experiences and are updated regularly.",
  },
  {
    question: "What makes QuantProf unique?",
    answer: "QuantProf offers a higher quality problem collection that is continuously updated, along with structured courses designed to help you develop the skills needed to solve challenging problems on your own.",
  },
];

const Premium = () => {
  const [pricingMap, setPricingMap] = useState<Record<string, { price?: number; originalPrice?: number, currency?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [payInitiated, setPayInitiated] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [plansV3, setPlansV3] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user, userProfile, setRerender, region, regionLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const enableBoth = userProfile?.usePaypal
  // const enableBoth = true

  // TOGGLE FOR V3 PRICING

  const USE_PRICING_V3 = true;
  const planTemplateMap = Object.fromEntries(
    planTemplates.map((tpl) => [tpl.name.toLowerCase(), tpl])
  );

  useEffect(() => {
    const autoBuy = searchParams.get("autobuy");
    if (autoBuy && user) {
      handleGetStartedV3(decodeURIComponent(autoBuy));
    }
  }, [user]);


  // v3 Pricing
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const getPlans = httpsCallable(
          functions,
          USE_PRICING_V3 ? "getPlansV3" : "getPlansV2"
        );

        const res: any = await getPlans();

        const plans = res.data?.plans || [];

        setPlansV3(plans);

      } catch (err) {
        console.error("Error fetching pricing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const plans = plansV3.map((plan: any) => {
    const tpl = planTemplateMap[plan.name.toLowerCase()];

    return {
      name: plan.name,
      label: tpl?.label,
      description: tpl?.description || "",
      features: tpl?.features || [],
      buttonColor: tpl?.buttonColor || "bg-purple-600",
      borderColor: tpl?.borderColor || "border-purple-500",
      badgeColor: tpl?.badgeColor || "",
      featured: tpl?.featured || false,
      discount: tpl?.discount || "",
      period: tpl?.period || "",

      price:
        typeof plan.price === "number"
          ? `${plan.currency === "INR" ? "₹" : "$"}${plan.price}`
          : "$—",

      originalPrice:
        typeof plan.originalPrice === "number"
          ? `${plan.currency === "INR" ? "₹" : "$"}${plan.originalPrice}`
          : "",
    };
  });

  const displayPlans = loading ? planTemplates.slice(0, 2) : plans;

  const handleGetStartedV3 = async (planName: string) => {
    const encodedPlan = encodeURIComponent(planName);

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/premium?autobuy=${encodedPlan}`)}`);
      return;
    }

    if (payInitiated) return;
    setPayInitiated(planName);
    setMethod('razorpay');

    try {
      const fn = httpsCallable(functions, "createPremiumOrderV3");

      const resp: any = await fn({ planType: planName });

      const { orderId, keyId, amount, currency } = resp.data.data;

      const options = {
        key: keyId,
        order_id: orderId,
        amount,
        currency,
        image: "https://quantprof.org/favicon-96x96.png",
        name: "QuantProf",
        description: `${planName} Premium Access`,
        handler: () => {
          navigate("/?success=true", { replace: true });
          setRerender(true);
        },
        modal: { ondismiss: () => setPayInitiated(null) },
        theme: { color: "hsl(270,95%,60%)" },
        prefill: { email: userProfile?.email },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err?.message || "Unable to start Razorpay checkout",
        variant: "destructive",
      });
    } finally {
      setPayInitiated(null);
    }
  };

  const handlePaypalGetStartedV3 = async (planName: string) => {
    const encodedPlan = encodeURIComponent(planName);

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/premium?autobuy=${encodedPlan}`)}`);
      return;
    }

    if (payInitiated) return;
    setPayInitiated(planName);
    setMethod('paypal');

    try {
      const fn = httpsCallable(functions, "createPayPalOrderV3");

      const resp: any = await fn({ planType: planName });

      const approvalUrl = resp.data.data.approvalUrl;

      window.open(approvalUrl, "_blank");

    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err?.message || "Unable to start PayPal checkout",
        variant: "destructive",
      });
    } finally {
      setPayInitiated(null);
    }
  };


  // v2 - pricing from functions

  // useEffect(() => {
  //   const fetchPricing = async () => {
  //     try {
  //       const getPlans = httpsCallable(functions, "getPlansV2");
  //       const res: any = await getPlans();

  //       const plans = res.data?.plans || [];

  //       const map: Record<
  //         string,
  //         { price: number; originalPrice: number | null; currency: string }
  //       > = {};

  //       plans.forEach((plan: any) => {
  //         if (!plan?.name) return;

  //         map[String(plan.name).toLowerCase()] = {
  //           price: plan.price,
  //           originalPrice: plan.originalPrice ?? null,
  //           currency: plan.currency,
  //         };
  //       });
  //       setPricingMap(map);
  //     } catch (err) {
  //       console.error("Error fetching pricing:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPricing();
  // }, []);
  // const handlePaypalGetStarted = async (planName: string) => {
  //   const encodedPlan = encodeURIComponent(planName);

  //   // Require login
  //   if (!user) {
  //     navigate(`/login?redirect=${encodeURIComponent(`/premium?autobuy=${encodedPlan}`)}`);
  //     return;
  //   }

  //   if (payInitiated) return;
  //   setPayInitiated(planName);
  //   setMethod('paypal');

  //   try {
  //     const createPayPalOrder = httpsCallable(functions, "createPayPalOrder");

  //     const resp: any = await createPayPalOrder({
  //       planType: planName,
  //     });

  //     const payload = resp?.data?.data;
  //     if (!payload?.approvalUrl) {
  //       throw new Error("PayPal approval URL not returned");
  //     }

  //     // Open PayPal checkout
  //     window.open(payload.approvalUrl, "_blank");

  //   } catch (err: any) {
  //     console.error("PayPal checkout failed", err);
  //     toast({
  //       title: "Payment failed",
  //       description: err?.message || "Unable to start PayPal checkout",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setPayInitiated(null);
  //   }
  // };

  // const handleGetStartedV2 = async (planName: string) => {
  //   const encodedPlan = encodeURIComponent(planName);

  //   // 🔒 Require login
  //   if (!user) {
  //     navigate(
  //       `/login?redirect=${encodeURIComponent(`/premium?autobuy=${encodedPlan}`)}`
  //     );
  //     return;
  //   }

  //   if (payInitiated) return;
  //   setPayInitiated(planName);
  //   setMethod('razorpay');

  //   try {
  //     const createPremiumOrder = httpsCallable(
  //       functions,
  //       "createPremiumOrderV2"
  //     );

  //     const resp = await createPremiumOrder({ planType: planName });

  //     const result = resp.data as {
  //       ok: boolean;
  //       data?: {
  //         orderId: string;
  //         keyId: string;
  //         amount: number;
  //         currency: string;
  //       };
  //     };

  //     if (!result.ok || !result.data) {
  //       console.error("createPremiumOrder invalid response:", resp);
  //       throw new Error("Invalid Razorpay order response");
  //     }

  //     const { orderId, keyId, amount, currency } = result.data;

  //     const options = {
  //       key: keyId,
  //       order_id: orderId,
  //       amount,
  //       currency,
  //       image: "https://quantprof.org/favicon-96x96.png",
  //       name: "QuantProf",
  //       description: `${planName} Premium Access`,

  //       handler: () => {
  //         navigate("/?success=true", { replace: true });
  //         setRerender(true);
  //       },

  //       modal: {
  //         ondismiss: () => {
  //           setPayInitiated(null);
  //         },
  //       },

  //       theme: {
  //         color: "hsl(270,95%,60%)",
  //       },
  //       prefill: {
  //         email: userProfile?.email,
  //       },
  //     };

  //     const rzp = new (window as any).Razorpay(options);
  //     rzp.open();

  //   } catch (err: any) {
  //     console.error("Razorpay checkout failed:", err);
  //     toast({
  //       title: "Payment failed",
  //       description: err?.message || "Unable to start Razorpay checkout",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setPayInitiated(null);
  //   }
  // };

  // const plans = planTemplates.map((tpl) => {
  //   const found = pricingMap[tpl.name.toLowerCase()];
  //   return {
  //     ...tpl,
  //     price: found && typeof found.price === "number" ? `$${found.price}` : "$—",
  //     originalPrice: found && typeof found.originalPrice === "number" ? `$${found.originalPrice}` : "",
  //   };
  // });




  const SkeletonBox = ({ className = "" }) => (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  );

  const FeatureSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 animate-pulse">

        {/* icon placeholder */}
        <div className="w-5 h-5 rounded bg-muted mt-0.5" />

        {/* text placeholder */}
        <div className="flex-1 space-y-2">
          <div className="h-3 w-4/5 bg-muted rounded" />
        </div>

      </div>
    ))
  )

  const CardSkeleton = () => (
    <Card className="relative border-2 border-border bg-card overflow-hidden rounded-xl h-full flex flex-col">
      <CardContent className="p-8 flex flex-col h-full">

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <SkeletonBox className="h-8 w-40" />
            <SkeletonBox className="h-5 w-24 rounded-md" />
          </div>

          <SkeletonBox className="h-4 w-full mb-2" />
          <SkeletonBox className="h-4 w-5/6 mb-6" />

          {/* Pricing */}
          <div className="mb-4 h-[64px] flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-1">
              <SkeletonBox className="h-4 w-16" />
              <SkeletonBox className="h-4 w-20 rounded-md" />
            </div>
            <div className="flex items-baseline gap-2">
              <SkeletonBox className="h-10 w-24" />
              <SkeletonBox className="h-4 w-16" />
            </div>
          </div>

          {/* Buttons */}
          <div>
            <SkeletonBox className="h-12 w-full rounded-lg mb-4" />
            <SkeletonBox className="h-12 w-full rounded-lg mb-6" />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <SkeletonBox className="w-5 h-5 rounded-full mt-1" />
              <div className="flex-1">
                <SkeletonBox className="h-4 w-full mb-1" />
                <SkeletonBox className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )

  return (
    <>
      <Helmet>
        <title>{`Buy Premium | QuantProf`}</title>
        <meta
          name="description"
          content="QuantProf"
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        {showBanner && <PromoBanner onClose={() => setShowBanner(false)} />}
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Unlock The Best Tools For Acing Quant Interviews
            </h1>
            <p className="text-lg text-muted-foreground">
              Structured practice, deep theory, and interview-level problems-everything serious quant prep demands.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
            {loading ?
              Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />) : displayPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative border-2 ${plan.borderColor} bg-card overflow-hidden rounded-xl h-full flex flex-col`}
                >
                  <CardContent className="p-8 flex flex-col h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-3xl font-bold text-foreground">{plan.label}</h3>
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
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-muted-foreground line-through text-sm">
                                {plan.originalPrice}
                              </span>
                              <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-0.5 font-bold">
                                {plan.discount}
                              </Badge>
                            </div>
                            <div className="flex items-baseline">
                              <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                              <span className="text-muted-foreground ml-1">{plan.period}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {enableBoth ?
                        <div>
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
                            onClick={() => handlePaypalGetStartedV3(plan.name)}
                          >
                            {(payInitiated === plan.name && method === 'paypal') ? "Initiating Payment…" : "Get Started"}
                            <span className="text-xs font-normal opacity-80">via PayPal</span>
                          </Button>
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
                            onClick={() => handleGetStartedV3(plan.name)}
                          >
                            {(payInitiated === plan.name && method === 'razorpay') ? "Initiating Payment…" : "Get Started"}
                            <span className="text-xs font-normal opacity-80">via Razorpay</span>
                          </Button>
                        </div>
                        : <Button
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
                          onClick={() => handleGetStartedV3(plan.name)}
                        >
                          {(payInitiated === plan.name) ? "Initiating Payment…" : "Get Started"}
                        </Button>
                      }
                    </div>

                    <div className="space-y-3">
                      {regionLoading ?
                        <FeatureSkeleton />
                        : plan.features.slice(region === 'IN' ? 1 : 0, 6).map((feature, i) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.filter((_, idx) => ((region === 'IN' && idx === 3) ? false : true)).map((feature, index) => (
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
                For any additional questions, you can reach us directly at{" "}
                <a href="mailto:quantprof@proton.me" className="text-purple-400 hover:underline">
                  quantprof@proton.me
                </a>
                .
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.slice(region === 'IN' ? 3 : 0, 6).map((faq, index) => (
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
    </>
  );
};

export default Premium;