import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface SentimentDonutChartProps {
  data: { name: string; value: number; percentage: string }[];
}

const COLORS = {
  Positive: 'hsl(var(--chart-1))',
  Negative: 'hsl(var(--chart-5))',
  Neutral: 'hsl(var(--chart-4))',
  Mixed: 'hsl(var(--chart-2))',
};

export function SentimentDonutChart({ data }: SentimentDonutChartProps) {
  const { t, language } = useLanguage();

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6">
      <h3 className="text-lg font-semibold mb-4">{t('toneDistribution')}</h3>
      <div className="h-[280px]" data-testid="donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS] || 'hsl(var(--chart-3))'}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-xl backdrop-blur-xl">
                      <div className="text-sm font-medium">{payload[0].name}</div>
                      <div className="text-xs text-muted-foreground">
                        {payload[0].payload.percentage}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
