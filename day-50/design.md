# Day 50 — Designer · UI mockups: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Chiara (Designer)
- **Cycle:** 102
- **Saved:** 17/05/2026, 3:42:11 PM

---

## ✅ Done

Day 50 design work complete. Delivered 3 production-ready design pages for Stage 1 hardening features (FR-31, FR-36, FR-30) and verified existing designs. All pages are mobile-responsive, accessible, and ready for engineer implementation.

**New files shipped:**
1. **design/pages/seller-profile-editor.html** — FR-31 (Seller profile page). Simple, focused form with displayName + publicDescription fields (100 char + 500 char limits). Live character count + live preview of public shop appearance. No scope creep to branding/social/email settings—those are future Stage 2 features.

2. **design/pages/orders-export-modal.html** — FR-30 (Order CSV export). Modal dialog with single export option (all orders, all history). File downloads as `orders-YYYY-MM-DD.csv` in RFC 4180 format. Engineer can parse modal trigger button location from `orders-list.html`.

3. **design/pages/orders-list.html** — New reference page showing order table with status badges, item details, totals. CSV export button at top-right. Shows sample order data + empty state for when shop has no orders yet. Engineer uses this as the canonical orders dashboard layout.

**Verified existing files:**
- **design/pages/analytics-dashboard.html** — FR-36 (Analytics dashboard). Already shipped in cycle 100; verified it matches all Day 50 acceptance criteria: total revenue card, order count card, top 3 products table, 30-day daily trend chart. Has bonus AOV + conversion rate metrics (nice-to-have, engineer can strip if needed). Mobile-responsive, no changes needed.

## Design decisions

**1. Simplified seller profile editor (FR-31)**
- Constraint: FR-31 asks ONLY for displayName + publicDescription. The existing `seller-profile.html` included branding, social links, and danger zone (account deletion) — too much scope.
- Decision: Created `seller-profile-editor.html` as a focused form with only the 2 required fields + character limits + live preview. Keeps cognitive load low and matches the MVP scope exactly.
- Tradeoff: If future stages add more profile fields (email, social, etc.), engineer will extend this form, not replace it. Design is now an anchor, not a placeholder.

**2. Simplified CSV export modal (FR-30)**
- Constraint: Existing `csv-export-modal.html` offered 3 export types (orders, products, customer list) with date range filters. FR-30 asks only for order export, all history, no filters.
- Decision: Created `orders-export-modal.html` with a single export option. Modal stays minimal and doesn't overwhelm seller with choices for MVP. Future Stage 2 can add product/customer export, date range picker.
- Tradeoff: Less flexibility today, but faster to build and ship. Engineer gets a clear, single-purpose component.

**3. Orders list page (new)**
- Rationale: FR-30 requires CSV export button. Engineer needs a reference for WHERE that button appears (order dashboard layout). Created `orders-list.html` to show the natural home for the export button (header, top-right, next to any future filter/sort controls).
- Design choice: Kept table simple (Order ID, Date, Customer, Items, Total, Status, View link). Added status badges for quick visual scanning. Empty state included for when seller has zero orders (shows friendly message, prevents layout breaking).

**4. Analytics dashboard (existing, no changes)**
- Verified: `analytics-dashboard.html` shipped in Cycle 100 already covers FR-36 fully. Has all required metrics (total revenue, order count, top products, 30-day trend). Engineer can use as-is; no redesign needed.
- Note: Design includes AOV + conversion rate + order status summary (bonus metrics beyond MVP). Engineer can strip these if time-constrained, but they're useful context and don't add complexity.

## What I cut from scope

- **Seller profile branding customizer:** Pushed to Stage 2 (future days). F31 is profile metadata only; color picker + logo upload are F32 scope.
- **Advanced CSV export options:** Date range picker, multi-type export, custom column selection all pushed to Stage 2+. MVP is orders-only, all-history.
- **Analytics date range picker:** FR-36 asks for 30-day fixed view. Configurable date range (7/14/30/90 days) is Stage 2 feature.
- **Real-time analytics updates:** Batch refresh on page load is fine for MVP. WebSocket streaming is Stage 2+.

## One thing I'm worried about

**1. Character limit UX on seller profile (FR-31)**
- The form shows live character count (e.g., "24/100 characters") which is helpful, but there's no explicit visual feedback when input is at max length. If a seller copy-pastes a 600-character description, they'll see the input stop accepting input without clear feedback that they've HIT the limit (the browser's native maxlength stops input silently).
- What I did: Added visual character counter + form hint, so the seller CAN see they're over. But no red error state or "max reached" toast.
- Risk: Seller might not realize their long description was truncated to 500 chars, then complain their full bio isn't showing on the shop page.
- Mitigation: Engineer can add a small visual indicator (e.g., counter turns red when at 95%+ capacity) or a toast when they try to type beyond the limit. Not critical for MVP, but worth noting.

**2. CSV filename assumes server timezone**
- Requirement says file downloads as `orders-YYYY-MM-DD.csv`. I've designed the modal to use current date (e.g., `orders-2026-05-17.csv`). But which timezone? If engineer uses server timezone and seller is in different zone, the date in filename might be off by a day.
- Mitigation: Engineer should use seller's timezone (stored in shop settings) or UTC. Document this clearly in the code. For MVP, UTC is fine as long as it's consistent.

**3. Empty state never tested until real seller has zero orders**
- `orders-list.html` has an empty state design for when a new seller hasn't received orders yet. This will never be seen during testing (we test with fake data). When a real seller signs up, they'll hit this page and either love it or find it confusing. No way to predict UX quality until production.
- This is a general MVP problem, not specific to my design. But worth flagging: empty states are high-friction moments for new users.

---

## Related files

- `design/pages/seller-profile-editor.html` — FR-31 reference
- `design/pages/orders-list.html` — FR-30 context (export button location)
- `design/pages/orders-export-modal.html` — FR-30 modal reference
- `design/pages/analytics-dashboard.html` — FR-36 reference (no changes from Cycle 100)
- `design/system/components.html` — Engineer's UI component reference (buttons, forms, modals, badges, tables)
- `design/branding/brand.md` — Color palette, typography, spacing system

## Next round (Day 51+)

- **Stage 2 features** (F41–F60) will require: seller messaging UI, bulk order actions, abandoned cart recovery, discount code manager, review/rating system.
- Recommend next design sprint focuses on **messaging system** (F41/F42: customer threads, reply-to-email integration) and **seller automation** (F43/F44: restock alerts, abandoned cart emails). Both unlock real retention + seller power-user workflows.
- Design system is mature (50+ pages, all components locked). Extending it is fast; new features should take 2-3 design days max.
