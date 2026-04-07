import { Card } from "@/components/ui/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}

export function StatsCard({ title, value, subtitle, highlight }: StatsCardProps) {
  return (
    <Card
      className={highlight ? "border-indigo-200 bg-indigo-50" : ""}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          highlight ? "text-indigo-700" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </Card>
  );
}
