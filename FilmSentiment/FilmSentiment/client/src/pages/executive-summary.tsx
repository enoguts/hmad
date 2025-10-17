import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { downloadText } from "@/lib/export-utils";

export default function ExecutiveSummary() {
  const { t } = useLanguage();

  const { data: summary, isLoading, error } = useQuery<string>({
    queryKey: ["/api/executive-summary"],
  });

  const handleDownload = () => {
    if (summary) {
      downloadText(summary, "executive-summary.txt");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">{t("error")}</p>
          <p className="text-sm text-muted-foreground">{error?.message || "Failed to load executive summary"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-summary-title">{t("executiveSummary")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("filmSentiment")}
          </p>
        </div>
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          size="sm"
          data-testid="button-download-summary"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("downloadSummary")}
        </Button>
      </div>

      <Card className="p-8" data-testid="card-summary-content">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {summary.split('\n').map((line, idx) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <h3 key={idx} className="font-semibold text-lg mt-6 mb-3">{line.replace(/\*\*/g, '')}</h3>;
            }
            if (line.trim() === '') {
              return <div key={idx} className="h-2" />;
            }
            if (line.match(/^\d+\./)) {
              return <p key={idx} className="text-sm leading-relaxed ml-4">{line}</p>;
            }
            return <p key={idx} className="text-sm leading-relaxed">{line}</p>;
          })}
        </div>
      </Card>
    </div>
  );
}
