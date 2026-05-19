# Component Library Checklist — Engineer Reference

**Last Updated:** Day 78  
**Status:** Production-Ready  
**Version:** 1.0 (MVP)

---

## Overview

This checklist maps every UI component to its design reference and implementation guidance. Use this when building React components — each row is a component you need to implement. ✅ = ready to build, ⏳ = coming in Stage 1+.

---

## Buttons

| Component | Variants | Size Options | States | Design Ref | Notes |
|---|---|---|---|---|---|
| Button (Primary) | ✅ | sm, md, lg | normal, hover, disabled, loading, focus | components.html | Emerald bg, white text. Always has visible focus outline. |
| Button (Secondary) | ✅ | sm, md, lg | normal, hover, disabled, focus | components.html | White bg, slate blue text, border. |
| Button (Ghost) | ✅ | sm, md, lg | normal, hover, disabled, focus | components.html | Transparent bg, text only. Lightest visual weight. |
| Button (Danger) | ✅ | sm, md, lg | normal, hover, disabled, focus | components.html | Rose bg, white text. Use for delete/destructive actions only. |
| Button (Loading) | ✅ | md | spinner state | components.html | Disabled + spinner icon inside button. |
| Icon Button | ⏳ | sm, md, lg | normal, hover, focus | — | Stage 1: compact button for icons only (e.g., hamburger, close). |

### Props for Button Component

```tsx
<Button
  variant="primary" | "secondary" | "ghost" | "danger" // default: primary
  size="sm" | "md" | "lg" // default: md
  disabled={boolean}
  loading={boolean} // shows spinner, disables click
  className={string} // for Tailwind overrides
  onClick={handler}
  children={ReactNode}
/>
```

---

## Forms & Inputs

| Component | Type | States | Design Ref | Notes |
|---|---|---|---|---|
| Text Input | text | empty, focused, filled, error, disabled | components.html | 12px border, focus box-shadow. |
| Email Input | email | empty, focused, filled, error, disabled | components.html | Native HTML5 validation support. |
| Password Input | password | empty, focused, filled, error, disabled | components.html | Show/hide toggle optional (Stage 1). |
| Textarea | — | empty, focused, filled, error, disabled | components.html | Min height 120px. Resizable. |
| Select / Dropdown | — | empty, focused, selected, disabled | components.html | Custom styling to match Input. |
| Checkbox | — | unchecked, checked, indeterminate, disabled, focus | components.html | 18px × 18px. Used in bulk-select tables. |
| Radio Button | — | unselected, selected, disabled, focus | components.html | 18px × 18px. Group related radios. |
| File Input (Image) | file | empty, focused, error, preview | components.html | Drag-drop zone with icon. Shows image preview after upload. |
| Toggle Switch | — | off, on, disabled | — | ⏳ Stage 1 feature (e.g., "pause shop"). |
| Date Picker | — | empty, focused, selected, disabled | — | ⏳ Stage 1 (for filtering, scheduling). |

### Props for FormField Component

```tsx
<FormField
  label="Field Label" // required
  id="field-id" // optional, auto-generated if omitted
  type="text" | "email" | "password" | "textarea" | "select" // default: text
  value={string} // for controlled inputs
  onChange={handler}
  placeholder="..."
  required={boolean}
  disabled={boolean}
  error="Error message" // if present, field shows error styling
  helpText="Help text" // appears below input
  fullWidth={boolean} // default: true
  className={string}
/>
```

### Input Validation Rules (from day-62/design.md)

- **Email:** must match `/.+@.+\..+/`
- **Password:** ≥ 12 characters (enforced on password inputs)
- **URL:** must start with http:// or https://
- **Phone:** optional but if provided, must be 10–15 digits
- **Required fields:** show `*` after label

---

## Cards

| Component | Variants | States | Design Ref | Notes |
|---|---|---|---|---|
| Card (Default) | ✅ | normal, hover | components.html | White bg, subtle border, no shadow. |
| Card (Elevated) | ✅ | normal, hover | components.html | White bg, elevated shadow for emphasis. |
| Card (Interactive) | ✅ | normal, hover | components.html | Hover lifts card 2px, shadow grows. |
| Product Card | ✅ | normal, hover, out-of-stock | product-detail.html, product-list.html | Image + title + price + rating + stock badge. |
| Order Card | ✅ | normal, clickable | orders-list.html, dashboard.html | Order ID + customer + total + status + actions. |
| Stat Card | ✅ | normal | dashboard.html | Large number + small label. Used in dashboard metrics. |

