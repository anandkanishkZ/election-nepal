import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ProvinceChartProps {
  data?: Array<{ district_name: string; count: number }>;
  loading?: boolean;
}

const COLORS = ["#C41E3A", "#1565C0", "#F9A825", "#2E7D32", "#7B1FA2", "#E65100", "#00838F", "#D32F2F", "#512DA8", "#00796B"];

export function ProvinceChart({ data: propData, loading = false }: ProvinceChartProps) {
  // Use prop data if available
  const data = propData && propData.length > 0
    ? propData.slice(0, 10).map((d, index) => ({
        name: d.district_name,
        voters: d.count,
        color: COLORS[index % COLORS.length],
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 text-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">{payload[0].value.toLocaleString()} voters</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="stat-card">
        <h3 className="section-title">Top Districts by Voter Count</h3>
        <p className="section-subtitle">Registered voters by district (Top 10)</p>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="stat-card">
        <h3 className="section-title">Top Districts by Voter Count</h3>
        <p className="section-subtitle">Registered voters by district (Top 10)</p>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="stat-card"
    >
      <h3 className="section-title">Top Districts by Voter Count</h3>
      <p className="section-subtitle">Registered voters by district (Top 10)</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="voters" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
