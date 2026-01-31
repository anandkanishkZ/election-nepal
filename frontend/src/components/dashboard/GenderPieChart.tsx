import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface GenderPieChartProps {
  data?: Array<{ gender: string; count: number }>;
  loading?: boolean;
}

export function GenderPieChart({ data: propData, loading = false }: GenderPieChartProps) {
  // Calculate total for percentage
  const maleCount = propData?.find(d => d.gender === "पुरुष")?.count || 0;
  const femaleCount = propData?.find(d => d.gender === "महिला")?.count || 0;
  const total = maleCount + femaleCount;

  const data = [
    { name: "Male (पुरुष)", value: maleCount, color: "hsl(var(--secondary))" },
    { name: "Female (महिला)", value: femaleCount, color: "hsl(var(--primary))" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="glass-panel p-3 text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.color }}>
            {payload[0].value.toLocaleString()} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="stat-card">
        <h3 className="section-title">Gender Distribution</h3>
        <p className="section-subtitle">Male vs Female voter ratio</p>
        <div className="h-[280px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="stat-card">
        <h3 className="section-title">Gender Distribution</h3>
        <p className="section-subtitle">Male vs Female voter ratio</p>
        <div className="h-[280px] flex items-center justify-center">
          <div className="text-muted-foreground">No data available</div>
        </div>
      </div>
    );
  }

  const genderRatio = femaleCount > 0 ? (maleCount / femaleCount).toFixed(3) : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="stat-card"
    >
      <h3 className="section-title">Gender Distribution</h3>
      <p className="section-subtitle">Male vs Female voter ratio</p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={60}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm text-muted-foreground">
          Gender Ratio: <span className="font-semibold text-foreground">{genderRatio}</span> (M:F)
        </p>
      </div>
    </motion.div>
  );
}
