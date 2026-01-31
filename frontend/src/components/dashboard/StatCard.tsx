import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, delay = 0 }: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString("en-NP");
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendClass = () => {
    if (!trend) return "";
    if (trend.value > 0) return "growth-positive";
    if (trend.value < 0) return "growth-negative";
    return "bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-semibold";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={getTrendClass()}>
            <span className="flex items-center gap-1">
              {getTrendIcon()}
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="stat-label">{title}</p>
        <p className="stat-value">{formatValue(value)}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p className="text-xs text-muted-foreground">{trend.label}</p>
        )}
      </div>
    </motion.div>
  );
}
