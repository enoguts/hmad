import { MessageSquare, ThumbsUp, Search, Lightbulb } from 'lucide-react';
import { KPICard } from '@/components/KPICard';
import { SentimentDonutChart } from '@/components/SentimentDonutChart';
import { SentimentBarChart } from '@/components/SentimentBarChart';
import { ThemesBarChart } from '@/components/ThemesBarChart';
import { CommentsTable } from '@/components/CommentsTable';
import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@shared/schema';
import { processKPIData, enrichCommentsWithLanguage } from '@/lib/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const metrics = processKPIData(data.kpi);
  const enrichedComments = enrichCommentsWithLanguage(data.comments);

  return (
    <div className="space-y-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('dashboard')}</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics for your social media content
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('totalComments')}
          value={metrics.totalComments}
          icon={MessageSquare}
          testId="kpi-total-comments"
        />
        <KPICard
          title={t('positiveRate')}
          value={metrics.positiveRate}
          icon={ThumbsUp}
          trend="up"
          testId="kpi-positive-rate"
        />
        <KPICard
          title={t('viewerCuriosity')}
          value={metrics.viewerCuriosity}
          icon={Search}
          testId="kpi-viewer-curiosity"
        />
        <KPICard
          title={t('actionableInsights')}
          value={metrics.actionableCount}
          icon={Lightbulb}
          testId="kpi-actionable-insights"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentDonutChart data={metrics.toneDistribution} />
        <SentimentBarChart data={metrics.toneCounts} />
      </div>

      <ThemesBarChart data={metrics.topThemes} />

      <CommentsTable comments={enrichedComments} />
    </div>
  );
}
