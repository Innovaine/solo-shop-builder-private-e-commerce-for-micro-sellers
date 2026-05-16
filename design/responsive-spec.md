# Responsive Design Specification — Solo Shop Builder MVP

**Designer:** Chiara  
**Date:** Day 26  
**Status:** MVP Responsive Spec Complete  

---

## Overview
All design/pages/*.html files are mobile-first, with three tiers: mobile (< 768px), tablet (768px–1024px), and desktop (≥ 1024px). This document specifies the breakpoints, grid changes, and layout shifts at each tier.

---

## Breakpoints & Media Queries

### Mobile: < 768px (Default)
- **Default state:** all design files build from here
- **Primary layout:** single column, full-width
- **Sidebar navigation:** collapsible (hamburger menu) or hidden below header
- **Touch targets:** 44px × 44px minimum
- **Grid columns:** 1
- **Font sizes:** reduced (headings 20–24px, body 14px)

### Tablet: 768px – 1024px
- **Layout shift:** sidebar narrows to 180px, content adjusts
- **Grid columns:** 2 for cards and product grids
- **Forms:** side-by-side labels + inputs where space allows
- **Tables:** may scroll horizontally if too many columns
- **Sidebar visible:** toggleable or always-visible depending on page

### Desktop: ≥ 1024px (Production Mode)
- **Full layout:** sidebar fixed (240px), main content full-width
- **Grid columns:** 3 for cards, product grids, stat cards
- **Forms:** comfortable spacing, no cramping
- **Tables:** full visibility without scroll
- **Modals:** centered, 400–600px max-width

---

## Component-by-Component Breakpoints

### Dashboard (design/pages/dashboard.html)

**Mobile (< 768px):**
```css
.sidebar {
  width: 180px;
  padding: 16px;
}
header {
  left: 180px;
  padding: 0 16px;
}
main {
  margin-left: 180px;
  margin-top: 64px;
  padding: 16px;
}
.stat-grid {
  grid-template-columns: 1fr;
}
.page-title {
  font-size: 20px;
}
```
- Sidebar narrows, text compressed
- Header height stays 64px
- Stats stack vertically (1 column)
- Tables may scroll

**Tablet (768px–1024px):**
- Sidebar 200px
- Stat grid: `grid-template-columns: repeat(2, 1fr);` (2 columns)
- Header padding: 16px

**Desktop (≥ 1024px):**
- Sidebar 240px
- Stat grid: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` (3–4 columns)
- Main padding: 32px
- Full tables visible

---

### Product List (design/pages/product-list.html)

**Mobile (< 768px):**
```css
.container {
  padding: 16px;
}
.header {
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.filters {
  flex-direction: column;
}
.filter-group {
  width: 100%;
}
input[type="search"] {
  width: 100%;
  min-width: unset;
}
table {
  font-size: 12px;
}
th, td {
  padding: 12px;
}
```
- H1 stacks above button
- Filters stack vertically
- Table font reduced, columns compressed
- Horizontal scroll if needed

**Tablet (768px–1024px):**
- Filters: 2-column layout (search + category side-by-side)
- Table: show 4–5 columns, hide "Created" date if space tight
- Buttons: full width in mobile, normal width in tablet

**Desktop (≥ 1024px):**
- Filters: inline (search, category, sort all on one row)
- Table: full 6 columns visible, no scroll
- Container max-width: 1200px

---

### Login / Auth Pages (design/pages/login.html, signup.html)

**All Breakpoints:**
- Auth container: max-width 420px (centered)
- Stays centered on all widths
- Form fields: 100% width of container
- Mobile padding: 32px 24px
- Tablet/Desktop padding: 48px 32px
- Never exceeds 420px (centered on large screens)

---

### Checkout (design/pages/checkout.html)

**Mobile (< 768px):**
```css
.checkout-container {
  grid-template-columns: 1fr;
  /* Cart on top, form below */
}
.cart-summary {
  order: -1; /* Cart appears above form on mobile */
  border-bottom: 1px solid #E2E8F0;
  padding-bottom: 24px;
}
.checkout-form {
  padding-top: 24px;
}
```
- Single column: cart summary, then form fields
- Full-width form inputs
- Sticky footer: "Proceed to Checkout" button (44px min height)

**Tablet (768px–1024px):**
```css
.checkout-container {
  grid-template-columns: 1fr 350px;
  gap: 24px;
}
```
- Two columns: form (left), cart summary (right, sticky)
- Form inputs: normal width
- Cart summary: fixed 350px width, scrolls independently if tall

**Desktop (≥ 1024px):**
- Same layout as tablet
- Form max-width: 500px
- Cart summary: 400px fixed
- Container max-width: 1200px, centered

---

### Order Detail / Tracking (design/pages/order-detail.html, order-tracking.html)

**Mobile (< 768px):**
```css
.order-container {
  display: block; /* single column */
}
.order-header {
  grid-template-columns: 1fr;
}
.order-items {
  grid-template-columns: 1fr;
}
.timeline {
  font-size: 14px;
  padding-left: 16px;
}
```
- Single column layout
- Order summary stacks vertically
- Items list: 1 per row (card style)
- Timeline: left-aligned

**Tablet (768px–1024px):**
- Order summary: 2 columns (left/right)
- Items: 2 per row
- Timeline: centered, vertical line in middle

**Desktop (≥ 1024px):**
- Order summary: 3–4 columns
- Items: 3 per row
- Timeline: full width with status indicators spaced
- Max-width: 1200px

---

### Forms (Input Fields, Text Areas, Selects)

**All Breakpoints:**
```css
input, select, textarea {
  font-size: 16px; /* prevent auto-zoom on mobile */
  padding: 12px 16px;
  border-radius: 6px;
}
/* Mobile: full width unless in grid */
.form-field {
  width: 100%;
}
/* Tablet+: can sit side-by-side */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```
- Input font ≥ 16px (prevents iOS auto-zoom on input focus)
- Padding: 12px 16px (comfortable for touch)
- Label + input stack on mobile, can sit side-by-side on tablet+

---

### Tables (Product List, Orders, etc.)

**Mobile (< 768px):**
```css
.table-wrapper {
  overflow-x: auto; /* horizontal scroll */
}
table {
  font-size: 12px;
  min-width: 600px; /* forces scroll container to work */
}
/* Hide least important columns */
th:nth-child(5),
td:nth-child(5) {
  display: none; /* hide "Created" date */
}
```
- Horizontal scroll for narrow tables
- Compress font size
- Hide 1–2 columns
- Maintain th/td semantic structure (don't convert to cards)

**Tablet (768px–1024px):**
```css
/* Show 1–2 more columns */
th:nth-child(5),
td:nth-child(5) {
  display: table-cell; /* show "Created" */
}
th, td {
  padding: 12px;
}
```

**Desktop (≥ 1024px):**
```css
/* Show all columns */
th, td {
  padding: 16px;
}
font-size: 14px;
```

---

### Modals / Dialogs

**Mobile (< 768px):**
```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end; /* bottom sheet style */
  z-index: 1000;
}
.modal-content {
  width: 100%;
  max-height: 80vh;
  border-radius: 16px 16px 0 0;
  padding: 24px 16px;
  animation: slideUp 0.3s ease-out;
}
```
- Full viewport backdrop
- Bottom sheet style (slides up from bottom)
- 80% of viewport height
- Padding for thumb access

**Tablet (768px–1024px):**
```css
.modal-content {
  width: 90%;
  max-width: 600px;
  margin: auto;
  border-radius: 8px;
}
```
- Centered, 90% width or 600px (whichever is smaller)

**Desktop (≥ 1024px):**
```css
.modal-content {
  width: 600px;
  max-width: none;
  border-radius: 8px;
}
```
- Fixed 600px width, centered

---

### Sidebar / Navigation

**Mobile (< 768px):**
```css
.sidebar {
  position: absolute;
  width: 100%;
  height: auto;
  border-right: none;
  border-bottom: 1px solid #E2E8F0;
  display: none; /* hidden by default */
}
.sidebar.open {
  display: block; /* shown on hamburger click */
  z-index: 999;
}
.menu-toggle {
  display: block; /* hamburger icon visible */
}
```
- Hidden by default
- Full-width overlay when opened
- Hamburger menu visible in header
- Escape key / backdrop click closes

**Tablet (768px–1024px):**
```css
.sidebar {
  position: fixed;
  width: 180px;
  display: block; /* always visible */
}
.menu-toggle {
  display: none; /* hamburger hidden */
}
```
- Fixed sidebar visible
- Narrower (180px)

**Desktop (≥ 1024px):**
```css
.sidebar {
  width: 240px;
}
```
- Full-width sidebar visible

---

## Print Styles (Bonus)

```css
@media print {
  .sidebar, header, .header-actions, .pagination, .filters {
    display: none;
  }
  main {
    margin-left: 0;
    margin-top: 0;
    padding: 0;
  }
  body {
    background: white;
    color: black;
  }
  /* Ensure high contrast for printing */
  a {
    color: #0000EE;
    text-decoration: underline;
  }
}
```
- Hide navigation, headers, pagination when printing
- Restore white background, black text
- Links underlined and blue for clarity

---

## Testing Checklist

### Mobile (320px width)
- [ ] All buttons ≥ 44px height
- [ ] Text readable without zoom
- [ ] Forms stack vertically
- [ ] Tables scroll horizontally or hide columns
- [ ] Sidebar hidden by default (hamburger menu)
- [ ] Modals are bottom-sheet style

### Tablet (768px width)
- [ ] Sidebar visible, 180px wide
- [ ] 2-column grid layouts appear
- [ ] Header takes full width above sidebar
- [ ] Forms can go side-by-side
- [ ] Tables show 4–5 columns

### Desktop (1024px+ width)
- [ ] Sidebar 240px fixed
- [ ] 3-column grids appear
- [ ] Modals centered, max-width 600px
- [ ] Tables full width, no horizontal scroll
- [ ] Container max-width 1200px on wide screens

### Orientation (Mobile)
- [ ] Portrait (320×568): single column, full-width buttons
- [ ] Landscape (568×320): sidebar may hide, main content spans

---

## CSS Mixin Pattern (for engineer)

```css
@media (max-width: 767px) {
  /* Mobile styles here */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet styles here */
}

@media (min-width: 1024px) {
  /* Desktop styles here */
}
```

Use these breakpoints in React Tailwind:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## What NOT to Do

❌ **Desktop-first approach** — start with 3-column layout, break it down
✓ **Mobile-first approach** — start with 1-column, layer up

❌ **Fixed widths** — `width: 800px` breaks on all phones
✓ **Fluid widths** — `width: 100%; max-width: 1200px;`

❌ **Table cards on mobile** — converting th/td to divs breaks semantic meaning
✓ **Horizontal scroll** — keep table structure, let it scroll

❌ **Hiding form labels** — saves space but breaks accessibility
✓ **Stacking form labels** — label on top of input, always visible

❌ **Touch targets < 44px** — hard to tap on mobile
✓ **44px × 44px buttons** — comfortable touch target

---

**Reference files updated:**
- design/pages/dashboard.html
- design/pages/product-list.html
- design/pages/login.html
- design/pages/signup.html
- design/pages/checkout.html
- design/pages/order-detail.html
- design/pages/order-tracking.html
- All other design/pages/*.html files

**Next step for engineer:** Test responsive behavior at 320px, 768px, and 1024px. Use Chrome DevTools responsive mode or actual devices.
