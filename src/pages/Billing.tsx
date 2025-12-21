import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, CreditCard, Clock } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // adjust path if different

const providerLogos: Record<string, string> = {
  razorpay:
    "https://firebasestorage.googleapis.com/v0/b/quantprof-backend-9cb17.firebasestorage.app/o/razorpay-icon.webp?alt=media&token=705cbad0-3129-48ba-860e-cf0b99c11f29",
  paypal:
    "https://firebasestorage.googleapis.com/v0/b/quantprof-backend-9cb17.firebasestorage.app/o/paypal.png?alt=media&token=09d70de0-60b4-437e-8b21-d7be6b494ed9",
};

const BillingSkeleton = () => {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="flex">
        {/* Gradient placeholder */}
        <div className="w-32 h-32 bg-muted/20 flex-shrink-0" />

        <div className="flex-1 p-6 space-y-4">
          {/* Title + Amount Row */}
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted/30 rounded"></div>
              <div className="h-3 w-24 bg-muted/20 rounded"></div>
            </div>

            <div className="space-y-2 text-right">
              <div className="h-4 w-20 bg-muted/30 rounded ml-auto"></div>
              <div className="h-5 w-16 bg-muted/20 rounded ml-auto"></div>
            </div>
          </div>

          {/* Grid placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div className="space-y-2" key={i}>
                <div className="h-3 w-20 bg-muted/20 rounded"></div>
                <div className="h-4 w-32 bg-muted/30 rounded"></div>
              </div>
            ))}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between mt-2">
            <div className="h-5 w-24 bg-muted/30 rounded"></div>
            <div className="h-3 w-28 bg-muted/20 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};


const Billing = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const gradients = [
    "from-orange-400 to-yellow-500",
    "from-purple-500 to-blue-600",
    "from-pink-500 to-purple-600",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Expired":
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchTx = async () => {
      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          where("status", "==", "success"),
          orderBy("updatedAt", "desc"),
          limit(5) // fetch only 5 recent
        );

        const snap = await getDocs(q);

        const tx = snap.docs.map((doc) => {
          const data: any = doc.data();
          const created = data.createdAt?.toDate();

          const mapStatus =
            data.status === "success"
              ? "Active"
              : data.status === "pending"
                ? "Pending"
                : "Failed";

          const expiration =
            data.planType === "Yearly"
              ? new Date(created.setFullYear(created.getFullYear() + 1)).toLocaleDateString()
              : data.planType === "Monthly"
                ? new Date(created.setMonth(created.getMonth() + 1)).toLocaleDateString()
                : "Lifetime";

          return {
            id: doc.id,
            provider: data.provider || "Unknown",
            planType: data.planType || "N/A",
            purchaseDate: data.createdAt?.toDate().toLocaleDateString() || "N/A",
            expirationDate: expiration,
            amount: `${data.currency === "USD" ? "$" : "$"}${data.planPrice}`,
            status: mapStatus,
            gradient: gradients[Math.floor(Math.random() * gradients.length)],
          };
        });

        setTransactions(tx);
      } catch (err) {
        console.error("Transaction fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Subscription Billing
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your subscription payments and billing information
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>

          <div className="space-y-4">
            <BillingSkeleton />
            <BillingSkeleton />
            <BillingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Subscription Billing</h1>
          <p className="text-muted-foreground text-lg">
            Manage your subscription payments and billing information
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Transactions</h2>

          <div className="space-y-4">
            {transactions.map((tx) => {
              const today = new Date();
              const expires = tx.expiresAt ? new Date(tx.expiresAt) : null;
              const isExpired = expires ? expires < today : false;

              const expiryLabel = isExpired ? "Expired At" : "Expires On";
              const statusLabel = isExpired ? "Expired" : tx.status;

              const providerKey = tx.provider?.toLowerCase();
              const logoUrl = providerLogos[providerKey];

              return (
                <Card key={tx.id} className="overflow-hidden p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6">

                    <div className="w-full md:w-32 h-32 rounded-xl bg-white flex items-center justify-center shrink-0 relative border border-border shadow-sm overflow-hidden">
                      <div className="absolute inset-0 bg-white" />
                      {/* Logo */}
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={tx.provider}
                          className="absolute inset-0 w-16 h-16 object-contain m-auto"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">
                              {tx.provider.slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Details Section */}
                    <div className="flex-1">

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {tx.planType} Plan
                          </h3>
                          <p className="text-sm text-muted-foreground">{tx.provider}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-xl font-bold text-foreground">{tx.amount}</div>
                          <Badge className={getStatusColor(statusLabel)} variant="outline">
                            {statusLabel}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Purchased */}
                        <div className="flex items-start gap-2">
                          <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-muted-foreground text-xs">Purchased</div>
                            <div className="font-medium">{tx.purchaseDate}</div>
                          </div>
                        </div>

                        {/* Expiry */}
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-muted-foreground text-xs">{expiryLabel}</div>
                            <div className={`font-medium ${isExpired ? "text-red-500" : "text-foreground"}`}>
                              {tx.expirationDate}
                            </div>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-start gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-muted-foreground text-xs">Payment Method</div>
                            <div className="font-medium">{tx.provider}</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mt-4">
                        Transaction ID: {tx.id}
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
            {transactions.length === 0 && (
              <div className="text-muted-foreground text-center py-10">
                No transactions found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Billing;
