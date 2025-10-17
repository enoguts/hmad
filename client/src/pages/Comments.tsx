import { CommentsTable } from '@/components/CommentsTable';
import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@shared/schema';
import { enrichCommentsWithLanguage } from '@/lib/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Comments() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading comments...</p>
        </div>
      </div>
    );
  }

  const enrichedComments = enrichCommentsWithLanguage(data.comments);

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('comments')}</h1>
        <p className="text-muted-foreground">
          Explore and analyze all comments in detail
        </p>
      </motion.div>

      <CommentsTable comments={enrichedComments} />
    </div>
  );
}