### Props for Card Component

```tsx
<Card
  variant="default" | "elevated" | "interactive" // default: default
  padding="none" | "sm" | "md" | "lg" // default: md
  className={string}
  onClick={handler} // if interactive
  children={ReactNode}
/>
```

---

## Tables

| Component | Features | Design Ref | Notes |
|---|---|---|---|
| Table (Basic) | headers, rows, alternating row bg | components.html | Sortable headers (optional, Stage 1). |
| Table (with Checkboxes) | bulk select, select-all header | dashboard.html | Checkbox in first column for each row. "Select all on this page" in header. |
| Table (Responsive) | stacks to card layout on mobile | — | Stage 1: convert rows to cards on < 768px. |
| Pagination | prev/next buttons, page numbers | — | ⏳ Stage 1 (for large order/product lists). |

### Props for Table Component

```tsx
<Table
  columns={[{ label: "Name", key: "name", sortable: true }, ...]}
  data={[{ name: "...", ... }, ...]}
  onSort={handler} // sortable columns
  onRowClick={handler} // optional
  selectable={boolean} // shows checkboxes
  className={string}
/>
```

---

## Modals & Dialogs

| Component | Type | Design Ref | Notes |
|---|---|---|---|
| Confirmation Modal | — | components.html, order-detail.html | Title + message + "Cancel" + action button. Backdrop overlay. |
| Alert Modal (Success) | — | components.html | Icon + title + message + "OK" button. Green. |
| Alert Modal (Error) | — | components.html | Icon + title + message + "Retry" button. Red. |
| Form Modal | — | — | Modal containing a form (e.g., "Add Product"). ⏳ |
| Inline Dialog | — | — | Smaller popup (not full-viewport). ⏳ Stage 1. |

### Props for Modal Component

```tsx
<Modal
  isOpen={boolean}
  onClose={handler}
  title="Modal Title"
  size="sm" | "md" | "lg" // default: md
  children={ReactNode}
/>
```

---

## Badges & Status Indicators

| Component | Variants | Design Ref | Notes |
|---|---|---|---|
| Badge (Success) | green | components.html | "Paid", "Shipped", "Delivered" |
| Badge (Pending) | amber | components.html | "In Progress", "Pending", "Processing" |
| Badge (Error) | red | components.html | "Failed", "Error", "Canceled" |
| Status Dropdown | — | dashboard.html | Inline `<select>` for order status changes. |
| Stock Badge | green/amber/red | product-list.html | "In Stock" / "Low Stock" / "Out of Stock" |

### Props for Badge Component

```tsx
<Badge
  variant="success" | "pending" | "error" | "warning"
  children="Paid" // text
  className={string}
/>
```

---

## Navigation & Headers

| Component | Type | Design Ref | Notes |
|---|---|---|---|
| Sidebar Navigation | ✅ | dashboard.html | Fixed left, 240px wide (180px on tablet). Active link highlighted. |
| Header Bar | ✅ | dashboard.html | Fixed top, title + action buttons. Responsive layout. |
| Breadcrumb | — | — | ⏳ Stage 1 (for deep pages like /products/{id}/edit). |
| Tabs | — | — | ⏳ Stage 1 (for grouped content, e.g., product details vs. reviews). |
| Dropdown Menu | — | components.html | Context menu (⋮ More Actions). Hover-activated. |

---

## Empty & Loading States

| Component | Type | Design Ref | Notes |
|---|---|---|---|
| Empty State | — | empty.html, components.html | Icon + title + subtitle + CTA button. |
| Loading Spinner | — | components.html | Animated circle. Used inline or as button state. |
| Loading Page | — | loading.html | Full-page spinner. Skeleton screens (Stage 1). |
| Error Page | — | error.html | Icon + title + message + "Back" button. |
| 404 Page | — | 404.html | Friendly "not found" page with home link. |

---

## Alerts & Toasts

