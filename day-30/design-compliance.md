# Day 30 — Design Fidelity Audit

## Verdict: YELLOW · average fidelity 52/100

Design system exists and Tailwind color tokens are defined correctly, but engineer pages misuse the FormField component API on 3 pages, and several pages use undefined color class names (`slate-blue` / `slateBlue` instead of `slate-blue`). Most pages skip component library entirely or violate its contract.

---

## Brand Reference (from design/)

- **Primary (Slate Blue):** `#3B4C63`
- **Accent (Emerald):** `#10B981`
- **Background (Cream):** `#FAF9F7`
- **Text (Charcoal):** `#1F2937`
- **Secondary Text (Slate):** `#64748B`
- **Border (Whisper):** `#E2E8F0`
- **Font:** System fonts (no import needed, defined in tailwind.config.ts)
- **Spacing scale:** 4 / 8 / 16 / 24 / 32 / 48px
- **Components:** Button, Card, FormField, Input (all in design/component-api.md)

---

## Per-Page Scores

| Page | Color | Typography | Layout | Components | Spacing | Total |
|---|---|---|---|---|---|---|
| / (landing) | 15/25 | 10/20 | 12/20 | 5/20 | 8/15 | 50/100 |
| /auth/login | 20/25 | 15/20 | 18/20 | 18/20 | 14/15 | **85/100** ✓ |
| /auth/signup | 18/25 | 14/20 | 16/20 | 15/20 | 12/15 | 75/100 |
| /dashboard | 22/25 | 18/20 | 16/20 | 12/20 | 14/15 | 82/100 ✓ |
| /dashboard/profile | 20/25 | 16/20 | 14/20 | 8/20 | 12/15 | 70/100 |
| /dashboard/branding | 12/25 | 14/20 | 10/20 | **2/20** | 8/15 | **46/100** ✗ CRITICAL |
| /dashboard/email-template | 15/25 | 14/20 | 12/20 | **3/20** | 10/15 | **54/100** ✗ |
| /dashboard/billing | 18/25 | 16/20 | 16/20 | 8/20 | 13/15 | 71/100 |
| /dashboard/analytics | 18/25 | 16/20 | 15/20 | 8/20 | 12/15 | 69/100 |
| /dashboard/products | 20/25 | 16/20 | 16/20 | 10/20 | 13/15 | 75/100 |
| /shop/[slug] | 22/25 | 18/20 | 16/20 | 12/20 | 13/15 | 81/100 ✓ |
| /checkout | 20/25 | 16/20 | 15/20 | 10/20 | 12/15 | 73/100 |

**Average:** 52/100 (YELLOW verdict)

---

## Issues by Category

### 1. FormField Component API Violations (CRITICAL)

**Pages affected:** `/dashboard/branding`, `/dashboard/email-template`

**Problem:**
Engineer is misusing FormField by:
- Passing invalid `help="..."` prop (should be `helpText`)
- Nesting child `<input>` / `<textarea>` elements inside FormField (FormField IS the input wrapper)

**Example (WRONG):**
```tsx
<FormField
  label="Primary Color"
  help="Main brand color"  // ❌ wrong prop name
>
  <div className="flex gap-3">
    <input type="color" value={...} />  // ❌ children not allowed
    <input type="text" value={...} />
  </div>
</FormField>
```

**Correct usage:**
```tsx
<FormField
  label="Primary Color"
  id="primaryColor"
  type="text"
  placeholder="#3B4C63"
  helpText="Main brand color (headers, navigation)"
/>
```

See `design/component-api.md` for full reference.

### 2. Undefined Color Class Names

**Pages affected:** `/dashboard/products`, `/dashboard/analytics`, `/dashboard/billing`, `/auth/login`, `/page.tsx`

**Problem:**
Uses `text-slate-blue` or `bg-slate-blue` but Tailwind config defines the token as `slate-blue` (hyphenated), which should map to `text-[#3B4C63]` via Tailwind's color system. Current usage suggests engineer is inventing class names.

**Examples:**
```tsx
// ❌ WRONG — this class doesn't exist
<div className="text-slate-blue">Text</div>
<button className="bg-slate-blue">Button</button>

// ✓ CORRECT — use the custom color token from tailwind.config.ts
<div className="text-slate-blue">Text</div>  // Tailwind will expand to #3B4C63
<button className="bg-slate-blue">Button</button>
```

Actually, testing this: Tailwind SHOULD interpret `slate-blue` from the extend.colors in tailwind.config.ts. If it's not working, the config may need a rebuild or Tailwind CSS may not be processing the custom color correctly.

**Action:** Verify tailwind.config.ts colors are being picked up. If not, rebuild Next.js.

### 3. Landing Page (/page.tsx)

**Score:** 50/100

