import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  testId?: string;
}

export function KPICard({ title, value, icon: Icon, trend, trendValue, testId }: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-chart-3' : trend === 'down' ? 'text-chart-5' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="relative overflow-hidden backdrop-blur-xl bg-card/40 border-card-border hover-elevate"
        data-testid={testId}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight" data-testid={`${testId}-value`}>
                  {value}
                </h3>
                {trend && trendValue && (
                  <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">{trendValue}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-chart-2/50" />
      </Card>
    </motion.div>
  );
}
