import { Users, Target, UserCheck, TrendingUp, Award, AlertTriangle, DollarSign, Coins } from "lucide-react";
import { KPICard } from "@/components/KPICards";

interface MarketingKPIGridProps {
  totalVisitors: number;
  totalLeads: number;
  totalCustomers: number;
  overallConversion: number;
  bestChannel: string;
  highestDropOff: string;
  cpl: number;
  cpc: number;
}

export function MarketingKPIGrid({
  totalVisitors, totalLeads, totalCustomers, overallConversion,
  bestChannel, highestDropOff, cpl, cpc,
}: MarketingKPIGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Visitors"
        value={totalVisitors.toLocaleString()}
        subtitle="12-month total"
        icon={<Users className="h-5 w-5" />}
        accent="blue"
      />
      <KPICard
        title="Total Leads"
        value={totalLeads.toLocaleString()}
        subtitle={`CPL: $${cpl.toFixed(2)}`}
        icon={<Target className="h-5 w-5" />}
        accent="green"
      />
      <KPICard
        title="Total Customers"
        value={totalCustomers.toLocaleString()}
        subtitle={`CPC: $${cpc.toFixed(2)}`}
        icon={<UserCheck className="h-5 w-5" />}
        accent="amber"
      />
      <KPICard
        title="Overall Conversion"
        value={`${(overallConversion * 100).toFixed(2)}%`}
        subtitle="Visitors → Customers"
        trend={overallConversion > 0.01 ? "up" : "down"}
        icon={<TrendingUp className="h-5 w-5" />}
        accent="blue"
      />
    </div>
  );
}
