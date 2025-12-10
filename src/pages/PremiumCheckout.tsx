// src/pages/PremiumCheckout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

// You can reuse planTemplates or fetch for display. We only display.
// Real price is fetched from backend when creating order.
const templates = [
    {
        name: "Monthly",
        description: "Entry-level monthly subscription.",
    },
    {
        name: "Yearly",
        description: "Most popular — yearly subscription.",
    },
    {
        name: "Lifetime",
        description: "One-time lifetime access.",
    },
];

const PremiumCheckout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, setRerender } = useAuth(); // ProtectedRoute already ensures logged in, but keep final check.
    const { toast } = useToast();
    const planQuery = searchParams.get("plan"); // expected "Monthly"|"Yearly"|"Lifetime"
    const [plan, setPlan] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState("razorpay"); // "razorpay" or "paypal"
    const [working, setWorking] = useState(false);
    const [displayPricing, setDisplayPricing] = useState<{ price?: number; originalPrice?: number } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!planQuery) {
            navigate("/premium");
            return;
        }

        const found = templates.find((p) => p.name.toLowerCase() === planQuery.toLowerCase());
        if (!found) {
            navigate("/premium");
            return;
        }
        setPlan(found);

        // Optional: fetch display-only pricing from Firestore for UI (not used for payment validation).
        (async () => {
            try {
                setLoading(true);
                const q = query(collection(db, "pricing"), where("name", "==", found.name));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    const data = snap.docs[0].data();
                    setDisplayPricing({ price: data.price, originalPrice: data.originalPrice });
                }
            } catch (err) {
                console.warn("Failed to load display pricing", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [planQuery, navigate]);

    // If someone navigates here without logged-in user, redirect (ProtectedRoute should already guard).
    useEffect(() => {
        if (!user) {
            navigate("/login?redirect=/checkout?plan=" + encodeURIComponent(planQuery || ""));
        }
    }, [user, navigate, planQuery]);

    const handleRazorpay = async () => {
        if (!plan || !user) return;
        setWorking(true);
        try {
            const createOrder = httpsCallable(functions, "createPremiumOrder");
            const resp: any = await Promise.race([
                createOrder({ planType: plan.name }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))
            ]);
            const payload = resp?.data?.data;
            if (!payload) throw new Error("No order data returned");

            const { orderId, keyId, amount, currency } = payload;

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                try {
                    const options = {
                        key: keyId,
                        amount,
                        currency,
                        order_id: orderId,
                        name: "QuantProf",
                        description: `${plan.name} plan`,
                        prefill: {
                            name: user.displayName || "",
                            email: user.email || "",
                        },
                        theme: { color: "#6b21a8" },
                        handler: (response: any) => {
                            console.log("Payment success:", response);
                            toast({
                                title: "Payment successful",
                                description: "Your Payment has been successful.",
                            });
                            setRerender(true);
                            navigate(`/`, { replace: true });
                        },
                        modal: {
                            ondismiss: () => {
                                console.log("Payment popup closed");
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
                } catch (err) {
                    toast({ title: "Payment failed", description: err?.message || String(err), variant: "destructive" });
                    throw err;
                }
            };
        } catch (err: any) {
            console.error("Razorpay error", err);
            toast({ title: "Payment failed", description: err?.message || String(err), variant: "destructive" });
        } finally {
            setWorking(false);
        }
    };

    const handlePayPal = async () => {
        if (!plan || !user) return;
        setWorking(true);
        try {
            const createPay = httpsCallable(functions, "createPayPalOrder");
            const resp: any = await createPay({ planType: plan.name });
            const payload = resp?.data?.data;
            if (!payload?.approvalUrl) throw new Error("No approval URL returned");

            const approvalUrl = payload.approvalUrl;
            // open PayPal approval in new tab
            window.open(approvalUrl, "_blank");
        } catch (err: any) {
            console.error("PayPal error", err);
            toast({ title: "Payment failed", description: err?.message || String(err), variant: "destructive" });
        } finally {
            setWorking(false);
        }
    };

    if (!plan) return null;

    if (working) {
        return (<div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
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
        </div>)
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Button variant="ghost" onClick={() => navigate("/premium")}>← Back</Button>

                    <h1 className="text-3xl font-bold my-6">Checkout — {plan.name}</h1>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{plan.description}</p>

                            <div className="mb-4">
                                <div className="text-2xl font-bold">
                                    {displayPricing?.price ? `$${displayPricing.price}` : "—"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Display price (final amount is determined at payment)
                                </div>
                            </div>

                            <div className="mt-4">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500" /> All premium features unlocked</li>
                                    <li className="flex items-start gap-3"><Check className="w-5 h-5 text-green-500" /> Cancel anytime</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 items-center mb-4">
                                <label className={`cursor-pointer p-3 border rounded ${selectedGateway === "razorpay" ? "border-primary" : "border-border"}`}>
                                    <input type="radio" name="gateway" checked={selectedGateway === "razorpay"} onChange={() => setSelectedGateway("razorpay")} className="mr-2" />
                                    Razorpay
                                </label>

                                <label className={`cursor-pointer p-3 border rounded ${selectedGateway === "paypal" ? "border-primary" : "border-border"}`}>
                                    <input type="radio" name="gateway" checked={selectedGateway === "paypal"} onChange={() => setSelectedGateway("paypal")} className="mr-2" />
                                    PayPal
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <Button className="w-full" onClick={selectedGateway === "razorpay" ? handleRazorpay : handlePayPal} disabled={working || loading}>
                                    Continue to Payment
                                </Button>
                                <Button variant="outline" onClick={() => navigate("/premium")}>Change plan</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PremiumCheckout;
