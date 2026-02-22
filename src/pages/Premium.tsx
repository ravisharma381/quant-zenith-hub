import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Crown, Lightbulb, BookOpen, Check, RefreshCcw, GraduationCap, ListMusic } from "lucide-react";
import PromoBanner from "@/components/PromoBanner";

const Premium = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  
  const plans = [
    {
      name: "Yearly",
      description: "Our most popular plan grants access to all premium features.",
      originalPrice: "$285",
      price: "$199",
      period: "/year",
      discount: "LIMITED TIME 30% OFF",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      borderColor: "border-purple-500",
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
      originalPrice: "$570",
      price: "$399",
      period: " one-time",
      discount: "LIMITED TIME 30% OFF",
      buttonColor: "bg-foreground hover:bg-foreground/90",
      borderColor: "border-border",
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
      description: "We offer a 30-day refund for yearly access and a 60-day refund for lifetime access - no questions asked. To request a refund, simply email us from the email ID linked to your premium account, no billing details are required. If you cannot afford premium, you are free to purchase it, request a refund, and repeat this as often as needed - effectively accessing premium for free.",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Promo Banner */}
      {showBanner && <PromoBanner onClose={() => setShowBanner(false)} />}
      
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
              className={`relative border-2 ${plan.borderColor} bg-card overflow-hidden rounded-xl`}
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`text-3xl font-bold ${plan.featured ? 'text-foreground' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <Badge className="bg-purple-100 text-purple-700 border-0 text-xs px-2 py-1">
                      🎉 Most Popular
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground line-through text-sm">{plan.originalPrice}</span>
                    <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-0.5 font-bold">
                      {plan.discount}
                    </Badge>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <Button 
                    onClick={() => navigate('/course/quant-interview-masterclass/learn/fundamentals')}
                    className={`w-full ${plan.buttonColor} ${plan.featured ? 'text-white' : 'text-background'} font-semibold py-5 rounded-lg shadow-none hover:shadow-none flex-col h-auto`}
                  >
                    <span>Get Started</span>
                    <span className="text-[11px] font-normal opacity-80">via PayPal</span>
                  </Button>
                  <Button 
                    onClick={() => navigate('/course/quant-interview-masterclass/learn/fundamentals')}
                    className={`w-full ${plan.buttonColor} ${plan.featured ? 'text-white' : 'text-background'} font-semibold py-5 rounded-lg shadow-none hover:shadow-none flex-col h-auto`}
                  >
                    <span>Get Started</span>
                    <span className="text-[11px] font-normal opacity-80">via Razorpay</span>
                  </Button>
                </div>
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
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
              <a href="mailto:team@quantprof.io" className="text-purple-400 hover:underline">
                team@quantprof.io
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
