import { z } from "zod";

// Sentiment Analysis Schema
export const sentimentSchema = z.object({
  overall_tone: z.enum(["Positive", "Negative", "Neutral", "Mixed"]),
  breakdown: z.object({
    positive_percent: z.number(),
    negative_percent: z.number(),
    neutral_percent: z.number(),
  }),
  commentary: z.string(),
});

export const viewerQuestionSchema = z.object({
  question: z.string(),
  type: z.string(),
});

export const keyFeedbackSchema = z.object({
  type: z.string(),
  summary: z.string(),
  emotion_words: z.array(z.string()),
});

export const commentAnalysisSchema = z.object({
  sentiment: sentimentSchema,
  themes_and_topics: z.array(z.string()),
  viewer_questions: z.array(viewerQuestionSchema),
  key_feedback: keyFeedbackSchema,
  actionable_insights: z.array(z.string()),
});

export const analyzedCommentSchema = z.object({
  post_id: z.string(),
  comment: z.string(),
  analysis: commentAnalysisSchema,
});

export const kpiSentimentAnalysisSchema = z.object({
  Overall_Positive_Rate: z.string(),
  Tone_Distribution: z.record(z.string()),
  Positive_Count: z.number(),
  Negative_Count: z.number(),
  Neutral_Count: z.number(),
  Mixed_Count: z.number(),
});

export const overallKpiSchema = z.object({
  "Total Comments Analyzed": z.number(),
  "Sentiment Analysis": kpiSentimentAnalysisSchema,
  "Top Themes & Topics": z.array(z.tuple([z.string(), z.number()])),
  Character_Focus_Rate: z.string(),
  Viewer_Curiosity_Volume: z.number(),
  Feedback_Type_Distribution: z.array(z.tuple([z.string(), z.number()])),
  Total_Actionable_Insights: z.number(),
});

// Type exports
export type Sentiment = z.infer<typeof sentimentSchema>;
export type ViewerQuestion = z.infer<typeof viewerQuestionSchema>;
export type KeyFeedback = z.infer<typeof keyFeedbackSchema>;
export type CommentAnalysis = z.infer<typeof commentAnalysisSchema>;
export type AnalyzedComment = z.infer<typeof analyzedCommentSchema>;
export type KpiSentimentAnalysis = z.infer<typeof kpiSentimentAnalysisSchema>;
export type OverallKpi = z.infer<typeof overallKpiSchema>;
export type ExecutiveSummary = string;

// Language types
export type Language = "en" | "ar" | "fr";
export type SentimentTone = "Positive" | "Negative" | "Neutral" | "Mixed";
