# Cinematic Analytics Dashboard

A professional social media analytics dashboard designed for film creators and content producers to analyze audience sentiment, track engagement metrics, and discover actionable insights from social media comments.

## Overview

This is a full-stack React + Express application that provides comprehensive sentiment analysis and data visualization for social media comments. The dashboard features a cinematic dark mode design with glass morphism effects, multi-language support (English, French, Arabic with RTL), and interactive data visualizations.

## Recent Changes

**2025-01-17**: Initial MVP implementation
- Complete frontend with all pages and components
- Backend API with file upload and data management
- Multi-language support with RTL layout for Arabic
- Sample data preloaded from 3 posts

## Project Architecture

### Frontend (`client/src/`)
- **Pages**: Dashboard, Comments Explorer, Actionable Insights, Executive Summary, Settings
- **Components**: 
  - KPI Cards with trend indicators
  - Interactive charts (Donut, Bar, Themes)
  - Expandable comments table with filtering
  - Actionable insights checklist with export
  - File upload interface
- **Contexts**: Theme (dark/light mode), Language (EN/FR/AR with RTL)
- **Design**: Glass morphism cards, smooth animations, responsive layout

### Backend (`server/`)
- **Storage**: In-memory storage with sample data loading
- **Routes**: 
  - `GET /api/dashboard` - Fetch analytics data
  - `POST /api/upload` - Upload custom JSON data
  - `POST /api/reset` - Reset to sample data
- **Validation**: Zod schema validation for uploaded data

### Data Schema (`shared/schema.ts`)
- KPI metrics: Total comments, sentiment analysis, themes, viewer curiosity
- Analyzed comments: Post ID, comment text, sentiment analysis, themes, questions, insights
- Dashboard data: Combined KPI + comments + executive summary

## Key Features

### Dashboard
- 4 KPI cards: Total Comments, Positive Rate, Viewer Curiosity, Actionable Insights
- Sentiment donut chart showing tone distribution
- Bar chart for sentiment counts
- Horizontal bar chart for top themes (clickable to filter comments)
- Full comments table with expandable rows

### Comments Explorer
- Search and filter by tone (Positive/Negative/Neutral/Mixed)
- Expandable rows showing full sentiment breakdown
- Viewer questions and actionable insights per comment
- Copy to clipboard functionality
- Language detection badges

### Actionable Insights
- Checklist with strike-through on completion
- Export to CSV and JSON formats
- Aggregated from all comments

### Executive Summary
- Markdown-style formatted summary
- PDF export capability (print-optimized)

### Settings
- Upload custom KPI and comments JSON files
- Reset to sample data
- File drag & drop support

### Multi-Language & RTL
- English, French, Arabic support
- Full RTL layout for Arabic
- Charts automatically flip direction

## User Preferences

- **Theme**: Dark mode by default (cinematic aesthetic)
- **Languages**: EN/FR/AR with seamless switching
- **Data Source**: Sample data preloaded, supports custom uploads

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, Recharts, Framer Motion
- **Backend**: Express, Multer (file uploads), Zod (validation)
- **Routing**: Wouter
- **State**: TanStack Query
- **Build**: Vite

## Sample Data

The application comes preloaded with 3 posts worth of sample data from:
- `attached_assets/overall_kpi_post1_*.json`
- `attached_assets/analyzed_comments_post1_*.json`
- `attached_assets/executive_summary_post1_*.txt`

Users can upload their own JSON files in the Settings page.

## Running the Application

The workflow "Start application" runs `npm run dev` which:
1. Starts Express backend server
2. Starts Vite frontend dev server
3. Both run on the same port with Vite proxy

Access the dashboard at the preview URL once the workflow is running.
