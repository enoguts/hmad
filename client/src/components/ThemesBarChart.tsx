import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThemesBarChartProps {
  data: { theme: string; count: number }[];
  onThemeClick?: (theme: string) => void;
}

export function ThemesBarChart({ data, onThemeClick }: ThemesBarChartProps) {
  const { t, language } = useLanguage();

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6">
      <h3 className="text-lg font-semibold mb-4">{t('topThemes')}</h3>
      <div className="h-[300px]" data-testid="themes-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 5, right: language === 'ar' ? 5 : 30, left: language === 'ar' ? 30 : 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="theme"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              width={language === 'ar' ? 120 : 150}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-3 shadow-xl backdrop-blur-xl">
                      <div className="text-sm font-medium">{payload[0].payload.theme}</div>
                      <div className="text-xs text-muted-foreground">
                        Count: {payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={(data) => onThemeClick && onThemeClick(data.theme)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
