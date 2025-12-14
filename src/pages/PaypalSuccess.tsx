import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type Status = "loading" | "success" | "error";

const PaypalSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setRerender } = useAuth();

  const orderId = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    let cancelled = false;

    const capture = async () => {
      try {
        const captureOrder = httpsCallable(functions, "capturePayPalOrder");
        await captureOrder({ orderId });

        if (!cancelled) {
          setStatus("success");
        }
      } catch (err: any) {
        console.error("PayPal capture failed", err);
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    capture();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // Auto redirect after success
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(() => {
        setRerender(true);
        navigate("/", { replace: true });
      }, 2500);

      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-500" />
              <h1 className="text-xl font-semibold">
                Verifying your payment…
              </h1>
              <p className="text-muted-foreground text-sm">
                Please wait while we confirm your PayPal payment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-14 h-14 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold">
                Payment successful 🎉
              </h1>
              <p className="text-muted-foreground">
                Your premium access has been activated.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you shortly…
              </p>

              <Button
                className="w-full mt-4"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-14 h-14 mx-auto text-red-500" />
              <h1 className="text-xl font-semibold">
                We couldn’t verify your payment
              </h1>
              <p className="text-muted-foreground text-sm">
                If your amount was debited, don't worry — our system will
                reconcile it automatically.
              </p>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full"
                  onClick={() => navigate("/premium")}
                >
                  Back to Premium
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Support",
                      description:
                        "Please email quantprof@proton.me with your PayPal email.",
                    });
                  }}
                >
                  Contact Support
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaypalSuccess;
