# Accessibility Specification — Solo Shop Builder MVP

**Status:** WCAG 2.1 AA Compliance Target  
**Designer:** Chiara  
**Date:** Day 26  

---

## Summary
This is the engineer's reference sheet for implementing accessibility compliance across all 20 MVP features. Every page must meet WCAG 2.1 AA minimum. These are design decisions that have been baked into design/pages/*.html — you are implementing from that reference, not inventing a different approach.

---

## Critical Requirements (Must Not Skip)

### 1. Keyboard Navigation
- **Every interactive element must be reachable via Tab key**
  - Buttons, links, form inputs, dropdowns, modals all tab-navigable
  - Tab order follows visual left-to-right, top-to-bottom
  - Modals trap focus (Tab cycles within modal, not outside)
  
- **No keyboard traps** — user can always tab away from any element

- **Escape key closes modals and dropdowns**

### 2. Focus Indicators
- **All elements that receive focus must show a visible focus indicator**
  - Design specs show: 2–3px box-shadow, slate-blue outline, ~200ms transition
  - MINIMUM 3:1 contrast between focus ring and background
  - Focus ring must be at least 2px wide
  
- **Visible on all interactive elements:**
  - Buttons (primary, secondary, ghost, danger)
  - Form inputs (text, email, password, textarea, select)
  - Links (especially in tables, nav menus)
  - Custom controls (dropdowns, date pickers)
  
- **CSS pattern (from design files):**
  ```css
  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 76, 99, 0.2);
  }
  ```

### 3. Color Contrast
- **Minimum 4.5:1 for normal text, 3:1 for large text (18px+)**
- **Status indicators must NOT rely on color alone**
  - Use color + icon + text label together
  - Example: "✓ Shipped" (green badge + checkmark + word)
  - NOT: green background alone = "shipped"

- **Approved color pairs in use:**
  - #1F2937 (charcoal) on #FFFFFF (white) = 10.6:1 ✓
  - #3B4C63 (slate) on #FAF9F7 (cream) = 5.8:1 ✓
  - #64748B (slate secondary) on white = 4.9:1 ✓
  - #10B981 (emerald) on white = 4.1:1 ✓
  - #F43F5E (rose) on white = 3.8:1 ✗ (use for backgrounds only, not text)

### 4. Form Labels & Input Structure
- **Every form input MUST have an associated label**
  - Use `<label for="inputId">` paired with `<input id="inputId">`
  - Never rely on placeholder text alone
  
- **Error messages must be:**
  - Visually distinct (red background or border + icon)
  - Associated with input via `aria-describedby="errorId"`
  - Include actionable text: "This shop name is already taken. Try another."
  
- **Form field structure:**
  ```html
  <div class="form-field">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" aria-describedby="emailHint" />
    <div id="emailHint" class="form-hint">We'll send order notifications here.</div>
  </div>
  ```

### 5. Heading Hierarchy
- **Use semantic HTML: `<h1>`, `<h2>`, `<h3>`, etc.**
- **Never skip heading levels** — no h1 → h3 (skip h2)
- **One `<h1>` per page** (page title)
- **Proper nesting:**
  - Dashboard: H1 (Welcome) → H2 (Products, Orders, Get Started) → H3 if needed
  - Product list: H1 (Products) → H2 (table headers / section titles)
  
- **Not for styling** — don't use h3 just because you want smaller text; use proper heading then apply CSS sizing

### 6. Semantic HTML
- **Use semantic tags, not divs:**
  - `<nav>` for navigation menus (not `<div class="nav">`)
  - `<main>` for main content area
  - `<aside>` for sidebars
  - `<article>` for self-contained cards / posts
  - `<section>` for grouped related content
  - `<form>` for forms (not `<div class="form">`)
  
- **This helps screen reader users understand page structure**

### 7. Images & Icons
- **All images must have alt text**
  - Product images: `<img alt="Handmade ceramic mug, blue glaze" src="..." />`
  - Decorative icons: `<svg aria-hidden="true">` (tell screen readers to skip)
  - Icon buttons: `<button aria-label="Delete product"><i class="icon-trash"></i></button>`
  
- **SVGs embedded in HTML should have `<title>` or `aria-label`**
  ```html
  <svg aria-label="Shop logo">
    <title>Solo Shop</title>
    <!-- paths -->
  </svg>
  ```

### 8. ARIA Labels & Descriptions
- **Use when native HTML isn't enough:**
  - Icon buttons: `<button aria-label="View shop">`
  - Status badges: `<span aria-label="Order paid">`
  - Modals: `<div role="dialog" aria-labelledby="modalTitle">`
  - Sidebars: `<aside aria-label="Main navigation">`
  
- **Do NOT overuse ARIA** — if HTML is semantic, don't add redundant ARIA
  - `<a href="...">Learn more</a>` doesn't need aria-label
  - `<button type="submit">Save</button>` is clear already

### 9. Mobile & Touch Accessibility
- **All touch targets ≥ 44px × 44px** (minimum, per WCAG)
  - Buttons, links, form inputs
  - Exception: adjacent targets need ≥ 8px spacing
  
