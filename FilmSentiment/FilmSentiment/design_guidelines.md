# Design Guidelines: Sentiment Analysis Dashboard

## Design Approach

**Selected Approach: Design System - Data Dashboard Pattern**

This is a utility-focused analytics dashboard requiring clarity, information density, and efficient data exploration. Drawing inspiration from modern analytics platforms like Linear's dashboard aesthetics combined with the data visualization best practices of tools like Datadog and Looker.

**Core Principles:**
1. Information hierarchy over decoration
2. Consistent data density across views
3. Scannable layouts with clear visual groupings
4. Accessibility-first, especially for RTL Arabic content

---

## Color Palette

### Dark Mode (Primary)
- **Background Layers:**
  - Primary surface: 222 15% 12%
  - Secondary surface: 222 15% 16% 
  - Elevated surface: 222 15% 20%
  - Border: 222 10% 25%

- **Brand Colors:**
  - Primary: 200 95% 55% (data visualization, CTAs)
  - Success: 142 76% 45% (positive sentiment)
  - Warning: 38 92% 55% (neutral/mixed sentiment)
  - Error: 0 72% 55% (negative sentiment - if needed)

- **Text:**
  - Primary: 0 0% 95%
  - Secondary: 0 0% 70%
  - Tertiary: 0 0% 50%

### Light Mode
- **Background Layers:**
  - Primary surface: 0 0% 100%
  - Secondary surface: 220 15% 97%
  - Elevated surface: 0 0% 100%
  - Border: 220 10% 88%

- **Brand Colors:** (Same hues, adjusted lightness)
  - Primary: 200 90% 50%
  - Success: 142 70% 42%
  - Warning: 38 85% 50%

- **Text:**
  - Primary: 222 20% 15%
  - Secondary: 222 15% 40%
  - Tertiary: 222 10% 55%

---

## Typography

**Font Families:**
- **Interface:** Inter (via Google Fonts) for Latin scripts
- **Arabic/RTL:** Noto Sans Arabic (via Google Fonts)
- **Data/Monospace:** JetBrains Mono for IDs, metrics

**Type Scale:**
- Display (Dashboard title): text-3xl font-semibold (30px)
- Heading 1 (Section titles): text-xl font-semibold (20px)
- Heading 2 (Card titles): text-base font-semibold (16px)
- Body (Default text): text-sm (14px)
- Small (Metadata, labels): text-xs (12px)
- Tiny (Captions): text-[11px]

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** consistently
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Card spacing: p-6
- Micro spacing: gap-2 or gap-4

**Grid Structure:**
- Dashboard layout: Sidebar (240px fixed) + Main content area
- KPI Cards: Grid with 4 columns on desktop (grid-cols-4), 2 on tablet (md:grid-cols-2), 1 on mobile
- Charts area: 2-column grid on desktop (grid-cols-2), stacked on mobile
- Comments table: Full-width with horizontal scroll on mobile

**Container Constraints:**
- Sidebar: w-60 (240px)
- Main content: max-w-[1600px] mx-auto
- Card max-width: Individual cards grow/shrink within grid

---

## Component Library

### Navigation
- **Top Navbar:**
  - Height: h-16
  - Film title (left), date range picker (center), user menu (right)
  - Background: bg-surface-elevated with bottom border
  
- **Sidebar:**
  - Collapsible (toggle icon top-right)
  - Navigation items with icons (Dashboard, Comments, Insights, Summary, Settings)
  - Active state: bg-primary/10 with left accent border (border-l-4 border-primary)
  - Hover: bg-surface-secondary

### Data Display

- **KPI Cards:**
  - White background in light mode, elevated surface in dark mode
  - Border: border border-border
  - Shadow: shadow-sm
  - Structure: Icon (top-left), Label (text-xs text-secondary), Value (text-2xl font-semibold), Optional sparkline/trend (bottom)
  - Padding: p-6
  - Rounded: rounded-lg

- **Charts:**
  - Container: bg-surface-elevated, border border-border, rounded-lg, p-6
  - Chart colors: Use primary (200 95% 55%), success (142 76% 45%), warning (38 92% 55%) for sentiment
  - Tooltips: Dark background with white text
  - Legend: Below chart, horizontal layout

