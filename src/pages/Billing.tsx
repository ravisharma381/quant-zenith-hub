import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CreditCard, Clock } from "lucide-react";

const Billing = () => {
  const purchases = [
    {
      id: 1,
      title: "Quant Interview Masterclass",
      instructor: "Dr. Michael Rodriguez",
      purchaseDate: "March 15, 2024",
      expirationDate: "March 15, 2025",
      amount: "$149.00",
      paymentMethod: "Visa •••• 4242",
      status: "Active",
      level: "Beginner",
      gradient: "from-orange-400 to-yellow-500"
    },
    {
      id: 2,
      title: "Machine Learning for Finance",
      instructor: "Sarah Chen",
      purchaseDate: "February 28, 2024",
      expirationDate: "February 28, 2025",
      amount: "$299.00",
      paymentMethod: "Mastercard •••• 8888",
      status: "Active",
      level: "Advanced",
      gradient: "from-purple-500 to-blue-600"
    },
    {
      id: 3,
      title: "Risk Management & Portfolio Theory",
      instructor: "Prof. David Kim",
      purchaseDate: "January 10, 2024",
      expirationDate: "January 10, 2025",
      amount: "$199.00",
      paymentMethod: "Visa •••• 4242",
      status: "Active",
      level: "Intermediate",
      gradient: "from-pink-500 to-purple-600"
    }
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
      case "Expired": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Expiring Soon": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

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

        {/* Purchase History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Purchase History</h2>
          
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <div className="flex">
                  {/* Course thumbnail with gradient */}
                  <div className={`w-32 h-32 bg-gradient-to-br ${purchase.gradient} flex items-center justify-center flex-shrink-0`}>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {purchase.instructor.split(' ').map(n => n[0]).join('')}
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
                        Order ID: QP-{purchase.id.toString().padStart(6, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;