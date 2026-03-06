import { useMemo, useState } from "react";
import { generateDataset, calcKPIs, churnByPlan, churnByCountry, cohortAnalysis, funnelData } from "@/lib/data";
import { KPIGrid } from "@/components/KPICards";
import { ChurnByPlanChart, ChurnPieChart, RetentionLineChart, ChurnByCountryChart, FunnelChartDisplay } from "@/components/Charts";
import { DashboardFilters } from "@/components/DashboardFilters";
import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const allData = generateDataset(1000);

const Index = () => {
  const [planFilter, setPlanFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  const filtered = useMemo(() => {
    return allData.filter((c) => {
      if (planFilter !== "All" && c.subscriptionPlan !== planFilter) return false;
      if (countryFilter !== "All" && c.country !== countryFilter) return false;
      return true;
    });
  }, [planFilter, countryFilter]);

  const kpis = useMemo(() => calcKPIs(filtered), [filtered]);
  const planData = useMemo(() => churnByPlan(filtered), [filtered]);
  const countryData = useMemo(() => churnByCountry(filtered), [filtered]);
  const cohortData = useMemo(() => cohortAnalysis(filtered), [filtered]);
  const funnel = useMemo(() => funnelData(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-[hsl(var(--chart-blue))] to-[hsl(var(--chart-purple))] p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground tracking-tight">Customer Retention & Churn Analysis</h1>
              <p className="text-xs text-muted-foreground">Subscription Business Dashboard • 1,000 Customers</p>
            </div>
          </div>
          <DashboardFilters
            selectedPlan={planFilter}
            selectedCountry={countryFilter}
            onPlanChange={setPlanFilter}
            onCountryChange={setCountryFilter}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPIs */}
        <KPIGrid
          total={kpis.total}
          retentionRate={kpis.retentionRate}
          churnRate={kpis.churnRate}
          avgLifetime={kpis.avgLifetime}
          mau={kpis.mau}
          churned={kpis.churned}
        />

        {/* Row 1: Plan bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChurnByPlanChart data={planData} />
          </div>
          <ChurnPieChart churned={kpis.churned} retained={kpis.retained} />
        </div>

        {/* Row 2: Retention line + Country bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetentionLineChart data={cohortData} />
          <ChurnByCountryChart data={countryData} />
        </div>

        {/* Row 3: Funnel + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChartDisplay data={funnel} />
          <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Key Insights & Recommendations</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <Insight emoji="🔴" text="Basic plan shows highest churn — consider onboarding improvements and upgrade incentives." />
              <Insight emoji="💳" text="Overdue payments strongly correlate with churn — implement proactive payment reminders." />
              <Insight emoji="📉" text="Customers with <50 logins have 2x higher churn — build engagement campaigns for low-activity users." />
              <Insight emoji="🎯" text="High support tickets (>8) indicate frustration — prioritize ticket resolution for at-risk users." />
              <Insight emoji="🌍" text="Regional churn differences suggest localization and market-specific strategies are needed." />
              <Insight emoji="🏆" text="Pro plan retains best — upsell path from Basic→Standard→Pro reduces lifetime churn risk." />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Internship Project — Customer Retention & Churn Analysis • Sample Data (1,000 rows)
        </p>
      </footer>
    </div>
  );
};

function Insight({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
      <span className="text-base">{emoji}</span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

export default Index;
