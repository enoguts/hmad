import { ActionableInsightsList } from '@/components/ActionableInsightsList';
import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@shared/schema';
import { extractAllActionableInsights } from '@/lib/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Insights() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      </div>
    );
  }

  const insights = extractAllActionableInsights(data.comments);

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('insights')}</h1>
        <p className="text-muted-foreground">
          Track and manage actionable insights from audience feedback
        </p>
      </motion.div>

      <ActionableInsightsList insights={insights} />
    </div>
  );
}
