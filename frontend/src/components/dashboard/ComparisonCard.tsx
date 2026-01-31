import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

interface ComparisonCardProps {
  title: string;
  regions: Array<{
    name: string;
    value: number;
    subtitle?: string;
    color?: string;
  }>;
  unit?: string;
  delay?: number;
}

export function ComparisonCard({ title, regions, unit = "", delay = 0 }: ComparisonCardProps) {
  // Find max value for comparison
  const maxValue = Math.max(...regions.map(r => r.value));
  
  // Sort regions by value
  const sortedRegions = [...regions].sort((a, b) => b.value - a.value);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="stat-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>Comparative analysis across regions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedRegions.map((region, index) => {
            const percentage = (region.value / maxValue) * 100;
            const isMax = region.value === maxValue;
            const prevValue = index > 0 ? sortedRegions[index - 1].value : region.value;
            const diff = prevValue - region.value;
            
            return (
              <div key={region.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{region.name}</span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {region.value.toLocaleString()} {unit}
                    </span>
                    {index > 0 && diff > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ArrowDownIcon className="w-3 h-3" />
                        {diff.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {region.subtitle && (
                  <p className="text-xs text-muted-foreground">{region.subtitle}</p>
                )}
                
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: delay + 0.1 * index }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ 
                      backgroundColor: region.color || 'hsl(var(--primary))',
                      opacity: isMax ? 1 : 0.7 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
