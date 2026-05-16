# Spacing System — Solo Shop Builder Design System

## Grid Base
**4px** is the foundational unit. All spacing values are multiples of 4.

## Spacing Scale

| Token | Value | Use Case |
|-------|-------|----------|
| **xs** | 4px | Icon-to-text gaps, tight separations |
| **sm** | 8px | Form field padding, small gaps between elements |
| **md** | 16px | Default padding (buttons, cards, inputs), standard gaps |
| **lg** | 24px | Section spacing, modal padding, large margins |
| **xl** | 32px | Page-level margins, hero section spacing |
| **2xl** | 48px | Top-level section gaps, page padding |

## Application

### Buttons
- Padding: 12px vertical × 16px horizontal (uses lg token for height, md for width)
- Gap between button text and icon: sm (8px)

### Form Fields
- Padding: 12px vertical × 16px horizontal
- Label-to-input gap: sm (8px)
- Field-to-field gap: md (16px)
- Error text spacing: xs (4px)

### Cards
- Padding: lg (24px)
- Gap between card elements: md (16px)

### Grids & Layouts
- Product grid gap: lg (24px) on desktop, md (16px) on tablet, sm (8px) on mobile
- Section margin-bottom: 2xl (48px)
- Vertical spacing between sections: 2xl (48px)

### Header & Footer
- Header padding: md (16px)
- Footer padding: lg (24px)

### Mobile Adjustments
- Reduce lg (24px) → md (16px) on screens < 768px
- Reduce xl (32px) → lg (24px) on screens < 768px
- Padding on full-width containers: md (16px) instead of lg (24px)

## Visual Reference

```
┌─────────────────────────────────────────┐
│  4px (xs)                               │
│  ├─ Icon + Label gap                    │
│  ├─ Minimal spacing                     │
│                                          │
│  8px (sm)                               │
│  ├─ Form field padding                  │
│  ├─ Small component gaps                │
│                                          │
│  16px (md)                              │
│  ├─ Card padding                        │
│  ├─ Button padding                      │
│  ├─ Standard gaps                       │
│                                          │
│  24px (lg)                              │
│  ├─ Section margins                     │
│  ├─ Large component spacing             │
│                                          │
│  32px (xl)                              │
│  ├─ Page margins (desktop)              │
│  ├─ Hero section spacing                │
│                                          │
│  48px (2xl)                             │
│  ├─ Page-level gaps                     │
│  ├─ Section separations                 │
└─────────────────────────────────────────┘
```

## Implementation Notes
- Always use tokens from this scale—never arbitrary pixel values.
- On mobile (< 768px), reduce spacing by one step (lg → md, xl → lg).
- Padding is consistent: inside cards, buttons, forms use md/lg.
- Margins between sections use lg/2xl.
- Never mix tokens across a single layout (e.g., don't use xs and 2xl side-by-side without visual hierarchy reason).
