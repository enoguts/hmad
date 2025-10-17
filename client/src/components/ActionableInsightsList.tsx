import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileJson } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface ActionableInsightsListProps {
  insights: string[];
}

export function ActionableInsightsList({ insights }: ActionableInsightsListProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const { t } = useLanguage();

  const toggleInsight = (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompleted(newCompleted);
  };

  const exportToCSV = () => {
    window.open('/api/export/insights/csv', '_blank');
  };

  const exportToJSON = () => {
    window.open('/api/export/insights/json', '_blank');
  };

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6" data-testid="insights-list">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{t('actionableInsightsList')}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            data-testid="button-export-csv"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('exportCSV')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            data-testid="button-export-json"
          >
            <FileJson className="h-4 w-4 mr-2" />
            {t('exportJSON')}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('noInsights')}
          </div>
        ) : (
          insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/20 hover-elevate transition-all"
              data-testid={`insight-${index}`}
            >
              <Checkbox
                checked={completed.has(index)}
                onCheckedChange={() => toggleInsight(index)}
                className="mt-1"
                data-testid={`checkbox-insight-${index}`}
              />
              <p
                className={`flex-1 text-sm transition-all ${
                  completed.has(index)
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}
              >
                {insight}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
