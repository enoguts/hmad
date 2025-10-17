import type { AnalyzedComment, OverallKpi } from "@shared/schema";

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportKPIsToCSV(kpis: OverallKpi) {
  const data = [
    { metric: "Total Comments Analyzed", value: kpis["Total Comments Analyzed"] },
    { metric: "Overall Positive Rate", value: kpis["Sentiment Analysis"]["Overall_Positive_Rate"] },
    { metric: "Positive Count", value: kpis["Sentiment Analysis"]["Positive_Count"] },
    { metric: "Neutral Count", value: kpis["Sentiment Analysis"]["Neutral_Count"] },
    { metric: "Mixed Count", value: kpis["Sentiment Analysis"]["Mixed_Count"] },
    { metric: "Negative Count", value: kpis["Sentiment Analysis"]["Negative_Count"] },
    { metric: "Viewer Curiosity Volume", value: kpis["Viewer_Curiosity_Volume"] },
    { metric: "Total Actionable Insights", value: kpis["Total_Actionable_Insights"] },
    { metric: "Character Focus Rate", value: kpis["Character_Focus_Rate"] },
  ];

  exportToCSV(data, "kpis-export.csv");
}

export function exportCommentsToCSV(comments: AnalyzedComment[]) {
  const data = comments.map((comment) => ({
    post_id: comment.post_id,
    comment: comment.comment,
    tone: comment.analysis.sentiment.overall_tone,
    themes: comment.analysis.themes_and_topics.join("; "),
    questions: comment.analysis.viewer_questions.map(q => q.question).join("; "),
    insights: comment.analysis.actionable_insights.join("; "),
  }));

  exportToCSV(data, "comments-export.csv");
}

export function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
