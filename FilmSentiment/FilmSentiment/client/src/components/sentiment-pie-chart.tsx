import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useLanguage } from "@/lib/language-context";

interface SentimentPieChartProps {
  data: Record<string, string>;
}

const COLORS: Record<string, string> = {
  Positive: "hsl(var(--chart-2))",
  Neutral: "hsl(var(--muted-foreground))",
  Mixed: "hsl(var(--chart-3))",
  Negative: "hsl(var(--destructive))",
};

export function SentimentPieChart({ data }: SentimentPieChartProps) {
  const { t } = useLanguage();

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  return (
    <Card className="p-6" data-testid="chart-sentiment-distribution">
      <h3 className="text-base font-semibold mb-6">{t("sentimentDistribution")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "hsl(var(--chart-1))"} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
