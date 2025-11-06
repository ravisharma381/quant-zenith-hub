import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

const CourseCheckout = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Enroll in Quant Interview Masterclass
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose your plan and start learning today
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pricing Plans */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Select Your Plan
              </h2>
              
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-primary border-2 bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Label
                              htmlFor={plan.id}
                              className="text-xl font-semibold text-foreground cursor-pointer"
                            >
                              {plan.name}
                            </Label>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ${plan.price}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                USD
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            {plan.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-foreground">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </div>

            {/* Payment Form */}
            <div>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
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
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
