import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CreditCard, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CourseCheckout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const plans = [
    {
      id: "yearly",
      name: "Yearly Access",
      price: "24.45",
      benefits: [
        "Full course access for 1 year",
        "All 70+ hours of content",
        "Real interview questions",
        "Python & R code examples",
        "Certificate of completion",
        "Email support"
      ]
    },
    {
      id: "lifetime",
      name: "Lifetime Access",
      price: "49.45",
      benefits: [
        "Unlimited lifetime access",
        "All 70+ hours of content",
        "Real interview questions",
        "Python & R code examples",
        "Certificate of completion",
        "Priority email support",
        "All future updates included",
        "Access to exclusive community"
      ]
    }
  ];

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast.error("Please fill in all payment details");
      return;
    }

    // Simulate payment processing
    toast.success("Payment successful! Redirecting to course...");
    
    setTimeout(() => {
      navigate("/course/quant-interview-masterclass/learn");
    }, 1500);
  };

  const handleContinueToPayment = () => {
    setStep(2);
  };

  const handleBackToPlan = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-background py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Enroll in Quant Interview Masterclass
            </h1>
            <p className="text-lg text-muted-foreground">
              {step === 1 ? "Choose your plan and start learning today" : "Complete your payment"}
            </p>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 1 ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Select Plan</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step === 2 ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Step 1: Plan Selection */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
                  Select Your Plan
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? plan.id === "yearly"
                            ? "border-primary border-2 bg-primary/5"
                            : "border-purple-500 border-2 bg-purple-500/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-foreground mb-2">
                            {plan.name}
                          </h3>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-primary">
                              ${plan.price}
                            </span>
                            <span className="text-muted-foreground">USD</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {plan.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-12">
                  <Button
                    size="lg"
                    onClick={handleContinueToPayment}
                    className="bg-primary hover:bg-primary/90 text-background font-semibold px-12 py-6 text-lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Details */}
            {step === 2 && (
              <div className="animate-slide-in-right">
                <Button
                  variant="ghost"
                  onClick={handleBackToPlan}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Plan Selection
                </Button>

                <div className="max-w-2xl mx-auto">
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Details
                      </CardTitle>
                      <div className="text-sm text-muted-foreground mt-2">
                        Selected: {plans.find(p => p.id === selectedPlan)?.name} - ${plans.find(p => p.id === selectedPlan)?.price} USD
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEnroll} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 16) {
                                setCardNumber(
                                  value.replace(/(\d{4})/g, "$1 ").trim()
                                );
                              }
                            }}
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 4) {
                                  const formatted =
                                    value.length >= 2
                                      ? `${value.slice(0, 2)}/${value.slice(2)}`
                                      : value;
                                  setExpiryDate(formatted);
                                }
                              }}
                              maxLength={5}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              type="password"
                              value={cvv}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 3) {
                                  setCvv(value);
                                }
                              }}
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-background font-semibold py-6 text-lg"
                          >
                            Enroll - ${plans.find(p => p.id === selectedPlan)?.price} USD
                          </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Lock className="w-4 h-4" />
                          <span>Secure payment processing</span>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Trust Indicators */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Instant access after enrollment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>500+ students already enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
