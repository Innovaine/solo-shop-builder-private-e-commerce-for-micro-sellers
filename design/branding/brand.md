# Solo Shop Builder — Brand Identity

## One-liner
Elegant, honest tools for independent sellers who want to own their storefront without the marketplace middleman.

## Color Palette

### Primary
- **Slate Blue** `#3B4C63` — trust, simplicity, seller-facing UI
- **Cream** `#FAF9F7` — background, breathable
- **White** `#FFFFFF` — card surfaces, product showcase

### Accent
- **Emerald** `#10B981` — success states, "order paid," primary CTA buttons
- **Rose** `#F43F5E` — alerts, destructive actions, urgency
- **Amber** `#F59E0B` — warnings, "low stock," processing states

### Neutral
- **Charcoal** `#1F2937` — text, headings
- **Slate** `#64748B` — secondary text, descriptions
- **Whisper** `#E2E8F0` — borders, dividers, form backgrounds

## Typography

### Type System (modular scale 1.125)

| Use | Size | Weight | Line-height |
|---|---|---|---|
| Page Heading (H1) | 48px | 700 (bold) | 1.2 |
| Section Heading (H2) | 36px | 700 (bold) | 1.3 |
| Subsection (H3) | 28px | 600 (semi-bold) | 1.4 |
| Card Title (H4) | 20px | 600 (semi-bold) | 1.4 |
| Body (P) | 16px | 400 (regular) | 1.6 |
| Small (caption, label) | 14px | 500 (medium) | 1.5 |
| Tiny (help text) | 12px | 400 (regular) | 1.5 |

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
```
Rationale: System fonts load instantly, no network latency, familiar to every user.

## Spacing System
Grid: 4px base unit

| Token | Value | Use |
|---|---|---|
| xs | 4px | Tight spacing between icons + text |
| sm | 8px | Input padding, small gaps |
| md | 16px | Default padding, card spacing |
| lg | 24px | Section spacing, margins |
| xl | 32px | Large gaps, hero sections |
| 2xl | 48px | Page-level spacing |

## Voice & Tone

### Principles
1. **Honest:** "You're in control" not "Join a community." No hype, no false promises.
2. **Clear:** Instructions, labels, and error messages assume the seller is busy and tired.
3. **Respectful:** Acknowledge that they already have a business—we're making it easier, not rebuilding it.
4. **Action-oriented:** Verbs first. "Add product" not "Product addition," "Finish setup" not "Continue onboarding."

### Examples

**Landing page CTA:** "Start selling today" (not "unlock your potential" or "join the revolution")

**Empty dashboard:** "You haven't added products yet. Add your first product to get started." (not "wow, so empty!" or "get started with our awesome onboarding")

**Success message:** "Order marked as shipped." (not "Congrats! Order shipped!" or "ding! ship confirmed!")

**Error message:** "This shop name is already taken. Try another." (not "Oops! Something went wrong" or "Error code 409")

## Component Philosophy
- Buttons are solid, clickable, not skeuomorphic
- Forms are spacious (not cramped)
- Cards have subtle shadows (elevation, not decoration)
- Icons are simple line-drawn, not illustrated
- Modals are full-viewport on mobile, centered on desktop (not floating)
- Loading states show motion, not spinners

## Accessibility
- Color contrast ratio ≥ 4.5:1 for all text on background
- Focus states visible on every interactive element (2px outline, slate blue)
- Touch targets ≥ 44px (mobile-first)
- No color as only indicator (icons + text)
- Headings properly nested (never skip h2 → h4)

## Responsive Breakpoints
- Mobile: < 768px (single column, full-width forms)
- Tablet: 768px – 1024px (2-column grid where sensible)
- Desktop: ≥ 1024px (3-column, sidebar layouts)