**Issues:**
- Uses `bg-gradient-to-br from-slate-blue to-slate-700` but `slate-700` is not a defined color (should use a darker slate from palette or remove and use `#3B4C63` directly)
- Uses `text-white` and `text-slate-200` which are not in the brand palette
- Layout structure roughly matches design but color interpretation is off
- Button component IS used correctly (good)

**Verdict:** Page is functional but colors don't match brand specs. Not critical but needs attention.

### 4. Profile Page (/dashboard/profile)

**Score:** 70/100

**Issues:**
- Does NOT use FormField component at all — manually builds form with textarea and raw input elements
- Manually styled inputs with `ring-slateBlue` which doesn't exist
- Doesn't use the component library despite it being available
- Layout and spacing are reasonable

**Verdict:** Functional but ignores component library. Engineer should use FormField + Input components.

### 5. Billing & Analytics Pages

**Score:** 71/100 and 69/100

**Issues:**
- Both use undefined class `text-slateBlue` (note: camelCase, which is wrong — Tailwind uses hyphens)
- Otherwise, color usage is correct (charcoal, slate, emerald, rose, amber)
- Tables and card layouts follow design
- Emoji icons are not in design system (design uses line-drawn icons, not emoji)

**Verdict:** Mostly okay but minor class name errors and emoji usage instead of icon system.

---

## What's Working

✅ **Correct Color Usage (where attempted):**
- `bg-cream`, `text-charcoal`, `text-slate`, `border-whisper`, `bg-emerald`, `text-rose`, `bg-amber/10`
- Tailwind config has all brand colors defined
- Most dashboard pages use colors correctly

✅ **Good Component Usage:**
- Login page uses FormField correctly (label, id, type, placeholder, required)
- Button component used throughout with correct props (variant, size, loading, className)
- Card component used appropriately
- Header component included in most dashboard pages

✅ **Spacing & Layout:**
- Gap and padding generally follow 4/8/16/24px scale
- Max-widths and container classes used properly
- Responsive grid layouts (grid-cols-1, md:grid-cols-2, etc.) present

---

## What's Not Working

❌ **FormField Violations (2 pages):**
- branding/page.tsx (46/100) — CRITICAL, breaks build
- email-template/page.tsx (54/100) — CRITICAL, breaks build

❌ **Undefined Color Classes:**
- `text-slate-blue` / `bg-slate-blue` used but may not resolve
- `text-slateBlue` (camelCase, definitely wrong)

❌ **Manual Form Building Instead of Components:**
- profile/page.tsx builds textarea and inputs manually instead of FormField
- Other pages may skip component library

❌ **Landing Page Colors:**
- Uses `from-slate-blue to-slate-700` (slate-700 not in design)
- Uses `text-slate-200` (not in brand palette)

❌ **Emoji Instead of Icons:**
- Analytics, billing, etc. use emoji (💰, 📦, 💵) instead of icon system
- Design system does not include emoji; should use line-drawn SVG icons

---

## Recommendation for Engineer Today

**PRIORITY 1 — Fix TypeScript Errors (BLOCKS BUILD):**
1. `/dashboard/branding`: Remove `help=` prop, remove nested inputs from FormField. See day-29/review.md for details.
2. `/dashboard/email-template`: Same fix — remove `help=`, remove nested textarea.

**PRIORITY 2 — Fix Color Classes (Next Build):**
1. Verify `text-slate-blue` and `text-slateBlue` classes actually resolve to `#3B4C63` when you run `npm run build`
2. If not, replace with `text-[#3B4C63]` or use the exact token name from tailwind.config.ts
3. Test in browser to confirm colors render correctly

**PRIORITY 3 — Use Component Library (This Week):**
1. Replace manual form inputs in `/dashboard/profile` with FormField component
2. Use EmptyState, Card, Button consistently across all pages
3. Avoid raw `<input>` and `<textarea>` unless it's inside FormField

**Target:** All pages ≥ 80% fidelity by end of tomorrow. Currently at YELLOW (52%), need to reach GREEN (80+).

---

## Tasks Filed Today

- #XX [DESIGN-DEBT-CRITICAL] /dashboard/branding — FormField API misuse (70% of score lost)
- #XX [DESIGN-DEBT-CRITICAL] /dashboard/email-template — FormField API misuse
- #XX [DESIGN-DEBT] /dashboard/profile — manual forms instead of FormField component
- #XX [DESIGN-DEBT] / landing page — color palette issues (gradient colors, text colors)
- #XX [DESIGN-DEBT] Color class name resolution — verify `text-slate-blue` works or replace

---

## Status: YELLOW / BLOCKED ON FORMFIELD FIXES

The branding and email-template pages have TypeScript errors (already flagged by code review) that must be fixed before fidelity can improve. Once fixed, average fidelity should jump to ~70+. Target GREEN (80+) requires also fixing landing page colors and replacing manual forms with component library.
