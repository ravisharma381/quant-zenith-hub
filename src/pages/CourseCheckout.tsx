import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions, db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Course } from "./Courses";

const CourseCheckout = () => {
  const { user, setRerender } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const { toast } = useToast();
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseLoading, setCourseLoading] = useState(true);

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!slug) return;

        const q = query(collection(db, "courses"), where("slug", "==", slug));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as Omit<Course, "id">;
          const fetchedCourse = { id: snapshot.docs[0].id, ...docData };
          setCourse(fetchedCourse);

          // 🔹 Check if user already enrolled
          if (user && user.uid) {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              console.log('userSnap.data()', userSnap.data());

              const data = userSnap.data();
              const purchased = data?.purchasedCourses || [];
              const alreadyEnrolled = purchased.includes(fetchedCourse.id);

              if (alreadyEnrolled) {
                console.log("✅ User already enrolled, redirecting...");
                navigate(`/course/${fetchedCourse.slug}/learn`, { replace: true });
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        toast({
          title: "Error",
          description: "Failed to load course details.",
          variant: "destructive",
        });
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
  }, [slug, user]);


  const handlePayment = async () => {
    setStep(2);
    if (!user) {
      return;
    } setLoading(true);
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );
      const createOrder = httpsCallable(functions, "createOrder");

      // 🔹 call your edge function (course + plan)
      const response: any = await Promise.race([
        createOrder({
          courseId: course?.id || '',
          planType: selectedPlan,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
      ]);
      const { orderId, keyId, amount, currency } = response?.data?.data || {};

      // 🔹 dynamically load Razorpay checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: keyId,
          amount,
          currency,
          name: "QuantZenith",
          description: `Purchase ${selectedPlan} plan`,
          order_id: orderId,
          prefill: {
            name: user.displayName || "",
            email: user.email || "",
          },
          theme: { color: "#25FB2B" },
          handler: (response: any) => {
            console.log("Payment success:", response);
            setRerender(true);
            navigate("/course/quant-interview-masterclass/learn");
            toast({
              title: "Payment successful",
              description: "Your Payment has been successful.",
            });
          },
          modal: {
            ondismiss: () => {
              console.log("Payment popup closed");
              setStep(1);
              toast({
                title: "Payment cancelled",
                description: "Your Payment has been cancelled.",
              });
            },
          },
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error("Payment error:", error);
      setStep(1);
      toast({
        title: "Payment cancelled",
        description: "Something went wrong while starting payment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                  }`}>
                  1
                </div>
                <span className="text-sm font-medium">Select Plan</span>
              </div>
              <div className="w-12 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                  }`}>
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          {!course && courseLoading && (
            <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                {/* Scaling Circle */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                  <div className="w-12 h-12 rounded-full bg-primary"></div>
                </div>

                {/* Loading Text */}
                <p className="text-muted-foreground text-lg font-medium">
                  Fetching course plans...
                </p>
              </div>
            </div>
          )}

          {!courseLoading && course && <div className="relative">
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
                      className={`cursor-pointer transition-all ${selectedPlan === plan.id
                        ? plan.id === "yearly"
                          ? "border-primary border-2 bg-primary/5"
                          : "border-purple-500 border-2 bg-purple-500/5"
                        : plan.id === "lifetime"
                          ? "border-border hover:border-purple-500/50"
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
                            <span className={`text-4xl font-bold ${plan.id === "lifetime" ? "text-purple-500" : "text-primary"}`}>
                              {`${course.currencySymbol} ${(course.price[plan.id] || 0)}`}
                            </span>
                            <span className="text-muted-foreground">{course.currency}</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {plan.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Check className={`w-5 h-5 ${plan.id === "lifetime" ? "text-purple-500" : "text-primary"} flex-shrink-0 mt-0.5`} />
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
                    disabled={!selectedPlan || loading}
                    onClick={handlePayment}
                    className="bg-primary hover:bg-primary/90 text-background font-semibold px-12 py-6 text-lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
                <div className="flex flex-col items-center gap-6">
                  {/* Scaling Circle */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/20 animate-ping absolute"></div>
                    <div className="w-12 h-12 rounded-full bg-primary"></div>
                  </div>

                  {/* Loading Text */}
                  <p className="text-muted-foreground text-lg font-medium">
                    Processing your payment...
                  </p>
                </div>
              </div>
            )}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default CourseCheckout;
