# Design Guidelines: Social Media Analytics Dashboard

## Design Approach
**System-Based Approach**: This is a utility-focused, information-dense analytics application. We'll follow modern dashboard design principles inspired by **Linear's clarity + Notion's minimalism + Netflix's cinematic aesthetics**, creating a professional analytics experience optimized for data comprehension and efficiency.

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 13 13 15 (deep charcoal #0d0d0f)
- Primary Accent: 190 100% 50% (cyan #00E0FF) - for highlights and interactive elements
- Secondary Accent: 32 100% 64% (amber #FFB547) - for warnings and secondary actions
- Text Primary: 0 0% 97% (#f8f8f8)
- Text Muted: 220 9% 66% (#9CA3AF)
- Surface/Cards: 0 0% 10% with glass blur overlay
- Success: 142 71% 45% (emerald)
- Error: 0 84% 60% (red)

**Light Mode (Secondary)**
- Background: 0 0% 98%
- Maintain accent colors
- Text Primary: 0 0% 13%
- Text Muted: 0 0% 45%

### B. Typography

**Font Family**: Inter (primary) or Poppins (fallback)

**Scale & Hierarchy**
- Display/Hero: 3rem (48px), font-weight 700, letter-spacing -0.02em
- H1 Dashboard Title: 2rem (32px), font-weight 600
- H2 Section Headers: 1.5rem (24px), font-weight 600
- H3 Card Headers: 1.125rem (18px), font-weight 600
- Body: 0.875rem (14px), font-weight 400, line-height 1.5
- Small/Meta: 0.75rem (12px), font-weight 400
- Code/Data: JetBrains Mono, 0.875rem

**RTL Support**: Full bidirectional text support with `dir="rtl"` for Arabic content

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing: p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: py-8, py-12
- Major sections: py-16, py-20

**Grid System**
- KPI Cards: 4-column grid on desktop (grid-cols-4), 2-column on tablet, 1-column mobile
- Dashboard: 12-column responsive grid
- Sidebar: Fixed 64px collapsed, 240px expanded
- Main content: max-w-7xl container with px-6

### D. Component Library

**Navigation**
- Collapsible sidebar: Icons with tooltips (collapsed), full labels (expanded)
- Top navbar: Sticky, glass blur effect, 64px height
- Navigation items: Hover state with cyan underline, active state with cyan background (10% opacity)

**KPI Cards**
- Glass morphism cards: backdrop-blur-xl, rounded-2xl, border 1px solid rgba(255,255,255,0.1)
- Each card includes: Icon (top-left), metric value (large), label (small below), sparkline chart (if data), trend arrow
- Hover: Subtle lift transform, increased glow
- Size: min-height 120px, padding p-6

**Data Visualization**
- Donut Chart: Sentiment distribution with legend below, cyan/amber/gray color scheme
- Bar Chart: Horizontal bars for themes, responsive width, labeled values
- Sparklines: Minimal line charts in KPI cards, cyan stroke
- Charts adapt to RTL: flip x-axis direction

**Tables (Comments Explorer)**
- Sticky header, alternating row background (5% opacity difference)
- Expandable rows: Click to reveal full analysis panel
- Hover: Subtle cyan left border
- Columns: Compact with ellipsis overflow, full text on hover tooltip
- Actions: Copy button, filter chips, search bar

**Buttons & Interactions**
- Primary: Cyan background, white text, rounded-lg
- Secondary: Outline with cyan border, cyan text
- Ghost: No background, cyan text on hover
- Icon buttons: 40px square, rounded-full on hover
- Disabled: 40% opacity

**Forms & Inputs**
- Dark backgrounds with subtle border
- Focus state: Cyan border glow
- File upload: Drag-and-drop zone with dashed border
- Dropdown: Custom styled with smooth animations

**Modals & Overlays**
- Full analysis panel: Slide-in from right, glass blur backdrop
- Executive summary: Full-page overlay with print-optimized layout
- Settings: Modal centered, max-w-2xl

### E. Animations & Micro-interactions

**Framer Motion Patterns**
- Page transitions: Fade + slide up (0.3s ease-out)
- Card entry: Stagger children with 50ms delay
- Hover states: Scale 1.02, duration 0.2s
- Sparklines: Animated draw on mount
- Collapsible sections: Height animation with overflow hidden
- Loading states: Skeleton screens with shimmer effect

**Interaction States**
- Hover: Subtle elevation, border glow
- Active: Slight scale down (0.98)
- Focus: Cyan ring offset
- Disabled: Reduced opacity, no pointer events

---

## Dashboard Structure

### Main Dashboard Layout
1. **Top Bar** (fixed): Project title, date range picker, language toggle (EN/FR/AR), theme switcher
2. **Sidebar** (collapsible): Dashboard, Comments, Insights, Summary, Settings with icons
3. **KPI Grid** (row 1): 4 cards displaying key metrics with sparklines
4. **Sentiment Analysis** (row 2): Donut chart (left 40%), bar chart (right 60%)
5. **Themes Overview** (row 3): Horizontal bar chart, clickable to filter comments
6. **Comments Table** (row 4): Expandable table with all analyzed comments

### Comments Explorer
- Fast-loading table with virtual scrolling for performance
- Filter bar: Tone chips, theme dropdown, free text search
- Expandable rows reveal: Full sentiment breakdown, themes, questions, actionable insights
- Export button: CSV/JSON download

### Actionable Insights
- Checklist layout with checkboxes
- Strike-through animation on completion
- Categorized by priority (auto-detected from sentiment)
- Bulk export functionality

### Executive Summary
- Clean typography with max-w-prose for readability
- Auto-generated PDF export with charts embedded
- Print-optimized layout (hides UI chrome)

### Settings/Upload
- File upload zones for JSON data
- API configuration inputs
- Data reset with confirmation modal
- Sample dataset loader

---

## Accessibility & i18n

- WCAG 2.1 AA compliant contrast ratios
- Keyboard navigation: Tab order, focus indicators, escape to close
- Screen reader: ARIA labels on all interactive elements
- Language selector: Seamless switch between EN/FR/AR
- RTL layout: Auto-flip for Arabic (charts, navigation, text alignment)
- Reduced motion: Respect `prefers-reduced-motion` media query

---

## Visual Style Summary

**Aesthetic**: Cinematic minimalism with data clarity
- Glass morphism cards floating on dark backgrounds
- Subtle neon accents (cyan/amber) for emphasis
- Generous whitespace for breathing room
- Smooth, purposeful animations
- Typography-first hierarchy
- Premium feel through attention to micro-details

**Key Differentiators**
- Film/cinema-inspired dark theme (not generic dark mode)
- Bilingual/trilingual support with full RTL
- Data visualization optimized for sentiment analysis
- Professional analytics meets creative industry aesthetics