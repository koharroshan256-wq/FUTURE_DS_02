import { useMemo, useState } from "react";
import {
  generateMarketingDataset, calcMarketingKPIs, funnelStages,
  stageConversions, channelPerformance, monthlyTrend,
} from "@/lib/marketingData";
import { MarketingKPIGrid } from "@/components/MarketingKPICards";
import {
  MarketingFunnelChart, ConversionTable, ChannelComparisonChart,
  MonthlyTrendChart, ChannelSpendChart, DropOffChart,
} from "@/components/MarketingCharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const allData = generateMarketingDataset(12);
const ALL_CHANNELS = ["All", "Social Media", "Google Ads", "Email Marketing", "Organic Search", "Referral"];

const MarketingFunnel = () => {
  const [channelFilter, setChannelFilter] = useState("All");

  const filtered = useMemo(() => {
    if (channelFilter === "All") return allData;
    return allData.filter((r) => r.channel === channelFilter);
  }, [channelFilter]);

  const kpis = useMemo(() => calcMarketingKPIs(filtered), [filtered]);
  const funnel = useMemo(() => funnelStages(filtered), [filtered]);
  const conversions = useMemo(() => stageConversions(filtered), [filtered]);
  const channels = useMemo(() => channelPerformance(allData), []);
  const trend = useMemo(() => monthlyTrend(filtered), [filtered]);

  // Best channel by overall conversion
  const bestChannel = channels.reduce((a, b) => (a.overallConversion > b.overallConversion ? a : b));
  // Highest drop-off stage
  const worstStage = conversions.reduce((a, b) => (a.dropOff > b.dropOff ? a : b));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-[hsl(var(--chart-purple))] to-[hsl(var(--chart-cyan))] p-2">
              <Megaphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground tracking-tight">Marketing Funnel & Conversion Analysis</h1>
              <p className="text-xs text-muted-foreground">
                12-Month Performance Dashboard •{" "}
                <Link to="/" className="underline hover:text-foreground transition-colors">← Churn Dashboard</Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Channel:</span>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_CHANNELS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <MarketingKPIGrid
          totalVisitors={kpis.totalVisitors}
          totalLeads={kpis.totalLeads}
          totalCustomers={kpis.totalCustomers}
          overallConversion={kpis.overallConversion}
          bestChannel={bestChannel.channel}
          highestDropOff={`${worstStage.from} → ${worstStage.to}`}
          cpl={kpis.cpl}
          cpc={kpis.cpc}
        />

        {/* Funnel + Conversion Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketingFunnelChart data={funnel} />
          <ConversionTable data={conversions} />
        </div>

        {/* Channel comparison + Drop-off */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChannelComparisonChart data={channels} />
          <DropOffChart data={conversions} />
        </div>

        {/* Monthly trend + Spend efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyTrendChart data={trend} />
          <ChannelSpendChart data={channels} />
        </div>

        {/* Insights */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">📊 Business Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <Insight emoji="🏆" text={`${bestChannel.channel} has the highest conversion rate (${(bestChannel.overallConversion * 100).toFixed(2)}%) — increase budget allocation here.`} />
            <Insight emoji="🔴" text={`Biggest drop-off: ${worstStage.from} → ${worstStage.to} (${(worstStage.dropOff * 100).toFixed(1)}% lost) — focus on improving this stage.`} />
            <Insight emoji="💰" text={`Referral channel typically has the lowest CPL — invest in referral programs for cost-efficient lead generation.`} />
            <Insight emoji="📧" text="Email Marketing shows strong MQL→SQL conversion — leverage nurture sequences and personalized content." />
            <Insight emoji="📉" text="Social Media has high visitor volume but low conversion — optimize landing pages and targeting." />
            <Insight emoji="🎯" text="Improve lead scoring between MQL and SQL stages to reduce funnel leakage and boost sales efficiency." />
            <Insight emoji="📈" text="Track monthly conversion trends to identify seasonal patterns and optimize campaign timing." />
            <Insight emoji="🔄" text="Implement A/B testing on top-of-funnel campaigns to improve visitor-to-lead conversion rates." />
          </div>
        </div>

        {/* Excel Guide */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">📋 Excel / Google Sheets Analysis Guide</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <GuideSection title="1. Conversion Rate Formulas" items={[
              "Visitor → Lead: =Leads/Visitors",
              "Lead → MQL: =MQL/Leads",
              "MQL → SQL: =SQL/MQL",
              "SQL → Customer: =Customers/SQL",
              "Overall: =Customers/Visitors",
            ]} />
            <GuideSection title="2. Drop-off % Formula" items={[
              "=(Previous Stage - Current Stage) / Previous Stage",
              "Example: =(Visitors-Leads)/Visitors",
            ]} />
            <GuideSection title="3. Cost Metrics" items={[
              "Cost Per Lead (CPL): =Marketing_Spend/Leads",
              "Cost Per Customer (CPC): =Marketing_Spend/Customers",
              "Use SUMIFS to calculate per channel",
            ]} />
            <GuideSection title="4. Best Channel" items={[
              "Create a Pivot Table with Channel as Rows",
              "Add SUM of Visitors, Leads, Customers",
              "Add calculated field: Conversion = Customers/Visitors",
              "Sort by conversion rate descending",
            ]} />
            <GuideSection title="5. Funnel Leakage" items={[
              "Calculate drop-off % for each stage transition",
              "The stage with highest drop-off = biggest leakage",
              "Use conditional formatting to highlight >70% drop-off",
            ]} />
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Internship Project — Marketing Funnel & Conversion Performance Analysis • Sample Data (12 months × 5 channels)
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

function GuideSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-semibold text-card-foreground mb-1">{title}</p>
      <ul className="list-disc list-inside space-y-0.5 ml-2">
        {items.map((item, i) => <li key={i} className="font-mono text-xs">{item}</li>)}
      </ul>
    </div>
  );
}

export default MarketingFunnel;
