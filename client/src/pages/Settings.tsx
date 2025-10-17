import { useState } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Settings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [kpiFile, setKpiFile] = useState<File | null>(null);
  const [commentsFile, setCommentsFile] = useState<File | null>(null);
  const [summaryFile, setSummaryFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('POST', '/api/upload', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Success!',
        description: 'Data uploaded successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/reset', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: 'Reset complete',
        description: 'Sample data loaded successfully',
      });
    },
  });

  const handleUpload = () => {
    if (!kpiFile || !commentsFile) {
      toast({
        title: 'Missing files',
        description: 'Please upload both KPI and comments files',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('kpi', kpiFile);
    formData.append('comments', commentsFile);
    if (summaryFile) {
      formData.append('summary', summaryFile);
    }
    uploadMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('settings')}</h1>
        <p className="text-muted-foreground">
          Upload analytics data or reset to sample dataset
        </p>
      </motion.div>

      <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6">
        <h3 className="text-lg font-semibold mb-4">{t('uploadData')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FileUploadZone
            label={t('uploadKPI')}
            accept="application/json"
            onFileSelect={setKpiFile}
            testId="upload-kpi"
          />
          <FileUploadZone
            label={t('uploadCommentData')}
            accept="application/json"
            onFileSelect={setCommentsFile}
            testId="upload-comments"
          />
          <FileUploadZone
            label="Upload Executive Summary (optional)"
            accept=".txt"
            onFileSelect={setSummaryFile}
            testId="upload-summary"
          />
        </div>

        {(kpiFile || commentsFile || summaryFile) && (
          <div className="mb-4 text-sm text-muted-foreground">
            {kpiFile && <div>✓ KPI file: {kpiFile.name}</div>}
            {commentsFile && <div>✓ Comments file: {commentsFile.name}</div>}
            {summaryFile && <div>✓ Summary file: {summaryFile.name}</div>}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!kpiFile || !commentsFile || uploadMutation.isPending}
            data-testid="button-upload-data"
          >
            {uploadMutation.isPending ? 'Uploading...' : t('loadKPIData')}
          </Button>
          <Button
            variant="outline"
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            data-testid="button-reset-data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {resetMutation.isPending ? 'Resetting...' : t('resetData')}
          </Button>
        </div>
      </Card>

      <Card className="backdrop-blur-xl bg-card/40 border-card-border p-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground">
          This analytics dashboard helps film creators and content producers analyze audience sentiment,
          track engagement metrics, and discover actionable insights from social media comments.
        </p>
      </Card>
    </div>
  );
}
