import React from "react";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Email</h3>
                <a 
                  href="mailto:quantprof@proton.me" 
                  className="text-primary hover:text-primary/80 transition-colors text-lg"
                >
                  quantprof@proton.me
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