| Component | Type | Design Ref | Behavior |
|---|---|---|---|
| Toast (Success) | — | components.html | Green left border, auto-dismiss after 4s. |
| Toast (Error) | — | components.html | Red left border, persist until dismissed. |
| Toast (Info) | — | — | ⏳ Blue left border. |
| Inline Alert | — | — | ⏳ Page-level warning/error box (e.g., "Check your connection"). |
| Banner | — | — | ⏳ Top-of-page alert (e.g., "Maintenance scheduled"). |

---

## Category Filter

| Component | Variants | Design Ref | Notes |
|---|---|---|---|
| Filter (Pill Tags) | ✅ | category-filter.html | Horizontal pills: "All Products", "Handmade", "Vintage", "Supplies". One active at a time. |
| Filter (Dropdown) | ✅ | category-filter.html | Compact select for small screens. |
| Filter (Checkbox List) | ⏳ | — | Stage 1: multi-select filter (e.g., multiple categories at once). |
| Price Range Slider | ⏳ | — | Stage 1: customer-facing. |
| Search Box | ✅ | storefront.html | Text input for product search. |

---

## Miscellaneous Components

| Component | Type | Design Ref | Notes |
|---|---|---|---|
| Avatar | — | — | ⏳ Stage 1 (seller profile, messaging). 44px circle. |
| Link / Hyperlink | — | components.html | Slate blue (#3B4C63), underline on hover. |
| Icon | — | — | Simple SVG icons (no external icon library, keep it minimal). ⏳ |
| Divider | — | components.html | Light gray horizontal line (1px). |
| Tag / Chip | ⏳ | — | Stage 1 (for order tagging, product tags). |
| Progress Bar | ⏳ | — | Stage 1 (upload progress, page load). |
| Tooltip | ⏳ | — | Stage 1 (hover for more info). |

---

## Typography Components

| Component | Usage | Design Ref | Notes |
|---|---|---|---|
| Heading H1 | Page title | brand.md | 48px, bold, margin below. |
| Heading H2 | Section title | brand.md | 36px, bold. |
| Heading H3 | Subsection | brand.md | 28px, semi-bold. |
| Heading H4 | Card title | brand.md | 20px, semi-bold. |
| Paragraph | Body text | brand.md | 16px, regular, line-height 1.6. |
| Small Text | Caption, label, help | brand.md | 14px or 12px depending on context. |
| Code / Monospace | Technical text | — | Optional: use `<code>` or `font-family: monospace` for API docs, tracking IDs. |

---

## Spacing & Layout Helpers

| Helper | Value | Usage |
|---|---|---|
| Padding (xs) | 4px | Tight spacing between elements |
| Padding (sm) | 8px | Form field padding |
| Padding (md) | 16px | Default card padding, standard gaps |
| Padding (lg) | 24px | Section spacing |
| Padding (xl) | 32px | Large gaps, hero sections |
| Padding (2xl) | 48px | Page-level spacing |
| Margin | Same grid | Use padding instead where possible to avoid margin collapse |
| Gap (flex/grid) | 8px, 16px, 24px | Consistent spacing in flex/grid containers |

---

## Responsive Behavior

All components should adapt to three breakpoints:

| Breakpoint | Width | Sidebar | Columns | Touch Targets |
|---|---|---|---|---|
| Mobile | < 768px | Hidden (hamburger or none) | 1 | ≥ 44px |
| Tablet | 768–1024px | Collapse to 180px | 1–2 | ≥ 44px |
| Desktop | ≥ 1024px | 240px | 2–3 | ≥ 44px |

---

## Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Ready now (built or can be built from components.html) |
| ⏳ | Coming in Stage 1 or later |
| — | Not applicable or design TBD |

---

## Building from This Checklist

1. Start with **Button, FormField, Card** — these three unlock 70% of the UI.
2. Then build **Modal, Table, Badge** — handle information-heavy layouts.
3. Then add **Navigation, Header, Sidebar** — structure the app.
4. Fill in **specialized components** as pages need them (Avatar, Tag, Tooltip in Stage 1).
5. Test **all states** — focus, hover, disabled, loading, error, empty.

**All components must:** Have visible focus states (for accessibility), support className for Tailwind overrides, and follow the spacing grid defined in design/system/spacing.md.

---

Last updated by Chiara (Designer), Cycle 142, Day 78.
