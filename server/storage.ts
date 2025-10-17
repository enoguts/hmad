import { readFileSync } from 'fs';
import { join } from 'path';
import { DashboardData, KPIData, AnalyzedComment } from '@shared/schema';

export interface PostData {
  id: string;
  name: string;
  kpi: KPIData;
  comments: AnalyzedComment[];
  executiveSummary: string;
  uploadedAt: Date;
}

export interface IStorage {
  getDashboardData(postId?: string): Promise<DashboardData>;
  updateDashboardData(kpi: KPIData, comments: AnalyzedComment[], executiveSummary: string, postName: string): Promise<string>;
  resetToSampleData(): Promise<void>;
  getAllPosts(): Promise<PostData[]>;
  getPost(postId: string): Promise<PostData | undefined>;
}

export class MemStorage implements IStorage {
  private posts: Map<string, PostData>;
  private currentPostId: string;

  constructor() {
    this.posts = new Map();
    this.loadAllSampleData();
    this.currentPostId = 'post1';
  }

  private loadAllSampleData(): void {
    const samplePosts = [
      { id: 'post1', name: 'Sample Post 1', kpiFile: 'overall_kpi_post1_1760665591104.json', commentsFile: 'analyzed_comments_post1_1760665591106.json', summaryFile: 'executive_summary_post1_1760665591102.txt' },
      { id: 'post2', name: 'Sample Post 2', kpiFile: 'overall_kpi_post2_1760665610030.json', commentsFile: 'analyzed_comments_post2_1760665610032.json', summaryFile: 'executive_summary_post2_1760665610029.txt' },
      { id: 'post3', name: 'Sample Post 3', kpiFile: 'overall_kpi_post3_1760665627384.json', commentsFile: 'analyzed_comments_post3_1760665627386.json', summaryFile: 'executive_summary_post3_1760665627383.txt' },
    ];

    samplePosts.forEach(({ id, name, kpiFile, commentsFile, summaryFile }) => {
      try {
        const kpiPath = join(process.cwd(), 'attached_assets', kpiFile);
        const commentsPath = join(process.cwd(), 'attached_assets', commentsFile);
        const summaryPath = join(process.cwd(), 'attached_assets', summaryFile);

        const kpi = JSON.parse(readFileSync(kpiPath, 'utf-8'));
        const comments = JSON.parse(readFileSync(commentsPath, 'utf-8'));
        const executiveSummary = readFileSync(summaryPath, 'utf-8');

        this.posts.set(id, {
          id,
          name,
          kpi,
          comments,
          executiveSummary,
          uploadedAt: new Date(),
        });
      } catch (error) {
        console.error(`Error loading sample data for ${id}:`, error);
      }
    });
  }

