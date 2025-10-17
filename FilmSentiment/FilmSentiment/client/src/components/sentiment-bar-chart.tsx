import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "@/lib/language-context";

interface SentimentBarChartProps {
  positive: number;
  neutral: number;
  mixed: number;
  negative: number;
}

export function SentimentBarChart({ positive, neutral, mixed, negative }: SentimentBarChartProps) {
  const { t } = useLanguage();

  const data = [
    { name: t("positive"), value: positive, fill: "hsl(var(--chart-2))" },
    { name: t("neutral"), value: neutral, fill: "hsl(var(--muted-foreground))" },
    { name: t("mixed"), value: mixed, fill: "hsl(var(--chart-3))" },
    { name: t("negative"), value: negative, fill: "hsl(var(--destructive))" },
  ];

  return (
    <Card className="p-6" data-testid="chart-sentiment-counts">
      <h3 className="text-base font-semibold mb-6">{t("sentimentCounts")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
