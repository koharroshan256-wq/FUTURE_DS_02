import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardFiltersProps {
  selectedPlan: string;
  selectedCountry: string;
  onPlanChange: (value: string) => void;
  onCountryChange: (value: string) => void;
}

const PLANS = ["All", "Basic", "Standard", "Pro"];
const COUNTRIES = ["All", "USA", "UK", "India", "Germany", "Canada", "Australia"];

export function DashboardFilters({ selectedPlan, selectedCountry, onPlanChange, onCountryChange }: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Plan:</span>
        <Select value={selectedPlan} onValueChange={onPlanChange}>
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLANS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Country:</span>
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
