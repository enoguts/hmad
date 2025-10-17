import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExecutiveSummaryViewProps {
  summary: string;
}

export function ExecutiveSummaryView({ summary }: ExecutiveSummaryViewProps) {
  const { t } = useLanguage();

  const downloadPDF = () => {
    // For now, we'll create a printable version
    window.print();
  };

  // Parse markdown-like summary
  const parsedSummary = summary.split('\n').map((line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      const text = line.replace(/\*\*/g, '');
      return (
        <h3 key={index} className="text-lg font-semibold mt-6 mb-2">
          {text}
        </h3>
      );
    }
    if (line.startsWith('##')) {
      const text = line.replace(/##/g, '').trim();
      return (
        <h2 key={index} className="text-xl font-bold mt-8 mb-3">
          {text}
        </h2>
      );
    }
    if (line.match(/^\d+\./)) {
      return (
        <li key={index} className="ml-6 mb-2 text-sm leading-relaxed">
          {line.replace(/^\d+\.\s*/, '')}
        </li>
      );
    }
    if (line.trim()) {
      return (
        <p key={index} className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {line}
        </p>
      );
    }
    return null;
  });

  return (
    <Card className="backdrop-blur-xl bg-card/40 border-card-border p-8" data-testid="executive-summary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t('executiveSummary')}</h2>
        <Button
          variant="outline"
          onClick={downloadPDF}
          data-testid="button-download-pdf"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('downloadPDF')}
        </Button>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="rounded-lg border border-border bg-background/50 p-6">
          {parsedSummary}
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          [data-testid="executive-summary"], [data-testid="executive-summary"] * {
            visibility: visible;
          }
          [data-testid="executive-summary"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </Card>
  );
}
