import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  theme: "primary" | "purple";
}

const FeatureRow = ({ icon: Icon, title, description, index, theme }: FeatureRowProps) => {
  const isOddRow = index % 2 === 1;
  
  const themeColors = {
    primary: {
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
      gradientFrom: "from-primary/10",
      gradientTo: "to-primary/20",
      visualIconBg: "bg-primary/20"
    },
    purple: {
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
      gradientFrom: "from-purple-500/10",
      gradientTo: "to-purple-500/20",
      visualIconBg: "bg-purple-500/20"
    }
  };

  const colors = themeColors[theme];

  return (
    <div className="border border-border rounded-xl p-8" style={{ backgroundColor: '#1f1e1e' }}>
      <div className={`grid gap-12 items-center ${isOddRow ? 'lg:grid-cols-[2fr_3fr]' : 'lg:grid-cols-[3fr_2fr]'}`}>
        {isOddRow ? (
          <>
            {/* Image first for odd rows */}
            <div className="flex justify-center">
              <div className="w-3/5 lg:w-4/5 max-w-md">
                <div className={`bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} rounded-xl h-64 flex items-center justify-center`}>
                  <div className={`w-16 h-16 ${colors.visualIconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${colors.iconColor}`} />
                  </div>
                </div>
              </div>
            </div>
            {/* Text second for odd rows */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                {description}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Text first for even rows */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                {description}
              </p>
            </div>
            {/* Image second for even rows */}
            <div className="flex justify-center">
              <div className="w-3/5 lg:w-4/5 max-w-md">
                <div className={`bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} rounded-xl h-64 flex items-center justify-center`}>
                  <div className={`w-16 h-16 ${colors.visualIconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${colors.iconColor}`} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeatureRow;