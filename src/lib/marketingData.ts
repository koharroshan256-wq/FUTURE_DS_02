export interface MarketingRow {
  date: string;
  channel: MarketingChannel;
  campaign: string;
  visitors: number;
  leads: number;
  mql: number;
  sql: number;
  customers: number;
  spend: number;
}

export type MarketingChannel = "Social Media" | "Google Ads" | "Email Marketing" | "Organic Search" | "Referral";

const CHANNELS: MarketingChannel[] = ["Social Media", "Google Ads", "Email Marketing", "Organic Search", "Referral"];

const CAMPAIGNS: Record<MarketingChannel, string[]> = {
  "Social Media": ["Summer Splash", "Brand Buzz", "Viral Push", "Influencer Collab"],
  "Google Ads": ["Search Max", "Display Reach", "Shopping Boost", "Retarget Pro"],
  "Email Marketing": ["Welcome Series", "Re-engage", "Newsletter Blast", "Flash Sale"],
  "Organic Search": ["SEO Sprint", "Content Hub", "Blog Blitz", "Authority Build"],
  "Referral": ["Refer-a-Friend", "Partner Program", "Affiliate Wave", "Loyalty Bonus"],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Conversion rates per channel (visitors→leads, leads→mql, mql→sql, sql→customers)
const CHANNEL_RATES: Record<MarketingChannel, [number, number, number, number]> = {
  "Google Ads":       [0.08, 0.45, 0.35, 0.25],
  "Email Marketing":  [0.12, 0.55, 0.40, 0.30],
  "Social Media":     [0.05, 0.30, 0.25, 0.18],
  "Organic Search":   [0.10, 0.50, 0.38, 0.28],
  "Referral":         [0.14, 0.60, 0.42, 0.35],
};

const SPEND_PER_VISITOR: Record<MarketingChannel, number> = {
  "Social Media": 0.35,
  "Google Ads": 0.80,
  "Email Marketing": 0.15,
  "Organic Search": 0.05,
  "Referral": 0.20,
};

export function generateMarketingDataset(months = 12): MarketingRow[] {
  const rand = seededRandom(99);
  const rows: MarketingRow[] = [];

  for (let m = 0; m < months; m++) {
    const year = 2024;
    const month = m; // 0-11
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}`;

    for (const channel of CHANNELS) {
      const campaigns = CAMPAIGNS[channel];
      const campaign = campaigns[Math.floor(rand() * campaigns.length)];
      const rates = CHANNEL_RATES[channel];

      const baseVisitors = 800 + Math.floor(rand() * 4200);
      const noise = () => 0.85 + rand() * 0.3;

      const visitors = baseVisitors;
      const leads = Math.max(1, Math.floor(visitors * rates[0] * noise()));
      const mql = Math.max(1, Math.floor(leads * rates[1] * noise()));
      const sql = Math.max(1, Math.floor(mql * rates[2] * noise()));
      const customers = Math.max(1, Math.floor(sql * rates[3] * noise()));
      const spend = Math.round(visitors * SPEND_PER_VISITOR[channel] * noise());

      rows.push({ date: dateStr, channel, campaign, visitors, leads, mql, sql, customers, spend });
    }
  }

  return rows;
}

export interface FunnelStage {
  stage: string;
  value: number;
  fill: string;
}

export interface ChannelPerformance {
  channel: MarketingChannel;
  visitors: number;
  leads: number;
  mql: number;
  sql: number;
  customers: number;
  spend: number;
  cpl: number;
  cpc: number;
  overallConversion: number;
}

export interface StageConversion {
  from: string;
  to: string;
  fromValue: number;
  toValue: number;
  conversionRate: number;
  dropOff: number;
}

export function calcMarketingKPIs(data: MarketingRow[]) {
  const totalVisitors = data.reduce((s, r) => s + r.visitors, 0);
  const totalLeads = data.reduce((s, r) => s + r.leads, 0);
  const totalMQL = data.reduce((s, r) => s + r.mql, 0);
  const totalSQL = data.reduce((s, r) => s + r.sql, 0);
  const totalCustomers = data.reduce((s, r) => s + r.customers, 0);
  const totalSpend = data.reduce((s, r) => s + r.spend, 0);
  const overallConversion = totalVisitors > 0 ? totalCustomers / totalVisitors : 0;
  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const cpc = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

  return { totalVisitors, totalLeads, totalMQL, totalSQL, totalCustomers, totalSpend, overallConversion, cpl, cpc };
}

export function funnelStages(data: MarketingRow[]): FunnelStage[] {
  const kpis = calcMarketingKPIs(data);
  return [
    { stage: "Website Visitors", value: kpis.totalVisitors, fill: "hsl(var(--chart-blue))" },
    { stage: "Leads", value: kpis.totalLeads, fill: "hsl(var(--chart-cyan))" },
    { stage: "MQL", value: kpis.totalMQL, fill: "hsl(var(--chart-green))" },
    { stage: "SQL", value: kpis.totalSQL, fill: "hsl(var(--chart-amber))" },
    { stage: "Customers", value: kpis.totalCustomers, fill: "hsl(var(--chart-purple))" },
  ];
}

export function stageConversions(data: MarketingRow[]): StageConversion[] {
  const kpis = calcMarketingKPIs(data);
  const stages = [
    { name: "Visitors", value: kpis.totalVisitors },
    { name: "Leads", value: kpis.totalLeads },
    { name: "MQL", value: kpis.totalMQL },
    { name: "SQL", value: kpis.totalSQL },
    { name: "Customers", value: kpis.totalCustomers },
  ];

  const result: StageConversion[] = [];
  for (let i = 0; i < stages.length - 1; i++) {
    const fromVal = stages[i].value;
    const toVal = stages[i + 1].value;
    result.push({
      from: stages[i].name,
      to: stages[i + 1].name,
      fromValue: fromVal,
      toValue: toVal,
      conversionRate: fromVal > 0 ? toVal / fromVal : 0,
      dropOff: fromVal > 0 ? (fromVal - toVal) / fromVal : 0,
    });
  }
  return result;
}

export function channelPerformance(data: MarketingRow[]): ChannelPerformance[] {
  return CHANNELS.map((ch) => {
    const chData = data.filter((r) => r.channel === ch);
    const visitors = chData.reduce((s, r) => s + r.visitors, 0);
    const leads = chData.reduce((s, r) => s + r.leads, 0);
    const mql = chData.reduce((s, r) => s + r.mql, 0);
    const sql = chData.reduce((s, r) => s + r.sql, 0);
    const customers = chData.reduce((s, r) => s + r.customers, 0);
    const spend = chData.reduce((s, r) => s + r.spend, 0);
    return {
      channel: ch,
      visitors, leads, mql, sql, customers, spend,
      cpl: leads > 0 ? spend / leads : 0,
      cpc: customers > 0 ? spend / customers : 0,
      overallConversion: visitors > 0 ? customers / visitors : 0,
    };
  });
}

export function monthlyTrend(data: MarketingRow[]) {
  const months = [...new Set(data.map((r) => r.date))].sort();
  return months.map((m) => {
    const mData = data.filter((r) => r.date === m);
    const visitors = mData.reduce((s, r) => s + r.visitors, 0);
    const leads = mData.reduce((s, r) => s + r.leads, 0);
    const customers = mData.reduce((s, r) => s + r.customers, 0);
    return {
      month: m,
      visitors,
      leads,
      customers,
      conversionRate: visitors > 0 ? +(customers / visitors * 100).toFixed(2) : 0,
      leadRate: visitors > 0 ? +(leads / visitors * 100).toFixed(2) : 0,
    };
  });
}
