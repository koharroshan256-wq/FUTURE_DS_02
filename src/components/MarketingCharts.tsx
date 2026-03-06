import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, Cell, LabelList, LineChart, Line, Legend,
} from "recharts";
import type { FunnelStage, StageConversion, ChannelPerformance } from "@/lib/marketingData";

export function MarketingFunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Marketing Funnel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="center" fill="hsl(var(--primary-foreground))" fontSize={11} fontWeight={600} dataKey="stage" />
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionTable({ data }: { data: StageConversion[] }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Conversion Rate & Drop-off Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Stage Transition</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">From</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">To</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Conv. Rate</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">Drop-off</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-medium text-card-foreground">{row.from} → {row.to}</td>
                <td className="py-2.5 px-3 text-right text-muted-foreground">{row.fromValue.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right text-muted-foreground">{row.toValue.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-[hsl(var(--chart-green))]">
                  {(row.conversionRate * 100).toFixed(1)}%
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-[hsl(var(--chart-red))]">
                  {(row.dropOff * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ChannelComparisonChart({ data }: { data: ChannelPerformance[] }) {
  const formatted = data.map((d) => ({
    channel: d.channel.replace(" ", "\n"),
    conversionRate: +(d.overallConversion * 100).toFixed(2),
    customers: d.customers,
  }));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Channel Conversion Rates</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="channel" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis unit="%" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
          <Bar dataKey="conversionRate" name="Conversion %" fill="hsl(var(--chart-purple))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DropOffChart({ data }: { data: StageConversion[] }) {
  const formatted = data.map((d) => ({
    transition: `${d.from}→${d.to}`,
    dropOff: +(d.dropOff * 100).toFixed(1),
  }));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Drop-off % by Stage</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" unit="%" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis dataKey="transition" type="category" width={110} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
          <Bar dataKey="dropOff" name="Drop-off %" fill="hsl(var(--chart-red))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyTrendChart({ data }: { data: { month: string; conversionRate: number; leadRate: number }[] }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly Conversion Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis unit="%" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
          <Legend />
          <Line type="monotone" dataKey="leadRate" name="Lead Rate %" stroke="hsl(var(--chart-cyan))" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="conversionRate" name="Conversion %" stroke="hsl(var(--chart-purple))" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChannelSpendChart({ data }: { data: ChannelPerformance[] }) {
  const formatted = data.map((d) => ({
    channel: d.channel,
    cpl: +d.cpl.toFixed(2),
    cpc: +d.cpc.toFixed(2),
  }));

  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Cost Per Lead vs Cost Per Customer</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="channel" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis unit="$" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
          <Legend />
          <Bar dataKey="cpl" name="Cost/Lead" fill="hsl(var(--chart-cyan))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cpc" name="Cost/Customer" fill="hsl(var(--chart-amber))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
