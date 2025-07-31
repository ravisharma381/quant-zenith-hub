import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Star, BookOpen, TrendingUp, Target, Users, Lightbulb, Award, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MLCourseDetail = () => {
  const navigate = useNavigate();

  const features = [
    "Advanced machine learning algorithms for finance",
    "Real-world financial datasets and case studies", 
    "Python programming with scikit-learn and TensorFlow",
    "Portfolio optimization using ML techniques"
  ];

  const masterTopics = [
    {
      icon: BookOpen,
      title: "ML Fundamentals",
      description: "Master the core machine learning concepts essential for financial applications."
    },
    {
      icon: TrendingUp,
      title: "Predictive Modeling", 
      description: "Build sophisticated models to predict market movements and asset prices."
    },
    {
      icon: Target,
      title: "Risk Analytics",
      description: "Apply ML techniques to identify and quantify financial risks."
    },
    {
      icon: Users,
      title: "Portfolio Management",
      description: "Use machine learning for optimal portfolio construction and rebalancing."
    },
    {
      icon: Lightbulb,
      title: "Algorithm Trading",
      description: "Develop ML-powered trading strategies and backtesting frameworks."
    },
    {
      icon: Award,
      title: "Career Advancement",
      description: "Get insights on ML roles in quantitative finance and fintech."
    }
  ];

  const faqs = [
    {
      question: "What programming experience do I need?",
      answer: "Basic Python knowledge is required. We provide refresher materials for NumPy, Pandas, and machine learning libraries."
    },
    {
      question: "How long does the course take to complete?",
      answer: "The course contains 50+ hours of content. Most students complete it in 6-10 weeks studying 5-8 hours per week."
    },
    {
      question: "Do you provide real financial data?",
      answer: "Yes, we work with real market data and provide access to financial datasets for hands-on practice."
    },
    {
      question: "What ML frameworks are covered?",
      answer: "The course covers scikit-learn, TensorFlow, PyTorch, and specialized financial ML libraries like zipline."
    },
    {
      question: "Is there a completion certificate?",
      answer: "Yes, you'll receive a verified certificate upon completion that you can add to your LinkedIn profile."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background via-purple-500/10 to-purple-500/20 overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Course Info */}
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-6">
                  Machine Learning for Finance
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Apply cutting-edge machine learning techniques to financial modeling and prediction
                </p>
                
                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-background" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA and Rating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button 
                    size="lg" 
                    className="bg-purple-500 hover:bg-purple-600 text-background font-semibold px-8 hover:!bg-purple-600 hover:!shadow-[0_0_40px_hsl(270_91%_65%_/_0.3)]"
                    onClick={() => navigate("/course/machine-learning-for-finance/learn")}
                  >
                    Enroll Me Now - £299
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium text-foreground">4.6/5</span>
                    </div>
                    <span className="text-muted-foreground">from 350+ students</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Course Preview */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <div className="bg-gradient-to-br from-purple-500/80 to-purple-600/60 rounded-xl w-full h-80 relative overflow-hidden flex items-center justify-center cursor-pointer hover:from-purple-500/90 hover:to-purple-600/70 transition-all duration-300">
                    <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
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

      {/* What You'll Master Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What You'll Master</h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive curriculum covers everything you need to apply ML in quantitative finance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masterTopics.map((topic, index) => (
              <Card key={index} className="border-border hover:border-purple-500/50 transition-colors h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <topic.icon className="w-6 h-6 text-purple-500" />
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
                <AccordionTrigger className="text-left text-foreground hover:text-purple-500 [&[data-state=open]]:text-purple-500 [&>svg]:text-white">
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
            className="bg-purple-500 hover:bg-purple-600 text-background font-semibold px-12 py-6 text-lg hover:!bg-purple-600 hover:!shadow-[0_0_40px_hsl(270_91%_65%_/_0.3)]"
            onClick={() => navigate("/course/machine-learning-for-finance/learn")}
          >
            Start Your ML Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MLCourseDetail;