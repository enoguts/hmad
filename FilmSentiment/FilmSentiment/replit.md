# Film Sentiment Dashboard - Moroccan Cinema Analytics

## Overview

This is a full-stack sentiment analysis dashboard application built to visualize and analyze audience feedback for Moroccan film promotion campaigns. The application processes social media comments, performs AI-powered sentiment analysis, and presents actionable insights through an interactive data visualization interface.

**Core Purpose:** Enable content teams to understand audience sentiment, identify engagement patterns, and extract actionable insights from social media feedback about film content.

**Tech Stack:**
- Frontend: React + TypeScript with Vite
- Backend: Express.js (Node.js)
- UI Framework: Shadcn UI components with Radix UI primitives
- Styling: Tailwind CSS
- Data Visualization: Recharts
- State Management: TanStack Query (React Query)
- Database ORM: Drizzle ORM configured for PostgreSQL
- Routing: Wouter (client-side)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- **Page-based routing** using Wouter with 4 main views:
  - Dashboard (overview with KPI cards and charts)
  - Comments Explorer (filterable table with search)
  - Insights (actionable items with tracking)
  - Executive Summary (text-based analysis)

**Design System:**
- Based on Shadcn UI "New York" style variant
- Custom data dashboard pattern optimized for information density
- Dark mode primary with light mode support via theme provider
- RTL-ready for Arabic content support
- Color palette focused on data visualization clarity with semantic sentiment colors

**State Management:**
- TanStack Query for server state with disabled auto-refetch
- React Context for theme (dark/light) and language (en/ar/fr) preferences
- Local component state for UI interactions (filters, expanded rows, checkboxes)

**Data Flow:**
- API requests to `/api/kpis`, `/api/comments`, `/api/executive-summary`
- Data transformation happens client-side for charts and tables
- CSV export utilities for data portability

### Backend Architecture

**API Layer:**
- Express.js server with file-based data serving
- Three main endpoints serving static JSON/text files from `server/data/`:
  - GET `/api/kpis` → overall_kpi.json
  - GET `/api/comments` → analyzed_comments.json  
  - GET `/api/executive-summary` → executive_summary.txt

**Development Setup:**
- Vite middleware integration for HMR in development
- Production build outputs to `dist/` directory
- Static file serving from built client assets

**Data Storage:**
- Currently file-based JSON storage in `server/data/`
- Drizzle ORM configured for PostgreSQL (not actively used but schema defined)
- In-memory user storage implementation available for future authentication needs

### External Dependencies

**AI/ML Services:**
- OpenRouter API integration for LLM-powered sentiment analysis (Python scripts in attached_assets)
- GPT-3.5-turbo model used for comment analysis and executive summary generation

**UI Libraries:**
- Radix UI primitives (30+ components): dialogs, dropdowns, tooltips, navigation, etc.
- Recharts for data visualization (pie charts, bar charts, horizontal bars)
- Embla Carousel for potential future content carousels
- cmdk for command palette functionality

**Development Tools:**
- Replit-specific plugins: runtime error modal, cartographer (dev mode), dev banner
- TypeScript for type safety across client/server/shared code
- ESBuild for production server bundling
- PostCSS with Tailwind for styling pipeline

**Data Processing:**
- Python scripts for ETL pipeline (transform Instagram JSON → CSV → analyzed comments)
- OpenAI client for sentiment analysis batch processing
- KPI aggregation and executive summary generation scripts

**Session/State:**
- connect-pg-simple configured for PostgreSQL session storage (ready for production use)
- Express sessions configured but not actively enforced (no authentication currently)

**Validation:**
- Zod schemas for runtime type validation of API responses
- drizzle-zod for database schema validation integration
- Shared schema types between client and server via `@shared/schema`

**Internationalization:**
- Custom language context supporting English, Arabic, and French
- Translation keys defined in language-context.tsx
- Date formatting via date-fns library