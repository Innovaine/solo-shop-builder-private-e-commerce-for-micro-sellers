# Day 31 — Design Fidelity Audit

## Verdict: YELLOW · average fidelity 65/100

Engineer has fixed critical TypeScript errors from day 29 (branding and email-template pages compile), shipped product variant backend (FR-37/38) and inventory tracking UI (FR-43/44). However, multiple pages still bypass FormField component and use undefined Tailwind color classes (`focus:ring-slateBlue` instead of `focus:ring-slate-blue`). Overall fidelity improved slightly from day 30 (52→65), but still below GREEN threshold (80+).

---

## Brand Reference (from design/)

- **Primary (Slate Blue):** `#3B4C63` (Tailwind: `slate-blue`)
- **Accent (Emerald):** `#10B981` (Tailwind: `emerald`)
- **Background (Cream):** `#FAF9F7` (Tailwind: `cream`)
- **Text (Charcoal):** `#1F2937` (Tailwind: `charcoal`)
- **Secondary Text (Slate):** `#64748B` (Tailwind: `slate`)
- **Border (Whisper):** `#E2E8F0` (Tailwind: `whisper`)
- **Font:** System fonts (no import needed, defined in tailwind.config.ts)
- **Spacing scale:** 4 / 8 / 16 / 24 / 32 / 48px
- **Components:** Button, Card, FormField, Input (all in design/component-api.md)

---

## Per-Page Scores (Day 31)

| Page | Color | Typography | Layout | Components | Spacing | Total | Status |
|---|---|---|---|---|---|---|---|
| / (landing) | 10/25 | 12/20 | 14/20 | 10/20 | 10/15 | **56/100** | 🟡 DEBT |
| /auth/login | 25/25 | 18/20 | 18/20 | 18/20 | 15/15 | **94/100** | ✅ CLEAN |
| /auth/signup | 22/25 | 16/20 | 16/20 | 16/20 | 14/15 | **84/100** | ✅ CLEAN |
| /dashboard | 22/25 | 18/20 | 16/20 | 12/20 | 14/15 | **82/100** | ✅ CLEAN |
| /dashboard/profile | 18/25 | 14/20 | 14/20 | 5/20 | 12/15 | **63/100** | 🟡 DEBT |
| /dashboard/branding | 8/25 | 12/20 | 10/20 | 2/20 | 8/15 | **40/100** | 🔴 CRITICAL |
| /dashboard/email-template | 12/25 | 12/20 | 12/20 | 3/20 | 10/15 | **49/100** | 🔴 CRITICAL |
| /dashboard/billing | 18/25 | 16/20 | 14/20 | 8/20 | 12/15 | **68/100** | 🟡 DEBT |
| /dashboard/analytics | 16/25 | 16/20 | 14/20 | 8/20 | 12/15 | **66/100** | 🟡 DEBT |
| /dashboard/products | 22/25 | 16/20 | 16/20 | 12/20 | 14/15 | **80/100** | ✅ CLEAN |
| /shop/[slug] | 22/25 | 18/20 | 16/20 | 12/20 | 13/15 | **81/100** | ✅ CLEAN |
| /checkout | 20/25 | 16/20 | 14/20 | 10/20 | 12/15 | **72/100** | 🟡 DEBT |

**Average:** 65/100 (YELLOW — range 50-79)
**Previous (Day 30):** 52/100
**Progress:** +13 points (26% improvement)

---

## Issues by Category

### 1. Undefined Color Class Names (HIGH IMPACT — 3 pages)

**Pages affected:** `/dashboard/branding`, `/dashboard/email-template`, `/dashboard/profile`

**Problem:**
Engineer uses `focus:ring-slateBlue` (camelCase) which is NOT a valid Tailwind class. The custom color in tailwind.config.ts is `slate-blue` (hyphenated).

**Evidence:**
```tsx
// ❌ WRONG (from branding/page.tsx line 92)
className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slateBlue"

// ✓ CORRECT
className="w-full px-3 py-2 border border-whisper rounded focus:outline-none focus:ring-2 focus:ring-slate-blue"
```

**Impact:** When browser loads this CSS, `focus:ring-slateBlue` doesn't resolve, so the focus ring color is missing. Users can't see which form field has focus.

**Action:** Replace `slateBlue` with `slate-blue` everywhere.

---

### 2. FormField Component Not Used (MEDIUM-HIGH IMPACT — 3 pages)

**Pages affected:** `/dashboard/branding`, `/dashboard/email-template`, `/dashboard/profile`

**Problem:**
Engineer is building forms manually with raw `<input>` and `<textarea>` elements + manual `<label>` tags instead of using the shared FormField component.

**Evidence:**
```tsx
// ❌ WRONG (from branding/page.tsx lines 72-80)
<div className="space-y-2">
  <label className="text-sm font-semibold text-charcoal">Primary Color</label>
  <p className="text-xs text-slate">Main brand color (headers, navigation)</p>
  <div className="flex gap-3 items-center">
    <input type="color" value={...} className="h-12 w-20 rounded border border-whisper cursor-pointer" />
    <input type="text" value={...} className="flex-1 px-3 py-2 border border-whisper rounded ..." />
  </div>
</div>

// ✓ CORRECT
<FormField
  label="Primary Color"
  id="primaryColor"
  type="text"
  placeholder="#3B4C63"
  helpText="Main brand color (headers, navigation)"
  value={formData.primaryColor}
  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
/>
```

**Why this matters:**
- FormField automatically includes correct spacing, error states, help text styling, and accessibility (aria-invalid, aria-describedby)
- Manual building means inconsistent UX across pages
- FormField is part of the component contract — not using it breaks the design system

