# Analytics & Metrics UI Patterns

## Overview
Seller dashboards need to show key metrics, trends, and insights without overwhelming the user. These patterns are designed for quick scanning and decision-making. All charts are intentionally simple (no D3, no complex libraries) to ensure accessibility and fast load times.

## Metric Cards (KPIs)

### Layout
- **4-column grid** on desktop (1200px+)
- **2-column grid** on tablet (768px - 1024px)
- **1-column** on mobile (< 768px)
- Spacing: 16px gap between cards

### Structure
Each card contains:
1. **Label** (12px, uppercase, #64748B, 600-weight)
2. **Value** (36px bold, #1F2937)
3. **Change indicator** (12px, green ↑ for up, red ↓ for down, gray → for neutral)
4. **Optional trend %** (e.g., "+12% from last period")

### Examples
```
┌─────────────────────────┐
│ TOTAL REVENUE           │
│ $8,924                  │
│ ↑ 12% from last period  │
└─────────────────────────┘

┌─────────────────────────┐
│ TOTAL ORDERS            │
│ 47                      │
│ ↑ 8% from last period   │
└─────────────────────────┘
```

### Color Usage
- Label: `#64748B` (slate-600)
- Value: `#1F2937` (slate-900)
- Up trend: `#10B981` (green-600)
- Down trend: `#F43F5E` (red-600)
- Neutral: `#64748B` (slate-600)

---

## Charts

### Bar Chart (Revenue by Day)
- **Use case**: Daily revenue, order count over time
- **X-axis**: Day labels (Day 1, Day 2, ..., or date like May 15)
- **Y-axis**: Value (hidden, readable from bar height)
- **Bar width**: responsive to container width (min 30px, max 60px)
- **Color**: `#3B4C63` (slate-800 primary)
- **Value labels**: Show on top of bar in 12px font
- **Hover**: Light highlight (bg lighten by 10%)

### Example Structure
```html
<div class="chart-container">
  <div class="bar" style="height: 45%;">
    <div class="bar-value">$240</div>
    <div class="bar-label">Day 1</div>
  </div>
  <!-- more bars -->
</div>
```

### Line Chart (Alternative: Revenue Trend)
- **Use case**: Multi-week or monthly trends
- **Dots**: 6-8px circles at data points, `#10B981` when above average, `#F43F5E` when below
- **Line**: 2px stroke, color `#3B4C63`
- **Fill area**: Optional light gradient (10% opacity)
- **Grid lines**: Optional, very light (E2E8F0)

---

## Data Tables

### Table Headers
- **Background**: `#F9FAFB` (slate-50)
- **Text**: 12px, 600-weight, `#64748B`, uppercase
- **Border-bottom**: 1px `#E2E8F0`
- **Padding**: 12px 24px

### Table Rows
- **Background**: white
- **Text**: 14px, `#1F2937`
- **Border-bottom**: 1px `#F3F4F6` (very light)
- **Padding**: 16px 24px
- **Hover**: `#F9FAFB` background

### Badge Styles (Status)
- **Pending**: Blue badge (#DBEAFE bg, #1E40AF text)
- **Paid**: Green badge (#DCFCE7 bg, #15803D text)
- **In Progress**: Amber badge (#FEF3C7 bg, #92400E text)
- **Shipped**: Purple badge (#E9D5FF bg, #6B21A8 text)
- **Delivered**: Green badge (#DCFCE7 bg, #15803D text)

---

## Time Range Selector

### Pattern
- Dropdown or button group (preferred: dropdown for space)
- Options: "Last 7 days", "Last 30 days", "Last 90 days", "This year", "All time"
- Default: "Last 30 days"
- Location: Header right, next to page title

### HTML
```html
<select class="date-range">
  <option selected>Last 30 days</option>
  <option>Last 90 days</option>
  <option>This year</option>
  <option>All time</option>
</select>
```

---

## Empty States

### No Data Yet
```
┌─────────────────────────────────┐
│                                 │
│         📊                      │
│   No orders yet                 │
│   Come back when your first     │
│   order arrives.                │
│                                 │
└─────────────────────────────────┘
```

- **Icon**: 48px, centered
- **Heading**: 18px, 600-weight, centered
- **Text**: 14px, `#64748B`, centered, max 40 chars
- **Background**: `#F9FAFB`
- **Padding**: 48px 24px

---

## Alerts & Warnings

### Info Alert (Top of Dashboard)
```
┌────────────────────────────────────┐
│ 💡 Your shop is live! Customers    │
│    can visit it at                 │
│    soloshop.com/shop/artisan-studio│
└────────────────────────────────────┘
```

- **Background**: `#F0F9FF` (blue-50)
- **Border**: 1px `#BAE6FD` (blue-200)
- **Text**: 13px, `#0369A1` (blue-700)
- **Icon**: 18px emoji or icon, left-aligned
- **Padding**: 12px 16px

### Warning Alert (Low Inventory)
- **Background**: `#FEF3C7` (amber-50)
- **Border**: 1px `#F59E0B` (amber-400)
- **Text**: 13px, `#92400E` (amber-900)
- **Icon**: ⚠️

---

## Layout Patterns

### Two-Column Layout (Analytics Page)
```
┌─────────────────────────────────────────────────────────┐
│ Full-width header (Revenue Chart)                       │
├─────────────────────────┬─────────────────────────────┤
│ Left (50%):             │ Right (50%):                │
│ Top Products Table      │ Order Status Summary        │
├─────────────────────────┴─────────────────────────────┤
│ Full-width: Recent Orders Table                        │
└─────────────────────────────────────────────────────────┘
```

- **Gap**: 24px between columns
- **Tablet (< 1024px)**: Stack to single column
- **Mobile (< 768px)**: Full width, padding 16px

---

## Mobile Responsiveness

### Metric Cards
- Desktop: 4 columns → Tablet: 2 columns → Mobile: 1 column
- Font sizes reduce: 36px → 24px on mobile

### Charts
- **Height**: 300px on desktop, 200px on tablet, 200px on mobile
- **Bar width**: Adjusts to fit container
- **Labels**: Rotate 45° on mobile if needed to prevent overlap

### Tables
- **Horizontal scroll** on mobile (< 768px) with sticky left column
- **Font size**: 12px on mobile
- **Padding**: 8px 12px on mobile

---

## Accessibility

### WCAG 2.1 AA Compliance
1. **Color contrast**: All text meets 4.5:1 ratio
   - `#1F2937` on white: ✅ 15:1
   - `#64748B` on white: ✅ 5.2:1
   - Badge text on colored bg: verified per badge type

2. **Semantic HTML**:
   - Use `<table>` with `<thead>` and `<tbody>`
   - Use `<label>` for form fields
   - Use `<button>` for interactive elements

3. **ARIA Labels**:
   - Chart containers: `role="img"` + `aria-label="Daily revenue chart for May 2026"`
   - Metric values: `aria-label="Total revenue: $8,924"`
   - Status badges: `aria-label="Order status: Shipped"`

4. **Focus States**:
   - All interactive elements have visible focus ring: `outline: 2px solid #3B4C63; outline-offset: 2px;`
   - Tab order: logical (left-to-right, top-to-bottom)

5. **Motion**:
   - Transitions: `all 0.2s ease` (not > 0.3s to avoid dizziness)
   - No auto-playing animations
   - Respect `prefers-reduced-motion` media query

---

## Performance Notes

### Chart Rendering
- Do NOT use D3.js or Chart.js (overkill for these simple charts)
- Use CSS Flexbox + inline SVG for bars (< 50 lines of SVG)
- Or pure HTML/CSS with height % and CSS gradients
- Goal: < 100ms render time

### Data Loading
- Show skeleton loaders (gray bars, animated opacity) while data loads
- Lazy-load tables (show first 10 rows, infinite scroll or pagination)
- Display "Updated X minutes ago" timestamp

---

## Examples in Production

See these files for implemented examples:
- `design/pages/analytics-dashboard.html` — Full analytics page with all patterns
- `design/system/components.html` — Reusable metric card + badge components
- `design/pages/dashboard-nav-enhanced.html` — Dashboard with quick-access cards

