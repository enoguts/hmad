import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { exportToCSV } from "@/lib/export-utils";
import type { AnalyzedComment } from "@shared/schema";

export default function Insights() {
  const { t } = useLanguage();
  const [addressedInsights, setAddressedInsights] = useState<Set<string>>(new Set());

  const { data: comments, isLoading, error } = useQuery<AnalyzedComment[]>({
    queryKey: ["/api/comments"],
  });

  const allInsights = useMemo(() => {
    if (!comments) return [];
    
    const insightsMap = new Map<string, { text: string; postId: string }>();
    
    comments.forEach(comment => {
      comment.analysis.actionable_insights.forEach(insight => {
        const key = `${comment.post_id}-${insight}`;
        if (!insightsMap.has(key)) {
          insightsMap.set(key, { text: insight, postId: comment.post_id });
        }
      });
    });
    
    return Array.from(insightsMap.entries()).map(([key, value]) => ({
      id: key,
      ...value
    }));
  }, [comments]);

  const toggleInsight = (id: string) => {
    const newSet = new Set(addressedInsights);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setAddressedInsights(newSet);
  };

  const handleExport = () => {
    const data = allInsights.map(insight => ({
      post_id: insight.postId,
      insight: insight.text,
      addressed: addressedInsights.has(insight.id) ? 'Yes' : 'No'
    }));
    exportToCSV(data, "actionable-insights.csv");
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

  if (error || !comments) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">{t("error")}</p>
          <p className="text-sm text-muted-foreground">{error?.message || "Failed to load insights"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-insights-title">{t("actionableInsights")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allInsights.length} {t("insights").toLowerCase()}
          </p>
        </div>
        <Button 
          onClick={handleExport} 
          variant="outline" 
          size="sm"
          data-testid="button-export-insights"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("exportCSV")}
        </Button>
      </div>

      {allInsights.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{t("noInsights")}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {allInsights.map((insight) => (
            <Card 
              key={insight.id} 
              className="p-4 hover-elevate"
              data-testid={`card-insight-${insight.id}`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={addressedInsights.has(insight.id)}
                  onCheckedChange={() => toggleInsight(insight.id)}
                  className="mt-1"
                  data-testid={`checkbox-insight-${insight.id}`}
                />
                <div className="flex-1">
                  <p className={`text-sm ${addressedInsights.has(insight.id) ? 'line-through text-muted-foreground' : ''}`}>
                    {insight.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Post: <code className="font-mono">{insight.postId}</code>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
