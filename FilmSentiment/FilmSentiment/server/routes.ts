import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFile } from "fs/promises";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to serve overall KPIs
  app.get("/api/kpis", async (req, res) => {
    try {
      const filePath = join(process.cwd(), "server/data/overall_kpi.json");
      const data = await readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading KPIs:", error);
      res.status(500).json({ error: "Failed to load KPIs" });
    }
  });

  // API endpoint to serve analyzed comments
  app.get("/api/comments", async (req, res) => {
    try {
      const filePath = join(process.cwd(), "server/data/analyzed_comments.json");
      const data = await readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading comments:", error);
      res.status(500).json({ error: "Failed to load comments" });
    }
  });

  // API endpoint to serve executive summary
  app.get("/api/executive-summary", async (req, res) => {
    try {
      const filePath = join(process.cwd(), "server/data/executive_summary.txt");
      const data = await readFile(filePath, "utf-8");
      res.send(data);
    } catch (error) {
      console.error("Error reading executive summary:", error);
      res.status(500).json({ error: "Failed to load executive summary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
