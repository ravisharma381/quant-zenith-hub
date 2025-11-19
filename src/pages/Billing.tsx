import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendarDays, CreditCard, Clock } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth"; // adjust path if different


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
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const gradients = [
    "from-orange-400 to-yellow-500",
    "from-purple-500 to-blue-600",
    "from-pink-500 to-purple-600",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Expired": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchPurchases = async () => {
      try {
        // Step 1 — Get all transactions for this user (sorted by updatedAt)
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );

        const txSnap = await getDocs(q);
        const transactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (transactions.length === 0) {
          setPurchases([]);
          setLoading(false);
          return;
        }

        // Step 2 — Extract unique courseIds
        const courseIds = [
          ...new Set(transactions.map((tx: any) => tx.courseId))
        ];

        // Step 3 — Fetch all courses in ONE batch
        const chunks = [];
        const chunkSize = 10; // Firestore "in" supports max 30, using 10 for safety

        for (let i = 0; i < courseIds.length; i += chunkSize) {
          chunks.push(courseIds.slice(i, i + chunkSize));
        }

        const coursesMap: Record<string, any> = {};

        for (const chunk of chunks) {
          const courseQ = query(
            collection(db, "courses"),
            where("__name__", "in", chunk)
          );

          const courseSnap = await getDocs(courseQ);

          courseSnap.docs.forEach((doc) => {
            coursesMap[doc.id] = doc.data();
          });
        }

        // Step 4 — Merge transactions with course details
        const items = transactions.map((tx: any) => {
          const course = coursesMap[tx.courseId];
          const createdAt = tx.createdAt?.toDate();
          const updatedAt = tx.updatedAt?.toDate();

          return {
            id: tx.id,
            title: course?.title || tx.courseId,
            instructor: course?.author || "Unknown Instructor",
            purchaseDate: createdAt?.toLocaleDateString(),
            expirationDate:
              tx.planType === "yearly"
                ? new Date(
                  createdAt.setFullYear(createdAt.getFullYear() + 1)
                ).toLocaleDateString()
                : "Lifetime",
            amount: `${tx.currency === "USD" ? "$" : "₹"}${tx.amount}`,
            paymentMethod: `${tx.provider} — ${tx.status}`,
            status: tx.status === "success" ? "Active" : tx.status,
            level: course?.level || "Beginner",
            gradient:
              gradients[Math.floor(Math.random() * gradients.length)],
            _updatedAt: updatedAt?.getTime() || 0
          };
        });

        setPurchases(items);
      } catch (err) {
        console.error("Billing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Billing & Purchase History
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your course purchases and billing information
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Purchase History</h2>

          <div className="space-y-4">
            {/* Show 3 skeleton cards */}
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
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Billing & Purchase History</h1>
          <p className="text-muted-foreground text-lg">
            Manage your course purchases and billing information
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Purchase History</h2>

          <div className="space-y-4">
            {purchases.map((purchase, i) => (
              <Card key={purchase.id} className="overflow-hidden">
                <div className="flex">
                  {/* Course thumbnail gradient */}
                  <div
                    className={`w-32 h-32 bg-gradient-to-br ${purchase.gradient} flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {purchase.instructor.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {purchase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{purchase.instructor}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{purchase.amount}</div>
                        <Badge className={getStatusColor(purchase.status)} variant="outline">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground">Purchased</div>
                          <div className="font-medium text-foreground">{purchase.purchaseDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground">Expires</div>
                          <div className="font-medium text-foreground">{purchase.expirationDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground">Payment Method</div>
                          <div className="font-medium text-foreground">{purchase.paymentMethod}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Badge className={getLevelColor(purchase.level)} variant="outline">
                        {purchase.level}
                      </Badge>

                      <div className="text-xs text-muted-foreground">
                        Order ID: {purchase.id}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {purchases.length === 0 && (
              <div className="text-muted-foreground text-center py-10">
                You haven't purchased any courses yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