  async getDashboardData(postId?: string): Promise<DashboardData> {
    // Aggregate data from all posts
    const allPosts = Array.from(this.posts.values());
    
    if (allPosts.length === 0) {
      return {
        kpi: {
          "Total Comments Analyzed": 0,
          "Sentiment Analysis": {
            "Overall_Positive_Rate": "0%",
            "Tone_Distribution": {},
            "Positive_Count": 0,
            "Negative_Count": 0,
            "Neutral_Count": 0,
            "Mixed_Count": 0,
          },
          "Top Themes & Topics": [],
          "Character_Focus_Rate": "0%",
          "Viewer_Curiosity_Volume": 0,
          "Feedback_Type_Distribution": [],
          "Total_Actionable_Insights": 0,
        },
        comments: [],
        executiveSummary: 'No data available.',
        postName: 'No Data',
      };
    }

    // Combine all comments from all posts
    const allComments: AnalyzedComment[] = [];
    allPosts.forEach(post => {
      allComments.push(...post.comments);
    });

    // Aggregate KPI metrics
    const totalComments = allComments.length;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let mixedCount = 0;
    let viewerCuriosity = 0;
    const themesMap = new Map<string, number>();
    const feedbackMap = new Map<string, number>();
    let actionableCount = 0;

    allComments.forEach(comment => {
      const tone = comment.analysis.sentiment.overall_tone.toLowerCase();
      if (tone.includes('positive')) positiveCount++;
      else if (tone.includes('negative')) negativeCount++;
      else if (tone.includes('neutral')) neutralCount++;
      else if (tone.includes('mixed')) mixedCount++;

      if (comment.analysis.viewer_questions.length > 0) {
        viewerCuriosity += comment.analysis.viewer_questions.length;
      }

      comment.analysis.themes_and_topics.forEach(theme => {
        themesMap.set(theme, (themesMap.get(theme) || 0) + 1);
      });

      const feedbackType = comment.analysis.key_feedback.type;
      feedbackMap.set(feedbackType, (feedbackMap.get(feedbackType) || 0) + 1);

      actionableCount += comment.analysis.actionable_insights.length;
    });

    const positiveRate = totalComments > 0 
      ? ((positiveCount / totalComments) * 100).toFixed(2) + '%'
      : '0%';

    const toneDistribution: Record<string, string> = {};
    if (positiveCount > 0) toneDistribution['Positive'] = ((positiveCount / totalComments) * 100).toFixed(2) + '%';
    if (negativeCount > 0) toneDistribution['Negative'] = ((negativeCount / totalComments) * 100).toFixed(2) + '%';
    if (neutralCount > 0) toneDistribution['Neutral'] = ((neutralCount / totalComments) * 100).toFixed(2) + '%';
    if (mixedCount > 0) toneDistribution['Mixed'] = ((mixedCount / totalComments) * 100).toFixed(2) + '%';

    const topThemes = Array.from(themesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([theme, count]) => [theme, count] as [string, number]);

    const feedbackTypes = Array.from(feedbackMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => [type, count] as [string, number]);

    // Combine executive summaries
    const summaries = allPosts.map((post, idx) => 
      `**${post.name}:**\n${post.executiveSummary}`
    ).join('\n\n---\n\n');

    return {
      kpi: {
        "Total Comments Analyzed": totalComments,
        "Sentiment Analysis": {
          "Overall_Positive_Rate": positiveRate,
          "Tone_Distribution": toneDistribution,
          "Positive_Count": positiveCount,
          "Negative_Count": negativeCount,
          "Neutral_Count": neutralCount,
          "Mixed_Count": mixedCount,
        },
        "Top Themes & Topics": topThemes,
        "Character_Focus_Rate": "0%",
        "Viewer_Curiosity_Volume": viewerCuriosity,
        "Feedback_Type_Distribution": feedbackTypes,
        "Total_Actionable_Insights": actionableCount,
      },
      comments: allComments,
      executiveSummary: summaries,
      postName: `All Posts (${allPosts.length})`,
    };
  }

  async updateDashboardData(
    kpi: KPIData,
    comments: AnalyzedComment[],
    executiveSummary: string,
    postName: string
  ): Promise<string> {
    const postId = `upload_${Date.now()}`;
    this.posts.set(postId, {
      id: postId,
      name: postName,
      kpi,
      comments,
      executiveSummary,
      uploadedAt: new Date(),
    });
    this.currentPostId = postId;
    return postId;
  }

  async resetToSampleData(): Promise<void> {
    // Clear all non-sample posts
    const samplePostIds = ['post1', 'post2', 'post3'];
    Array.from(this.posts.keys()).forEach(postId => {
      if (!samplePostIds.includes(postId)) {
        this.posts.delete(postId);
      }
    });
    // Reset to first sample post
    this.currentPostId = 'post1';
  }

  async getAllPosts(): Promise<PostData[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      b.uploadedAt.getTime() - a.uploadedAt.getTime()
    );
  }

  async getPost(postId: string): Promise<PostData | undefined> {
    return this.posts.get(postId);
  }
}

export const storage = new MemStorage();