- **Comments Table:**
  - Zebra striping: even:bg-surface-secondary
  - Header: sticky top-0, bg-surface-elevated, font-semibold text-xs uppercase tracking-wide
  - Cell padding: px-4 py-3
  - Expandable rows: Click to reveal full analysis (slide-down animation)
  - Row hover: bg-surface-secondary
  - Borders: border-b border-border

### Forms & Filters

- **Filter Bar:**
  - Sticky position below navbar
  - Background: bg-surface-secondary
  - Layout: Flex row with gap-4
  - Height: h-14
  - Dropdowns for sentiment/theme, search input (right-aligned)

- **Search Input:**
  - Height: h-9
  - Rounded: rounded-md
  - Border: border border-border focus:border-primary
  - Icon prefix: Search icon (left, text-tertiary)

- **Dropdown Select:**
  - Custom styled (not native select)
  - Height: h-9
  - Chevron icon indicator
  - Dropdown menu: Absolute positioned, max-h-60 overflow-y-auto

### Actions & Buttons

- **Primary Button:**
  - bg-primary text-white
  - Height: h-9 or h-10
  - Padding: px-4
  - Rounded: rounded-md
  - Hover: bg-primary/90

- **Secondary Button:**
  - border border-border bg-transparent
  - Height: h-9
  - Hover: bg-surface-secondary

- **Icon Buttons:**
  - Size: w-9 h-9
  - Rounded: rounded-md
  - Hover: bg-surface-secondary

### Overlays

- **Modal/Dialog:**
  - Backdrop: bg-black/50 backdrop-blur-sm
  - Content: bg-surface-elevated max-w-2xl rounded-lg shadow-xl
  - Padding: p-6
  - Close icon: top-right absolute

- **Tooltip:**
  - Small, dark background (bg-gray-900)
  - Text: text-white text-xs
  - Arrow pointer
  - Max-width: max-w-xs

---

## Animations & Interactions

**Use sparingly:**
- Sidebar collapse: transition-all duration-300
- Table row expand: height transition duration-200
- Hover states: transition-colors duration-150
- Chart data updates: Native Recharts animations (keep default)
- No page transitions, no scroll animations

---

## RTL Support

- Use `dir="rtl"` attribute on elements containing Arabic text
- Mirror layouts programmatically (flex-row-reverse for RTL)
- Padding/margins: Use logical properties (ps-4 instead of pl-4)
- Icons: Mirror directional icons (arrows, chevrons) in RTL
- Language toggle: Top-right of navbar (Globe icon + dropdown)

---

## Accessibility

- Color contrast: Ensure 4.5:1 minimum for all text
- Focus indicators: ring-2 ring-primary ring-offset-2 ring-offset-background
- Keyboard navigation: Full support for table, filters, modals
- Screen reader labels: aria-label for icon-only buttons
- Skip links: "Skip to content" link at top

---

## Data Visualization Guidelines

**Chart Color Mapping:**
- Positive sentiment: success color (142 76% 45%)
- Neutral sentiment: tertiary text color (0 0% 50%)
- Mixed sentiment: warning color (38 92% 55%)
- Negative sentiment: error color (0 72% 55%)

**Consistent Chart Styling:**
- Grid lines: Subtle, using border color at 30% opacity
- Axis labels: text-xs text-secondary
- Legend items: Horizontal, below chart, with color dots
- Tooltips: Always show on hover with formatted data

---

## Responsive Breakpoints

- Mobile: < 640px (stacked layout, collapsible sidebar becomes drawer)
- Tablet: 640px - 1024px (2-column KPIs, sidebar visible)
- Desktop: 1024px+ (4-column KPIs, full sidebar, 2-column charts)

---

## Special Notes

- **Export Buttons:** Always place in top-right of respective sections with download icon
- **Empty States:** Display friendly illustrations with text-secondary color and action prompt
- **Loading States:** Skeleton screens matching content structure (animated shimmer effect)
- **Error States:** Alert box with error color, icon, and retry action