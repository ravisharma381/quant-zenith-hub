import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ProbabilityMaster = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/games")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </div>

        {/* Game Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Probability Master</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Coming soon! Master probability and statistics under time pressure.
          </p>
          <div className="bg-card border border-border rounded-xl p-12">
            <span className="text-6xl mb-4 block">🎲</span>
            <p className="text-muted-foreground">
              Solve challenging probability problems to sharpen your quantitative skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityMaster;