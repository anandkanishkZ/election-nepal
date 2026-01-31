import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TrendComparisonChartProps {
  data: Array<{
    period: string;
    [key: string]: any;
  }>;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  title: string;
  description?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  delay?: number;
}

export function TrendComparisonChart({ 
  data, 
  lines, 
  title, 
  description = "Trend analysis over time",
  xAxisLabel = "Period",
  yAxisLabel = "Value",
  delay = 0 
}: TrendComparisonChartProps) {
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="stat-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                {lines.map((line) => (
                  <Line 
                    key={line.dataKey}
                    type="monotone"
                    dataKey={line.dataKey}
                    name={line.name}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{ fill: line.color, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
