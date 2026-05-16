# Mobile Design Patterns — Solo Shop Builder

## Overview
This document specifies mobile-first interaction patterns and responsive breakpoints for Solo Shop Builder. All pages must follow these patterns to ensure consistent mobile UX across the app.

## Responsive Breakpoints

| Device | Viewport Width | Use Case | Layout |
|--------|---|---|---|
| **Mobile** | < 768px | Phones (portrait + landscape) | Single column, full-width forms, stacked cards |
| **Tablet** | 768px – 1024px | iPads, larger phones | 2-column grid where sensible, larger touch targets |
| **Desktop** | ≥ 1024px | Laptops, monitors | 3-column layout, sidebar navigation |

## Mobile-Specific Patterns

### Navigation
- **Bottom Tab Bar** — Primary navigation at bottom (Orders, Products, Settings) for thumb-reach accessibility
- **Hamburger Menu** — Secondary nav items hidden in off-canvas drawer, triggered by menu button
- **Close Drawer** — Nav drawer closes when user taps a link or taps outside
- **Persistent Bottom Bar** — 60px height (includes safe-area-inset-bottom for notched devices)
- **No Sidebar** — Desktop sidebar removed completely on mobile; use bottom nav instead

### Touch Targets
- **Minimum Size** — All interactive elements ≥ 44px × 44px (WCAG 2.1 AA requirement)
- **Spacing** — 8px padding between adjacent touch targets to prevent mis-taps
- **Visual Feedback** — Active state (color change, highlight) on all tappable elements
- **No Hover States** — Mobile has no hover; use active/pressed states instead

### Forms
- **Input Height** — Text inputs, selects, buttons all 44px+ tall (not just 12px padding)
- **Full Width** — All form fields stretch to container width (with 16px padding on sides)
- **Stacked Labels** — Label above input, not inline, for clarity
- **Large Placeholders** — 14px+ font size for clarity on small screens
- **Clear Errors** — Error text in red, below field, 12px+ font (not tiny)
- **Keyboard Handling** — Use `inputmode` (e.g., `inputmode="email"` for email fields) to show correct mobile keyboard

### Cards & Lists
- **Horizontal Scrolling Avoided** — All content fits within viewport width
- **Vertical Stacking** — Cards, product tiles, order items all stack vertically (no columns)
- **Tap Area** — Entire card is tappable (≥44px tall) for easy tap
- **Dividers** — Use 1px border-bottom between list items instead of visual separation

### Headers
- **Fixed Top Bar** — Header always visible, 56px tall, stays fixed during scroll
- **Logo/Title** — Center-aligned or left-aligned (28px max width on left)
- **Action Buttons** — Max 2 buttons in header (right-aligned), each ≥44px
- **No Search Bar in Header** — Search moved to dedicated search screen or modal

### Modals
- **Full Viewport** — Modals cover entire screen on mobile (no centered floating box)
- **Close Button** — Top-right close icon, ≥44px touch target
- **Safe Area** — Content starts below status bar (use `padding-top: env(safe-area-inset-top)`)
- **Scroll within Modal** — If content > viewport height, modal scrolls internally

### Empty States
- **Centered Content** — Icon, title, text, CTA all centered
- **Large Icon** — 40–48px emoji or icon
- **Clear CTA** — Primary action button, full width on mobile, ≤200px on tablet/desktop

### Tables & Data
- **No Horizontal Scroll** — Tables must fit within 100vw on mobile
- **Collapsed Rows** — Show only 2–3 key columns on mobile (Order ID, Status, Total)
- **Tap to Expand** — Additional columns visible in detail view or modal
- **Sticky Headers** — Table header remains visible during vertical scroll

## Safe Area & Notch Handling

### iOS Notch / Android Dynamic Island
- Use CSS `env(safe-area-inset-*)` values:
  - `padding-top: env(safe-area-inset-top)` for fixed headers
  - `padding-bottom: env(safe-area-inset-bottom)` for fixed bottom nav
  - `padding-left: env(safe-area-inset-left)` and `padding-right` for side notches

