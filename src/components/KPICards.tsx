import { TrendingUp, TrendingDown, Users, UserCheck, Clock, Activity } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  accent?: "blue" | "green" | "red" | "amber";
}

const accentMap = {
  blue: "from-[hsl(var(--chart-blue))] to-[hsl(221,83%,63%)]",
  green: "from-[hsl(var(--chart-green))] to-[hsl(142,71%,55%)]",
  red: "from-[hsl(var(--chart-red))] to-[hsl(0,84%,70%)]",
  amber: "from-[hsl(var(--chart-amber))] to-[hsl(38,92%,60%)]",
};

const iconBgMap = {
  blue: "bg-[hsl(var(--chart-blue)/0.1)]",
  green: "bg-[hsl(var(--chart-green)/0.1)]",
  red: "bg-[hsl(var(--chart-red)/0.1)]",
  amber: "bg-[hsl(var(--chart-amber)/0.1)]",
};

const iconColorMap = {
  blue: "text-[hsl(var(--chart-blue))]",
  green: "text-[hsl(var(--chart-green))]",
  red: "text-[hsl(var(--chart-red))]",
  amber: "text-[hsl(var(--chart-amber))]",
};

export function KPICard({ title, value, subtitle, trend, icon, accent = "blue" }: KPICardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentMap[accent]}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {subtitle && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {trend === "up" && <TrendingUp className="h-3 w-3 text-[hsl(var(--chart-green))]" />}
              {trend === "down" && <TrendingDown className="h-3 w-3 text-[hsl(var(--chart-red))]" />}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconBgMap[accent]}`}>
          <div className={iconColorMap[accent]}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface KPIGridProps {
  total: number;
  retentionRate: number;
  churnRate: number;
  avgLifetime: number;
  mau: number;
  churned: number;
}

export function KPIGrid({ total, retentionRate, churnRate, avgLifetime, mau, churned }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KPICard
        title="Total Customers"
        value={total.toLocaleString()}
        subtitle={`${churned} churned`}
        icon={<Users className="h-5 w-5" />}
        accent="blue"
      />
      <KPICard
        title="Retention Rate"
        value={`${(retentionRate * 100).toFixed(1)}%`}
        subtitle="Target: >85%"
        trend={retentionRate > 0.85 ? "up" : "down"}
        icon={<UserCheck className="h-5 w-5" />}
        accent="green"
      />
      <KPICard
        title="Churn Rate"
        value={`${(churnRate * 100).toFixed(1)}%`}
        subtitle="Lower is better"
        trend={churnRate < 0.15 ? "up" : "down"}
        icon={<TrendingDown className="h-5 w-5" />}
        accent="red"
      />
      <KPICard
        title="Avg. Lifetime"
        value={`${avgLifetime.toFixed(1)} mo`}
        subtitle="Churned customers"
        icon={<Clock className="h-5 w-5" />}
        accent="amber"
      />
      <KPICard
        title="Monthly Active Users"
        value={mau.toLocaleString()}
        subtitle="Last 30 days"
        icon={<Activity className="h-5 w-5" />}
        accent="blue"
      />
    </div>
  );
}
