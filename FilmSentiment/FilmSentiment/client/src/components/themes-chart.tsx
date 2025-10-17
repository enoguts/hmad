import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/lib/language-context";

interface ThemesChartProps {
  themes: [string, number][];
  onThemeClick?: (theme: string) => void;
}

export function ThemesChart({ themes, onThemeClick }: ThemesChartProps) {
  const { t } = useLanguage();

  const data = themes.map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <Card className="p-6" data-testid="chart-top-themes">
      <h3 className="text-base font-semibold mb-6">{t("topThemes")}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 12 }} 
            width={90}
          />
          <Tooltip />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--chart-1))" 
            radius={[0, 4, 4, 0]}
            onClick={(data) => onThemeClick && onThemeClick(data.name)}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
