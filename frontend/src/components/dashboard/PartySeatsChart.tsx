import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { parties } from "@/data/mockData";

export function PartySeatsChart() {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = parties.reduce((sum, p) => sum + p.seats, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="glass-panel p-3 text-sm">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p style={{ color: payload[0].payload.color }}>
            {payload[0].value} seats ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="stat-card"
    >
      <h3 className="section-title">Party Seat Distribution</h3>
      <p className="section-subtitle">Federal Parliament 2079</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={parties}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40}
              dataKey="seats"
              nameKey="shortName"
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {parties.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value, entry: any) => (
                <span className="text-foreground text-xs">
                  {value} ({entry.payload.seats})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
