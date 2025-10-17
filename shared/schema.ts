import { z } from "zod";

// Sentiment Analysis Schemas
export const sentimentBreakdownSchema = z.object({
  positive_percent: z.number(),
  negative_percent: z.number(),
  neutral_percent: z.number(),
});

export const sentimentSchema = z.object({
  overall_tone: z.string(),
  breakdown: sentimentBreakdownSchema,
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
  language: z.string().optional(),
});

// KPI Schemas
export const toneDistributionSchema = z.record(z.string());

export const sentimentAnalysisSchema = z.object({
  Overall_Positive_Rate: z.string(),
  Tone_Distribution: toneDistributionSchema,
  Positive_Count: z.number(),
  Negative_Count: z.number(),
  Neutral_Count: z.number(),
  Mixed_Count: z.number(),
});

export const kpiDataSchema = z.object({
  "Total Comments Analyzed": z.number(),
  "Sentiment Analysis": sentimentAnalysisSchema,
  "Top Themes & Topics": z.array(z.tuple([z.string(), z.number()])),
  "Character_Focus_Rate": z.string(),
  "Viewer_Curiosity_Volume": z.number(),
  "Feedback_Type_Distribution": z.array(z.tuple([z.string(), z.number()])),
  "Total_Actionable_Insights": z.number(),
});

// Dashboard State Schema
export const dashboardDataSchema = z.object({
  kpi: kpiDataSchema,
  comments: z.array(analyzedCommentSchema),
  executiveSummary: z.string(),
  postName: z.string().optional(),
});

// Export types
export type SentimentBreakdown = z.infer<typeof sentimentBreakdownSchema>;
export type Sentiment = z.infer<typeof sentimentSchema>;
export type ViewerQuestion = z.infer<typeof viewerQuestionSchema>;
export type KeyFeedback = z.infer<typeof keyFeedbackSchema>;
export type CommentAnalysis = z.infer<typeof commentAnalysisSchema>;
export type AnalyzedComment = z.infer<typeof analyzedCommentSchema>;
export type ToneDistribution = z.infer<typeof toneDistributionSchema>;
export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;
export type KPIData = z.infer<typeof kpiDataSchema>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;

// Helper function to detect language from comment text
export function detectLanguage(text: string): string {
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // French detection (basic - looks for French-specific characters)
  if (/[àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]/.test(text)) return 'fr';
  // Default to English
  return 'en';
}

// Processed KPI metrics for display
export interface ProcessedKPIMetrics {
  totalComments: number;
  positiveRate: string;
  viewerCuriosity: number;
  actionableCount: number;
  toneDistribution: { name: string; value: number; percentage: string }[];
  toneCounts: { tone: string; count: number }[];
  topThemes: { theme: string; count: number }[];
  feedbackTypes: { type: string; count: number }[];
}