### Example:
```css
header {
  padding-top: env(safe-area-inset-top);
  height: calc(56px + env(safe-area-inset-top));
}
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(60px + env(safe-area-inset-bottom));
}
```

## Spacing Scale (Mobile-First)

| Token | Value | Use |
|-------|-------|-----|
| **xs** | 4px | Micro-spacing (icon + text) |
| **sm** | 8px | Small gaps (form inputs, button padding) |
| **md** | 16px | Default padding, section spacing |
| **lg** | 24px | Large gaps, section breaks |
| **xl** | 32px | Hero spacing (rarely used on mobile) |

**Mobile Container Padding:** Always 16px on left/right for mobile (< 768px).

## Typography on Mobile

| Element | Desktop | Mobile | Line-Height |
|---------|---------|--------|-------------|
| H1 | 48px | 28px | 1.2 |
| H2 | 36px | 24px | 1.3 |
| H3 | 28px | 20px | 1.4 |
| Body | 16px | 14px | 1.6 |
| Small | 14px | 12px | 1.5 |

**Rationale:** Smaller text on mobile prevents giant headings eating up screen space, while maintaining readability.

## Color Contrast on Mobile
- **Text on Background** — Maintain 4.5:1 contrast ratio (WCAG AA)
- **Focus Indicators** — 2px solid outline in #3B4C63 (slate blue)
- **No Color-Only Indicators** — Use icon + color for status (e.g., ✓ + green, not green alone)

## Loading & Skeleton States

### Skeleton Screens (Preferred over spinners)
- Show placeholder gray boxes matching the card/row layout
- Animate with subtle pulse (0.5s opacity fade, repeat)
- Replace with real content when loaded

### Spinners (If used)
- Center-aligned, 16px diameter
- Color: #3B4C63 (slate blue)
- Rotate 360° in 0.8s loop

## Landscape Mode (Mobile)

### Considerations
- **Viewport Height** — Typically 300–500px in landscape
- **Navigation** — Bottom nav remains visible; no collapsing
- **Forms** — Labels + inputs may need 2-column layout to save height
- **Images** — Product images capped at 60vh to avoid crowding
- **Tables** — Show more columns in landscape if space allows

### Example: 2-Column Form Layout in Landscape
```css
@media (max-width: 768px) and (orientation: landscape) {
  .form-field {
    display: inline-block;
    width: 48%;
    margin-right: 4%;
  }
  .form-field:nth-child(even) {
    margin-right: 0;
  }
}
```

## Gesture Interactions

### Swipe (where used)
- **Swipe Left/Right** — Navigate between views (e.g., products → orders)
- **Swipe Down** — Refresh list (pull-to-refresh pattern)
- **Swipe Down (modal)** — Dismiss modal if not required form

### Tap
- Single tap activates buttons, links
- Long press (750ms+) shows context menu or preview

### Don't Use:
- Double-tap to zoom (conflics with pinch-zoom)
- Right-click context menus (no mouse on mobile)

## Testing Checklist for Mobile

- [ ] All buttons/links are ≥44px × 44px
- [ ] Forms don't require horizontal scrolling
- [ ] Header + bottom nav don't overlap content
- [ ] Text is readable (14px minimum for body)
- [ ] Images load within viewport (not requiring scroll)
- [ ] Safe area insets accounted for (notch, home indicator)
- [ ] No color as only indicator (icons + labels present)
- [ ] Focus states visible on all interactive elements
- [ ] Bottom nav accessible via thumb reach (bottom 60px)
- [ ] Modals dismiss with close button or swipe-down
- [ ] Tables don't require horizontal scroll (collapse columns or use accordion)

## Design System Links
- **Palette:** design/branding/palette.html
- **Typography:** design/branding/typography.html
- **Components:** design/system/components.html
- **Spacing:** design/system/spacing.md