- **Mobile touch patterns:**
  - Modal backdrop must be tappable to close
  - Dropdowns close on Escape or outside-tap
  - Form inputs zoom to 16px+ on focus (prevent browser auto-zoom)

### 10. Motion & Animations
- **Respect `prefers-reduced-motion` CSS media query**
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **Animations should not distract** — use for feedback (loading spinner, button hover) not decoration
- **Auto-playing video/sound requires user consent**

---

## Implementation Checklist by Feature

### Auth Flow (F1, F2)
- [ ] Login page: labels on inputs, focus states visible, "Check email" success message is live region (`role="status"`)
- [ ] Email input type correctly set (`type="email"`)
- [ ] Success state shows dynamically without page reload (async, so announce via `aria-live="polite"`)

### Shop Creation (F3)
- [ ] Shop name input has label
- [ ] Error message for "already taken" is red, includes text
- [ ] Slug generation shows in real-time with aria-live announcement

### Product Management (F4, F5, F6)
- [ ] Image upload has alt text entry field (required)
- [ ] Product title, price, description have labels
- [ ] Category dropdown has label, is keyboard navigable
- [ ] Product list table: thead with th elements, proper column headers

### Cart & Checkout (F8, F9)
- [ ] Quantity input has label + buttons with aria-label
- [ ] Proceed to Checkout button is high-contrast and large (≥44px)
- [ ] Stripe Checkout frame is navigable (Stripe handles some a11y, but test)

### Order Dashboard (F11, F12)
- [ ] Order table: thead with th, rows are scannable
- [ ] Status dropdown has clear label
- [ ] Tracking ID input has label
- [ ] All form fields have focus states

### Tracking Page (F13, F14)
- [ ] Order details clearly labeled (Order ID, Customer, Total, Status)
- [ ] Status badge includes text + icon + color
- [ ] Tracking link is clickable and underlined

### Error Pages (F18)
- [ ] Error page has h1 explaining the error
- [ ] 404: "Page not found" with home link
- [ ] 500: "Something went wrong" with support email link
- [ ] Retry buttons are clear and high-contrast

---

## Design System Integration

All components in `design/system/components.html` follow these patterns:

| Component | Focus Indicator | Label Requirement | Touch Size |
|---|---|---|---|
| Button (all types) | 3px box-shadow, slate blue | aria-label if icon-only | 44px min |
| Form input | 3px box-shadow, slate blue | `<label>` required | 44px min |
| Select dropdown | 3px box-shadow, slate blue | `<label>` required | 44px min |
| Link | 2px outline, slate blue | text content OR aria-label | 44px min |
| Checkbox / Radio | 3px box-shadow, slate blue | `<label>` required | 44px min (touch area) |
| Modal | Escape key closes, focus trapped | aria-labelledby, aria-modal=true | Backdrop ≥ full viewport |
| Table | Thead with th, proper row structure | Column headers in th | Cell text readable |
| Badge / Status | Color + icon + text | aria-label if icons only | Text visible |

---

## Testing (for QA)

### Automated Testing
- **axe DevTools** (browser extension) — runs on every page, catch 60% of a11y issues
- **WAVE** (browser extension) — visual feedback on errors
- **Lighthouse** (Chrome DevTools) — Accessibility audit, target ≥90

### Manual Testing
1. **Keyboard Only:** Navigate entire flow (login → shop → checkout → order tracking) using Tab, Enter, Escape only
2. **Screen Reader:** NVDA (Windows) or VoiceOver (Mac) — read page aloud, verify headings make sense, buttons are announced
3. **Color Contrast:** Check all text with Color Contrast Analyzer tool
4. **Zoom:** Test at 200% zoom, ensure no text cutoff, layout is readable
5. **Mobile:** Test touch targets on 320px width (iPhone SE), ensure 44px minimum

---

## Common Mistakes to Avoid

❌ **Using placeholder as label**
```html
<input type="email" placeholder="your@email.com" />
```
✓ **Correct:**
```html
<label for="email">Email Address</label>
<input type="email" id="email" placeholder="your@example.com" />
```

---

❌ **Using divs for buttons**
```html
<div class="button" onclick="...">Click me</div>
```
✓ **Correct:**
```html
<button type="button">Click me</button>
```

---

❌ **Color only for status**
```html
<div style="background: green;">Shipped</div>
```
✓ **Correct:**
```html
<span class="badge badge-green">✓ Shipped</span>
```

---

❌ **Skipping heading levels**
```html
<h1>Dashboard</h1>
<h3>Products</h3>  <!-- Skipped h2! -->
```
✓ **Correct:**
```html
<h1>Dashboard</h1>
<h2>Products</h2>
```

---

## References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Next Steps for Engineer:**
1. Implement semantic HTML first (nav, main, aside, section, form, button)
2. Add focus styles to all interactive elements (copy from components.html)
3. Ensure all inputs have labels
4. Test with axe DevTools (target 0 errors)
5. Keyboard-test entire app (Tab through every page)
6. Test with screen reader (NVDA/VoiceOver)
7. Check color contrast with WebAIM tool
8. Run Lighthouse Accessibility audit (target ≥90)

**Designer review:** All design files have been updated with focus states and semantic structure. Components.html has been annotated. This is your reference — don't invent a different approach. Copy the patterns directly.
