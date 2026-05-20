# Day 93 — Responsive Design Audit & Engineering Guidance

**Status:** MVP stage scaling — focus on fixing visual + layout issues blocking users.
**Date:** May 20, 2026

---

## Critical Design Issues Identified

### Issue 1: Product Image Display (Task #264, #265)
**What's broken:** Product images are being saved as private and not visible on storefront. Even when uploaded, customer-facing product grids show broken images.

**Design guidance:**
- Images MUST be publicly accessible (S3 public URL, not private) for customers to see them
- Product detail page should show a fallback placeholder (see design/pages/product-detail.html) if image is missing or not yet processed
- Thumbnail grid on storefront should lazy-load images (intersection observer pattern)
- On product-edit page (updated today), clearly indicate which images are public vs private with visual badges

**Engineering reference:**
- Ensure S3 upload process sets object ACL to public-read by default
- Store both private upload path (for seller) and public CDN URL (for customers) in database
- Query for public URL in storefront routes; never expose S3 upload key to frontend

---

### Issue 2: Inactive Shop Display (Task #199)
**What's broken:** When a shop is paused/inactive, customers can still add items to cart and proceed to checkout, then fail at payment.

**Design solution provided:**
- Created `design/pages/storefront-inactive-shop.html` showing a clean "Shop Closed" page
- Prevent cart additions: disable "Add to Cart" button when shop.active = false
- At checkout, check shop status and prevent payment initiation with clear message
- Show seller contact info (email, phone, website) so customer can reach out directly

**Engineering reference:**
- Add `active` boolean field to Seller schema (default: true)
- Check seller.active in GET /shop/[slug] route before rendering storefront
- Return 410 Gone status if shop is archived (seller deleted it)
- Return soft error page (200 with "Shop Closed" message) if shop is paused (seller toggled it off)
- Disable checkout button entirely if shop inactive, show message: "This shop is currently closed. Contact the seller directly."

---

### Issue 3: Post-Purchase Flow (Task #198)
**What's broken:** After successful payment, customers are redirected to landing page instead of seeing their order receipt.

**Design solution provided:**
- Created `design/pages/post-purchase-receipt.html` with full order summary, shipping address, seller info, and tracking setup
- This should be shown BEFORE any redirect
- Page should load in < 2 seconds (no external API calls on page load)

**Engineering reference:**
- After Stripe/MyFatoorah callback, create order in database and immediately redirect to `/checkout/success/[order-id]`
- Pre-fetch order data server-side (no client-side API calls after page load)
- Show receipt for 15 seconds auto-scroll, then offer CTA buttons: "Continue Shopping" and "View Order Status"
- Only redirect to shop homepage if user clicks "Continue Shopping" — don't auto-redirect

---

### Issue 4: Payment Callback Error Handling (Task #222, #205, #206)
**What's broken:** MyFatoorah callback is failing. Customers get `callback_error` message instead of proper error recovery.

**Design guidance:**
- Created `design/pages/checkout-myfatoorah-success.html` showing success state
- For errors, use patterns from `design/pages/checkout-error-handling.html` (payment_declined, session_expired, inventory_conflict, network_timeout)

**Key user flows:**
1. **Payment Success:** Show receipt with order ID, items, total, and "next steps" timeline
2. **Payment Declined:** Show error, preserve cart, let customer retry with different card
3. **Session Expired:** Show message, preserve cart items, redirect back to checkout
4. **Network Error:** Show message, auto-retry in 5 seconds, let customer manually retry
5. **Inventory Conflict:** Remove out-of-stock item, let customer proceed with remaining items

