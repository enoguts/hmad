import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  testId?: string;
}

export function KpiCard({ title, value, icon: Icon, testId }: KpiCardProps) {
  return (
    <Card className="p-6" data-testid={testId}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-2xl font-semibold" data-testid={`${testId}-value`}>
            {value}
          </p>
        </div>
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