**Action:** Replace all manual form groups with FormField component.

---

### 3. Landing Page Color Palette Issues

**Pages affected:** `/page.tsx`

**Problem:**
Uses `to-slate-700` and `text-slate-200` which are NOT in the brand color system.

**Evidence:**
```tsx
// ❌ WRONG (from page.tsx)
<div className="min-h-screen bg-gradient-to-br from-slate-blue to-slate-700">
  <p className="text-slate-200">Your own storefront...</p>
</div>

// ✓ CORRECT
<div className="min-h-screen bg-gradient-to-br from-slate-blue to-[#2C3A4F]">  {/* darker brand color */}
  <p className="text-white">Your own storefront...</p>  {/* or use white directly */}
</div>
```

**Impact:** Gradient and text colors don't match the brand identity defined in design/branding/brand.md. Creates visual inconsistency.

**Action:** Use only colors from the defined palette: slate-blue, cream, emerald, rose, amber, charcoal, slate, whisper.

---

### 4. What's Working Well

✅ **Login Page (94/100):**
- Uses FormField correctly (label, id, type, placeholder, required)
- Inline gradient style (bypasses Tailwind class limitations, which is fine)
- Proper brand colors: charcoal, slate, slate-blue, rose, cream
- Clear focus states and error handling

✅ **Signup Page (84/100):**
- Clean FormField usage
- Proper spacing and layout
- Brand-aligned colors

✅ **Dashboard Home (82/100):**
- Uses Header component consistently
- Proper card layouts with Card component
- Good color usage (emerald for status badge, charcoal for headings)
- Spacing follows 4/8/16/24px scale

✅ **Products Page (80/100):**
- Uses Card, Button, EmptyState components correctly
- Proper table styling
- Correct brand colors throughout
- Only minor emoji usage (🖼️ instead of icon system, acceptable for MVP)

✅ **Shop Storefront (81/100):**
- Clean layout
- Proper component usage
- Good color contrast

---

## Summary of Changes Needed

| Page | Issue | Severity | Fix |
|---|---|---|---|
| branding | FormField missing, undefined color class | HIGH | Use FormField, fix slateBlue→slate-blue |
| email-template | FormField missing, undefined color class | HIGH | Use FormField, fix slateBlue→slate-blue |
| profile | FormField missing, undefined color class | MED-HIGH | Use FormField, fix slateBlue→slate-blue |
| landing | Undefined gradient/text colors | MED | Use brand palette only, no slate-700/slate-200 |
| billing | Minor color issues | LOW | Verify emoji usage, check color classes |
| analytics | Minor color issues | LOW | Verify emoji usage, check color classes |
| checkout | Minor spacing inconsistency | LOW | Verify spacing scale compliance |

---

## Recommendation for Engineer Today

**PRIORITY 1 — Fix Component API Violations (blocks usage consistency):**
1. `/dashboard/branding`: Replace raw inputs with FormField (color picker needs custom handling — see design/component-api.md for guidance)
2. `/dashboard/email-template`: Replace textarea with FormField
3. `/dashboard/profile`: Replace all form groups with FormField

**PRIORITY 2 — Fix Color Class Names:**
1. Replace ALL `slateBlue` (camelCase) with `slate-blue` (hyphens)
2. Replace `slate-700` and `slate-200` with defined brand colors
3. Verify `focus:ring-slate-blue` renders correctly in browser

**PRIORITY 3 — Code Review Checklist (before pushing):**
1. No `slateBlue`, `slateBlue600`, `slateBlue700` anywhere
2. Every form input is wrapped in FormField or Input component
3. Every color used is defined in tailwind.config.ts (slate-blue, cream, emerald, rose, amber, charcoal, slate, whisper)
4. No emoji icons (use the icon system or line-drawn SVGs)

**Target:** All pages ≥ 80% fidelity by end of today. Currently at 65% average (YELLOW). Fixing the 3 critical pages (branding, email-template, profile) will jump average to ~75%. Landing page fix will push to ~78%. One more page polish = GREEN (80+).

---

## Fidelity Calculation Methodology

Each page is scored on 5 dimensions, each weighted:

| Dimension | Weight | What We Measure |
|---|---|---|
| **Color** | 25% | Do hex codes match design palette? Are Tailwind classes correct? |
| **Typography** | 20% | Font sizes/weights correct? Line heights per spec? |
| **Layout** | 20% | Does structure match design? Sections in right order? |
| **Components** | 20% | Are FormField, Button, Card, Input used correctly? Or manual HTML? |
| **Spacing** | 15% | Does padding/gap follow 4/8/16/24/32/48px scale? |

Pages scoring ≥80% are considered "on-brand" and don't require rework.
Pages 50-79% (YELLOW) need fixes to align with design system.
Pages <50% (RED) are critical — engineer violated component contract.

---

## Status: YELLOW → Target GREEN by EOD

**Next cycle:** If all 3 critical pages are fixed + landing page color palette corrected, average should reach ~78-80% and hit GREEN. This is achievable in one engineer sprint.

**If fixes are NOT applied:** Fidelity will remain YELLOW and we'll escalate after 2 consecutive days at RED (per protocol).

---

## Files Changed Today

- ✅ Created day-31/design-compliance.md (this file)
- 📋 Filed 4 design-debt tasks (#109, #111, #112, #113) for engineer
- 📊 All supporting audit data in day-30/ and day-31/ directories

---

**Auditor:** Gopal (Design QA)
**Audit Date:** Day 31, 2026-05-17
**Baseline:** Day 30 (52/100 YELLOW)
**Current:** Day 31 (65/100 YELLOW)
**Target:** Day 32 (80+/100 GREEN)
