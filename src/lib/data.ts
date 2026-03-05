export interface Customer {
  customerId: string;
  joinDate: Date;
  subscriptionPlan: "Basic" | "Standard" | "Pro";
  monthlyFee: number;
  lastLoginDate: Date;
  totalLogins: number;
  supportTickets: number;
  paymentStatus: "Paid" | "Overdue";
  churnStatus: "Yes" | "No";
  country: string;
}

const COUNTRIES = ["USA", "UK", "India", "Germany", "Canada", "Australia"];
const PLANS: Customer["subscriptionPlan"][] = ["Basic", "Standard", "Pro"];
const PLAN_FEES: Record<string, number> = { Basic: 9.99, Standard: 19.99, Pro: 29.99 };

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() + (max - min + 1)) + min;
  // fix: proper random
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateDataset(count: number = 1000): Customer[] {
  const rand = seededRandom(42);
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const plan = PLANS[Math.floor(rand() * 3)];
    const joinDate = new Date(2022, 0, 1 + Math.floor(rand() * 910)); // ~2.5 years
    const lastLogin = new Date(joinDate.getTime() + Math.floor(rand() * (new Date(2024, 11, 31).getTime() - joinDate.getTime())));
    const totalLogins = Math.floor(rand() * 500) + 5;
    const supportTickets = Math.floor(rand() * 16);
    const isOverdue = rand() < 0.2;
    const paymentStatus: Customer["paymentStatus"] = isOverdue ? "Overdue" : "Paid";

    // Churn logic: higher for Basic, overdue, low logins
    let churnProb = 0.15;
    if (plan === "Basic") churnProb += 0.15;
    if (plan === "Standard") churnProb += 0.05;
    if (isOverdue) churnProb += 0.3;
    if (totalLogins < 50) churnProb += 0.15;
    if (supportTickets > 8) churnProb += 0.1;

    const churned = rand() < Math.min(churnProb, 0.85);

    customers.push({
      customerId: `CUST-${String(i + 1).padStart(4, "0")}`,
      joinDate,
      subscriptionPlan: plan,
      monthlyFee: PLAN_FEES[plan],
      lastLoginDate: lastLogin,
      totalLogins,
      supportTickets,
      paymentStatus,
      churnStatus: churned ? "Yes" : "No",
      country: COUNTRIES[Math.floor(rand() * COUNTRIES.length)],
    });
  }

  return customers;
}

export function calcKPIs(data: Customer[]) {
  const total = data.length;
  const churned = data.filter((c) => c.churnStatus === "Yes").length;
  const retained = total - churned;
  const churnRate = total > 0 ? churned / total : 0;
  const retentionRate = 1 - churnRate;

  // Avg lifetime in months for churned customers
  const churnedCustomers = data.filter((c) => c.churnStatus === "Yes");
  const avgLifetime =
    churnedCustomers.length > 0
      ? churnedCustomers.reduce((sum, c) => {
          const months = (c.lastLoginDate.getTime() - c.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
          return sum + Math.max(months, 1);
        }, 0) / churnedCustomers.length
      : 0;

  // MAU: logged in within last 90 days of dataset (relative)
  const maxDate = new Date(Math.max(...data.map((c) => c.lastLoginDate.getTime())));
  const mauCutoff = new Date(maxDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const mau = data.filter((c) => c.lastLoginDate >= mauCutoff && c.churnStatus === "No").length;

  return { total, churned, retained, churnRate, retentionRate, avgLifetime, mau };
}

export function churnByPlan(data: Customer[]) {
  return PLANS.map((plan) => {
    const planData = data.filter((c) => c.subscriptionPlan === plan);
    const churned = planData.filter((c) => c.churnStatus === "Yes").length;
    return {
      plan,
      total: planData.length,
      churned,
      retained: planData.length - churned,
      churnRate: planData.length > 0 ? churned / planData.length : 0,
    };
  });
}

export function churnByCountry(data: Customer[]) {
  return COUNTRIES.map((country) => {
    const countryData = data.filter((c) => c.country === country);
    const churned = countryData.filter((c) => c.churnStatus === "Yes").length;
    return {
      country,
      total: countryData.length,
      churned,
      retained: countryData.length - churned,
      churnRate: countryData.length > 0 ? churned / countryData.length : 0,
    };
  });
}

export function cohortAnalysis(data: Customer[]) {
  const cohorts: Record<string, { total: number; churned: number }> = {};
  data.forEach((c) => {
    const key = `${c.joinDate.getFullYear()}-${String(c.joinDate.getMonth() + 1).padStart(2, "0")}`;
    if (!cohorts[key]) cohorts[key] = { total: 0, churned: 0 };
    cohorts[key].total++;
    if (c.churnStatus === "Yes") cohorts[key].churned++;
  });

  return Object.entries(cohorts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { total, churned }]) => ({
      month,
      total,
      churned,
      retained: total - churned,
      retentionRate: total > 0 ? (total - churned) / total : 0,
    }));
}

export function funnelData(data: Customer[]) {
  const total = data.length;
  const active = data.filter((c) => c.churnStatus === "No").length;
  const maxDate = new Date(Math.max(...data.map((c) => c.lastLoginDate.getTime())));
  const recentCutoff = new Date(maxDate.getTime() - 60 * 24 * 60 * 60 * 1000);
  const engaged = data.filter((c) => c.churnStatus === "No" && c.lastLoginDate >= recentCutoff).length;
  const loyal = data.filter((c) => c.churnStatus === "No" && c.totalLogins > 200).length;

  return [
    { stage: "Total Customers", value: total, fill: "hsl(var(--chart-blue))" },
    { stage: "Active", value: active, fill: "hsl(var(--chart-cyan))" },
    { stage: "Engaged (60d)", value: engaged, fill: "hsl(var(--chart-green))" },
    { stage: "Loyal (200+ logins)", value: loyal, fill: "hsl(var(--chart-purple))" },
  ];
}
