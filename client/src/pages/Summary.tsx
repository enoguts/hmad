import { ExecutiveSummaryView } from '@/components/ExecutiveSummaryView';
import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@shared/schema';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Summary() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('summary')}</h1>
        <p className="text-muted-foreground">
          Executive summary with key findings and recommendations
        </p>
      </motion.div>

      <ExecutiveSummaryView summary={data.executiveSummary} />
    </div>
  );
}
