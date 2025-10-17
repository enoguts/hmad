import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Download, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { exportCommentsToCSV } from "@/lib/export-utils";
import type { AnalyzedComment, SentimentTone } from "@shared/schema";
import { useLocation } from "wouter";

export default function Comments() {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [themeFilter, setThemeFilter] = useState<string>("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { data: comments, isLoading, error } = useQuery<AnalyzedComment[]>({
    queryKey: ["/api/comments"],
  });

  // Extract theme from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const theme = params.get('theme');
    if (theme) {
      setThemeFilter(theme);
    }
  }, [location]);

  const allThemes = useMemo(() => {
    if (!comments) return [];
    const themesSet = new Set<string>();
    comments.forEach(comment => {
      comment.analysis.themes_and_topics.forEach(theme => themesSet.add(theme));
    });
    return Array.from(themesSet).sort();
  }, [comments]);

  const filteredComments = useMemo(() => {
    if (!comments) return [];
    
    return comments.filter(comment => {
      const matchesSearch = searchQuery === "" || 
        comment.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.post_id.includes(searchQuery);
      
      const matchesSentiment = sentimentFilter === "all" || 
        comment.analysis.sentiment.overall_tone === sentimentFilter;
      
      const matchesTheme = themeFilter === "all" || 
        comment.analysis.themes_and_topics.includes(themeFilter);
      
      return matchesSearch && matchesSentiment && matchesTheme;
    });
  }, [comments, searchQuery, sentimentFilter, themeFilter]);

  const getSentimentColor = (tone: SentimentTone) => {
    switch (tone) {
      case "Positive": return "bg-chart-2 text-white";
      case "Negative": return "bg-destructive text-white";
      case "Neutral": return "bg-muted text-muted-foreground";
      case "Mixed": return "bg-chart-3 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const isRTL = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
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
          <p className="text-sm text-muted-foreground">{error?.message || "Failed to load comments"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-comments-title">{t("commentsExplorer")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredComments.length} {t("comments").toLowerCase()}
          </p>
        </div>
        <Button 
          onClick={() => exportCommentsToCSV(filteredComments)} 
          variant="outline" 
          size="sm"
          data-testid="button-export-comments"
        >
          <Download className="h-4 w-4 mr-2" />
          {t("exportCSV")}
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-comments"
              />
            </div>
          </div>
          <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-sentiment-filter">
              <SelectValue placeholder={t("filterBySentiment")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="Positive">{t("positive")}</SelectItem>
              <SelectItem value="Neutral">{t("neutral")}</SelectItem>
              <SelectItem value="Mixed">{t("mixed")}</SelectItem>
              <SelectItem value="Negative">{t("negative")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={themeFilter} onValueChange={setThemeFilter}>
            <SelectTrigger className="w-[200px]" data-testid="select-theme-filter">
              <SelectValue placeholder={t("filterByTheme")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {allThemes.map(theme => (
                <SelectItem key={theme} value={theme}>{theme}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredComments.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{t("noComments")}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <Card 
              key={comment.post_id} 
              className="overflow-hidden hover-elevate"
              data-testid={`card-comment-${comment.post_id}`}
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === comment.post_id ? null : comment.post_id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <code className="text-xs font-mono text-muted-foreground">{comment.post_id}</code>
                      <Badge className={getSentimentColor(comment.analysis.sentiment.overall_tone)}>
                        {comment.analysis.sentiment.overall_tone}
                      </Badge>
                      {comment.analysis.themes_and_topics.map((theme, idx) => (
                        <Badge key={idx} variant="outline">{theme}</Badge>
                      ))}
                    </div>
                    <p 
                      className={`text-sm ${isRTL(comment.comment) ? 'font-arabic' : ''}`}
                      dir={isRTL(comment.comment) ? 'rtl' : 'ltr'}
                    >
                      {expandedRow === comment.post_id 
                        ? comment.comment 
                        : comment.comment.slice(0, 150) + (comment.comment.length > 150 ? "..." : "")
                      }
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    {expandedRow === comment.post_id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {expandedRow === comment.post_id && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    {comment.analysis.viewer_questions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">{t("questions")}</h4>
                        <ul className="space-y-1">
                          {comment.analysis.viewer_questions.map((q, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              • {q.question} <Badge variant="outline" className="ml-2">{q.type}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {comment.analysis.actionable_insights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2">{t("insights")}</h4>
                        <ul className="space-y-1">
                          {comment.analysis.actionable_insights.map((insight, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
