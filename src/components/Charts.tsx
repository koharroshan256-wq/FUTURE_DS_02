import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, FunnelChart, Funnel, LabelList,
} from "recharts";

interface ChurnByPlanChartProps {
  data: { plan: string; churned: number; retained: number; churnRate: number }[];
}

export function ChurnByPlanChart({ data }: ChurnByPlanChartProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Churn by Subscription Plan</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="plan" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Legend />
          <Bar dataKey="retained" name="Retained" fill="hsl(var(--chart-green))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="churned" name="Churned" fill="hsl(var(--chart-red))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ChurnPieChartProps {
  churned: number;
  retained: number;
}

export function ChurnPieChart({ churned, retained }: ChurnPieChartProps) {
  const data = [
    { name: "Retained", value: retained },
    { name: "Churned", value: churned },
  ];
  const COLORS = ["hsl(var(--chart-green))", "hsl(var(--chart-red))"];

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Customer Churn Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RetentionLineChartProps {
  data: { month: string; retentionRate: number; total: number }[];
}

export function RetentionLineChart({ data }: RetentionLineChartProps) {
  const formatted = data.map((d) => ({ ...d, retention: +(d.retentionRate * 100).toFixed(1) }));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Retention Trend by Cohort Month</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-45} textAnchor="end" height={60} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Line type="monotone" dataKey="retention" name="Retention %" stroke="hsl(var(--chart-blue))" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ChurnByCountryChartProps {
  data: { country: string; churned: number; retained: number; churnRate: number }[];
}

export function ChurnByCountryChart({ data }: ChurnByCountryChartProps) {
  const formatted = data.map((d) => ({ ...d, churnPct: +(d.churnRate * 100).toFixed(1) }));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Churn Rate by Country</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" unit="%" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="country" type="category" width={70} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Bar dataKey="churnPct" name="Churn %" fill="hsl(var(--chart-amber))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FunnelChartDisplayProps {
  data: { stage: string; value: number; fill: string }[];
}

export function FunnelChartDisplay({ data }: FunnelChartDisplayProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Customer Engagement Funnel</h3>
      <ResponsiveContainer width="100%" height={280}>
        <FunnelChart>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="center" fill="hsl(var(--primary-foreground))" fontSize={12} fontWeight={600} dataKey="stage" />
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
