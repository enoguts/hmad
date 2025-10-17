import { KPIData, ProcessedKPIMetrics, AnalyzedComment, detectLanguage } from '@shared/schema';

export function processKPIData(kpi: KPIData): ProcessedKPIMetrics {
  const toneDistribution = Object.entries(kpi['Sentiment Analysis'].Tone_Distribution).map(
    ([name, percentage]) => ({
      name,
      value: parseFloat(percentage),
      percentage,
    })
  );

  const toneCounts = [
    { tone: 'Positive', count: kpi['Sentiment Analysis'].Positive_Count },
    { tone: 'Negative', count: kpi['Sentiment Analysis'].Negative_Count },
    { tone: 'Neutral', count: kpi['Sentiment Analysis'].Neutral_Count },
    { tone: 'Mixed', count: kpi['Sentiment Analysis'].Mixed_Count },
  ].filter(item => item.count > 0);

  const topThemes = kpi['Top Themes & Topics'].map(([theme, count]) => ({
    theme,
    count,
  }));

  const feedbackTypes = kpi['Feedback_Type_Distribution'].map(([type, count]) => ({
    type,
    count,
  }));

  return {
    totalComments: kpi['Total Comments Analyzed'],
    positiveRate: kpi['Sentiment Analysis'].Overall_Positive_Rate,
    viewerCuriosity: kpi['Viewer_Curiosity_Volume'],
    actionableCount: kpi['Total_Actionable_Insights'],
    toneDistribution,
    toneCounts,
    topThemes,
    feedbackTypes,
  };
}

export function enrichCommentsWithLanguage(comments: AnalyzedComment[]): AnalyzedComment[] {
  return comments.map(comment => ({
    ...comment,
    language: comment.language || detectLanguage(comment.comment),
  }));
}

export function extractAllActionableInsights(comments: AnalyzedComment[]): string[] {
  const insights: string[] = [];
  comments.forEach(comment => {
    comment.analysis.actionable_insights.forEach(insight => {
      if (!insights.includes(insight)) {
        insights.push(insight);
      }
    });
  });
  return insights;
}
