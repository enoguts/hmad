import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { kpiDataSchema, analyzedCommentSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard data
  app.get('/api/dashboard', async (req, res) => {
    try {
      const postId = req.query.postId as string | undefined;
      const data = await storage.getDashboardData(postId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Get all posts
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts.map(p => ({ id: p.id, name: p.name, uploadedAt: p.uploadedAt })));
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Upload new data
  app.post('/api/upload', upload.fields([
    { name: 'kpi', maxCount: 1 },
    { name: 'comments', maxCount: 1 },
    { name: 'summary', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.kpi || !files.comments) {
        return res.status(400).json({ error: 'Both KPI and comments files are required' });
      }

      const kpiData = JSON.parse(files.kpi[0].buffer.toString('utf-8'));
      const commentsData = JSON.parse(files.comments[0].buffer.toString('utf-8'));
      const summaryData = files.summary 
        ? files.summary[0].buffer.toString('utf-8')
        : 'No executive summary provided.';

      // Validate data
      const validatedKPI = kpiDataSchema.parse(kpiData);
      const validatedComments = z.array(analyzedCommentSchema).parse(commentsData);

      const postName = req.body.postName || `Upload ${new Date().toLocaleDateString()}`;
      const postId = await storage.updateDashboardData(validatedKPI, validatedComments, summaryData, postName);

      res.json({ success: true, message: 'Data uploaded successfully', postId });
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data format', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to upload data' });
    }
  });

  // Reset to sample data
  app.post('/api/reset', async (req, res) => {
    try {
      await storage.resetToSampleData();
      res.json({ success: true, message: 'Data reset to sample successfully' });
    } catch (error) {
      console.error('Reset error:', error);
      res.status(500).json({ error: 'Failed to reset data' });
    }
  });

  // Export insights to CSV
  app.get('/api/export/insights/csv', async (req, res) => {
    try {
      const postId = req.query.postId as string | undefined;
      const data = await storage.getDashboardData(postId);
      
      const insights: string[] = [];
      data.comments.forEach(comment => {
        comment.analysis.actionable_insights.forEach(insight => {
          if (!insights.includes(insight)) {
            insights.push(insight);
          }
        });
      });

      const csv = ['Insight,Status\n'];
      insights.forEach(insight => {
        csv.push(`"${insight.replace(/"/g, '""')}",Pending\n`);
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="actionable-insights-${postId || 'current'}.csv"`);
      res.send(csv.join(''));
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  });

  // Export insights to JSON
  app.get('/api/export/insights/json', async (req, res) => {
    try {
      const postId = req.query.postId as string | undefined;
      const data = await storage.getDashboardData(postId);
      
      const insights: string[] = [];
      data.comments.forEach(comment => {
        comment.analysis.actionable_insights.forEach(insight => {
          if (!insights.includes(insight)) {
            insights.push(insight);
          }
        });
      });

      const jsonData = insights.map(insight => ({
        insight,
        status: 'Pending',
      }));

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="actionable-insights-${postId || 'current'}.json"`);
      res.json(jsonData);
    } catch (error) {
      console.error('JSON export error:', error);
      res.status(500).json({ error: 'Failed to export JSON' });
    }
  });

  // Export comments to CSV
  app.get('/api/export/comments/csv', async (req, res) => {
    try {
      const postId = req.query.postId as string | undefined;
      const data = await storage.getDashboardData(postId);

      const csv = ['Post ID,Comment,Tone,Themes,Language\n'];
      data.comments.forEach(comment => {
        const themes = comment.analysis.themes_and_topics.join('; ');
        const lang = comment.language || 'unknown';
        csv.push(`"${comment.post_id}","${comment.comment.replace(/"/g, '""')}","${comment.analysis.sentiment.overall_tone}","${themes}","${lang}"\n`);
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="comments-${postId || 'current'}.csv"`);
      res.send(csv.join(''));
    } catch (error) {
      console.error('CSV export error:', error);
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
