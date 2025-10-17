import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface SentimentBarChartProps {
  data: { tone: string; count: number }[];
}

const COLORS = {
  Positive: 'hsl(var(--chart-1))',
  Negative: 'hsl(var(--chart-5))',
  Neutral: 'hsl(var(--chart-4))',
  Mixed: 'hsl(var(--chart-2))',
};

export function SentimentBarChart({ data }: SentimentBarChartProps) {
  const { t, language } = useLanguage();

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6">
      <h3 className="text-lg font-semibold mb-4">{t('toneCounts')}</h3>
      <div className="h-[280px]" data-testid="bar-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={language === 'ar' ? 'horizontal' : 'vertical'}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="category"
              dataKey="tone"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-xl backdrop-blur-xl">
                      <div className="text-sm font-medium">{payload[0].payload.tone}</div>
                      <div className="text-xs text-muted-foreground">
                        Count: {payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.tone as keyof typeof COLORS] || 'hsl(var(--chart-3))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