**Engineering reference:**
- Catch MyFatoorah callback errors with explicit error handling (don't let exceptions bubble)
- Return 200 OK to callback even if processing fails (prevents infinite retries by payment gateway)
- Log all callback errors with requestId, timestamp, paymentId for debugging
- On error, email seller + customer with order ID and error details
- Implement idempotency on order creation: use paymentId as idempotency key to prevent duplicate orders

---

## Responsive Breakpoints (Current Standard)

All design files use these breakpoints. Ensure implementations match:

```css
/* Mobile (default) */
max-width: 768px
- Single column layouts
- Full-width forms
- Stack all navigation vertically
- Touch targets ≥ 44px (at minimum, 40px acceptable for mobile)
- Font sizes: body text 14px-16px

/* Tablet */
768px to 1024px
- 2-column grids where sensible
- Forms can go 2-column if content is short
- Sidebar layouts start appearing
- Font sizes: body text 14px-16px (same as mobile)

/* Desktop */
1024px+
- 3-column grids possible
- Sidebar + main content layouts
- Wider forms (max-width: 600px per form column)
- Font sizes: body text 14px-16px (consistent across all sizes)
```

---

## Mobile-First Implementation Rules

### Rule 1: Navigation
- **Mobile:** Hamburger menu (3-line icon) → slide-out sidebar
- **Tablet:** Top nav with some items in dropdown
- **Desktop:** Full horizontal nav with dropdowns as needed

### Rule 2: Forms
- **Mobile:** Single column, full-width inputs, stacked buttons
- **Tablet:** 2 columns only for short labels + inputs (e.g., First Name | Last Name)
- **Desktop:** 2-3 columns for longer forms, group related fields

### Rule 3: Tables
- **Mobile:** Stack to card view (title on top, value on bottom) or horizontal scroll
- **Tablet:** 2-3 column table (maybe hide some columns)
- **Desktop:** Full table as designed

Example table on mobile:
```html
<!-- Render as cards on mobile, not table -->
<div class="order-card">
  <div class="order-row"><span class="label">Order ID:</span><span class="value">#ORD-001</span></div>
  <div class="order-row"><span class="label">Total:</span><span class="value">$145.00</span></div>
  <div class="order-row"><span class="label">Status:</span><span class="value">Shipped</span></div>
</div>
```

### Rule 4: Images & Media
- **Mobile:** Max-width 100% of container, aspect-ratio maintained
- **Tablet:** Can be narrower if in 2-column layout (50% - gap)
- **Desktop:** Full design width or constrained max-width (600px) for focus

### Rule 5: Spacing (4px grid)
- **Mobile:** Reduce spacing by 1 step (16px → 12px, 24px → 20px)
- **Tablet:** Standard spacing (16px, 24px, 32px)
- **Desktop:** Standard spacing, can increase for breathing room on very wide screens

---

## Current Design Files Status

✅ **Fully updated today (Day 93):**
- `design/pages/product-edit.html` — now shows public/private image states
- `design/pages/checkout-myfatoorah-success.html` — post-payment receipt flow
- `design/pages/storefront-inactive-shop.html` — closed shop messaging
- `design/pages/post-purchase-receipt.html` — full order confirmation page

✅ **Existing error/edge-case coverage:**
- `design/pages/checkout-error-handling.html` — payment errors, timeouts, inventory conflicts
- `design/pages/empty.html` — empty cart, empty orders, no products
- `design/pages/404.html` — page not found
- `design/pages/error.html` — 500 error

✅ **Complete responsive reference:**
- `design/responsive-spec.md` — breakpoint definitions
- `design/system/mobile-patterns.md` — mobile-specific interactions
- All `design/pages/*.html` files include `@media (max-width: 768px)` queries

---

## Engineer Checklist: Implementing Design Files

When building a feature from these design files:

- [ ] **Pull the exact layout** from the HTML file (don't re-interpret)
- [ ] **Match color hex values** from `design/branding/brand.md` (not approximate)
- [ ] **Use spacing tokens** from `design/system/spacing.md` (4/8/16/24/32/48)
- [ ] **Copy button states** from `design/system/components.html` (primary/secondary/ghost/danger)
- [ ] **Implement focus states** exactly as shown (2-3px colored box-shadow)
- [ ] **Test on mobile** (375px width) — check touch targets are ≥ 44px
- [ ] **Test on tablet** (768px width) — confirm 2-column layouts work
- [ ] **Test on desktop** (1440px width) — ensure max-width constraints apply

If design and code diverge: **the design file is canonical.** Create a task assigning back to @Chiara if the design needs adjustment (don't modify code to match wrong design).

---

## Urgent Engineering Priorities for Day 93

Based on today's design review and task backlog:

1. **Fix S3 image visibility** (tasks #264, #265) — implement public ACL on upload
2. **Add shop.active check** (task #199) — prevent cart/checkout when inactive
3. **Implement post-purchase receipt page** (task #198) — don't auto-redirect to landing
4. **Fix MyFatoorah callback error handling** (tasks #222, #205, #206) — use explicit error patterns
5. **Update back button logic** (task #215) — ensure /dashboard not /

---

## Design Decisions & Notes

**Why post-purchase receipt?**
Customers need order confirmation in hand before leaving the checkout flow. Without it, they wonder if payment succeeded. Email is async; the receipt page is immediate proof-of-purchase.

**Why public image guidance?**
The gap between "seller uploaded image" and "customer sees image" is breaking trust. Clarity on public vs private prevents support tickets.

**Why inactive shop protection?**
A seller pauses their shop, but customers still get charged and confused. Showing a closed shop page with seller contact info converts support load → direct seller contact.

**What I cut:**
- Advanced image states (cropping, filters, AI-generated alt text) — stage 2+ features
- Multi-language receipt pages — focus on English MVP first
- Seller notification settings UX refinement — covered in existing task #53

---

## Known Issues (Not Design Gaps)

These are engineering bugs, not design problems:

- ✗ Orders page shows "failed to load orders" (task #201) — authorization issue
- ✗ Billing page returns 401 (task #213) — missing auth middleware
- ✗ Back buttons point to / instead of /dashboard (task #215) — hardcoded path issue
- ✗ MyFatoorah callback returns 500 (tasks #222, #205, #206) — error handling missing

**These have design coverage already in error-handling-spec.md.** Engineering needs to wire them up, not change the design.

---

## Next Round (Day 94+)

- Implement all design files from today
- Test responsive layouts on actual devices (not just browser dev tools)
- File design tasks if real UX issues appear during testing
- No new design files needed until these are wired + tested
