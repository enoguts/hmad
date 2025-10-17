import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Eye, Lightbulb, Download } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { SentimentPieChart } from "@/components/sentiment-pie-chart";
import { SentimentBarChart } from "@/components/sentiment-bar-chart";
import { ThemesChart } from "@/components/themes-chart";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { exportKPIsToCSV } from "@/lib/export-utils";
import type { OverallKpi } from "@shared/schema";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: kpis, isLoading, error } = useQuery<OverallKpi>({
    queryKey: ["/api/kpis"],
  });

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

  if (error || !kpis) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">{t("error")}</p>
          <p className="text-sm text-muted-foreground">{error?.message || "Failed to load KPIs"}</p>
        </div>
      </div>
    );
  }

  const handleThemeClick = (theme: string) => {
    setLocation(`/comments?theme=${encodeURIComponent(theme)}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-dashboard-title">{t("dashboard")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("filmSentiment")}
          </p>
        </div>
        <Button 
          onClick={() => exportKPIsToCSV(kpis)} 
          variant="outline" 
          size="sm"
          data-testid="button-export-kpis"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("exportCSV")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title={t("totalComments")}
          value={kpis["Total Comments Analyzed"]}
          icon={BarChart3}
          testId="card-total-comments"
        />
        <KpiCard
          title={t("positiveRate")}
          value={kpis["Sentiment Analysis"]["Overall_Positive_Rate"]}
          icon={TrendingUp}
          testId="card-positive-rate"
        />
        <KpiCard
          title={t("viewerCuriosity")}
          value={kpis["Viewer_Curiosity_Volume"]}
          icon={Eye}
          testId="card-viewer-curiosity"
        />
        <KpiCard
          title={t("actionableInsights")}
          value={kpis["Total_Actionable_Insights"]}
          icon={Lightbulb}
          testId="card-actionable-insights"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentPieChart data={kpis["Sentiment Analysis"]["Tone_Distribution"]} />
        <SentimentBarChart
          positive={kpis["Sentiment Analysis"]["Positive_Count"]}
          neutral={kpis["Sentiment Analysis"]["Neutral_Count"]}
          mixed={kpis["Sentiment Analysis"]["Mixed_Count"]}
          negative={kpis["Sentiment Analysis"]["Negative_Count"]}
        />
      </div>

      <ThemesChart 
        themes={kpis["Top Themes & Topics"]} 
        onThemeClick={handleThemeClick}
      />
    </div>
  );
}
