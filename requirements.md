# Day 56 — Requirements: Solo Shop Builder — Private E-commerce for Micro-Sellers

## Goal today
Stabilize the MVP order dashboard (verify Day 54/55 features work), fix any broken cart/checkout flows from recent changes, and ship a clean, testable baseline for the next batch of Stage 1 hardening features.

## Features in scope

Three focused pieces of work:

1. **FR-156: Order status filtering with counts** — Seller can filter orders by status (Paid, In Progress, Shipped, Delivered) with badge counts. Features restored on Day 55, needs verification + testing.

2. **FR-157: Dashboard summary metrics** — Seller dashboard shows: total products, total revenue, total orders (last 30 days). Includes metric cards + simple bar chart. Restored on Day 55, needs verification + test.

3. **FR-24: Inventory tracking (atomic validation)** — Product stock count checked at checkout. Stripe checkout validated against current inventory. Order decrement is atomic (no race conditions). If stock depleted, customer sees "Out of stock" message instead of checkout button.

## Functional requirements

| ID | Feature | Description | Acceptance criteria |
|---|---|---|---|
| FR-156 | Order filtering | Seller dashboard order list has 4 filter buttons: "Paid", "In Progress", "Shipped", "Delivered". Each button shows count of orders in that status (e.g., "Paid (12)"). Clicking a button filters the order table. Unfiltered state shows all orders. | 1. Filter buttons render with correct counts. 2. Clicking a button filters table to only show orders with that status. 3. Count badges update after status change. 4. No "Pending" status option (orders start as "Paid" from webhook). 5. Mobile: buttons stack vertically on <640px. |
| FR-157 | Dashboard metrics | Seller dashboard top section displays 3 metric cards: (1) "Total Products" with count, (2) "Total Revenue (30d)" with sum of order totals, (3) "Total Orders (30d)" with count of paid orders. Simple design: card title + big number. | 1. Cards render on page load. 2. Numbers recalculate when order status changes. 3. Correct data: revenue only from "Paid" orders, count from last 30 days (ignore older orders). 4. Format: $0,000.00 for revenue, plain integers for counts. 5. Mobile: cards stack vertically on <640px. |
| FR-24 | Inventory validation at checkout | Before Stripe Checkout redirect: GET /api/products/:id to fetch current stock. If stock >= cart quantity, allow checkout. If stock < quantity, render "Out of Stock — Only X remaining" and hide checkout button. On successful Stripe payment (webhook), atomically decrement stock by order quantity. Prevent double-decrement on duplicate webhooks (idempotent). | 1. Checkout button visible only if stock >= cart qty. 2. If stock becomes 0, customer sees message + no button. 3. On payment success, stock decrements by order qty exactly once (test via duplicate webhook). 4. If stock depletes to 0 during checkout flow, customer must remove items or go back. 5. Seller can manually adjust stock in product editor. |

## Stack chosen (lock this in day 1)
- **Backend:** Node.js + Express/Fastify in TypeScript (Next.js API routes)
- **Web frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database:** Postgres with Prisma ORM
- **Payment processing:** Stripe Checkout (hosted)
- **Email:** Resend or in-process for transactional emails
- **Hosting:** Vercel (frontend) + containerized backend on private VPS (www.soloshopbox.com)
- **Why this stack:** Already shipped 55 days in this stack. No learning curve. Fast iteration.

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Order dashboard filter buttons update table in <200ms (no server round-trip for filters, client-side filtering). |
| NFR-2 | Performance | Metric cards render within <500ms of page load. |
| NFR-3 | Performance | Stock validation API call (GET /api/products/:id) responds in <300ms p95. |
| NFR-4 | Data consistency | Inventory decrement is atomic (database transaction or SELECT FOR UPDATE to prevent race conditions). |
| NFR-5 | Security | Inventory decrement only happens once per valid Stripe webhook (idempotency key in database). |
| NFR-6 | Observability | Every stock decrement logged with order ID, product ID, old/new stock, webhook timestamp. |
| NFR-7 | Mobile | Dashboard filtering + metrics cards mobile-responsive on 320px+ width. Touch targets ≥44px. |
| NFR-8 | Accessibility | Filter buttons + metric cards have proper ARIA labels and keyboard navigation (Tab + Enter to select filter). |
| NFR-9 | Error handling | Out of stock → graceful message on storefront, no 500 errors. |
| NFR-10 | Testing | All 3 features have Playwright tests covering happy path + edge cases (low stock, out of stock, duplicate webhook). |

## Out of scope (do NOT build today)
- Bulk order status updates — no "mark all as shipped" button yet
- Advanced inventory features (variants with separate stock, SKU tracking) — single stock count per product only
- Email notifications on stock low — no alerts yet
- Back-order / waitlist system — out of stock is permanent until seller adds stock
- Real-time inventory sync (websockets) — standard refresh-to-see-latest
- Multi-location inventory — single inventory pool per product
- Seller inventory import (CSV) — stock must be set via product editor UI
- Promotional discount codes — not in scope
- Tax calculation at checkout — not included in total
- Shipping cost estimation — not at checkout

## Open questions (owner, please answer before Wednesday)
1. **Inventory refresh rate:** When a customer is on checkout, should we re-check stock in real-time every N seconds, or just once at initial page load? (Impacts UX if seller runs low mid-checkout.)
2. **Stock depletion behavior:** When a product sells out, should we (a) disable the "Add to Cart" button immediately, (b) allow adding but show error at checkout, or (c) allow adding but disable checkout? (Currently planning b — add to cart allowed, checkout blocked.)
3. **Metric calculation window:** For "Total Revenue (30d)" and "Total Orders (30d)", should we count from today -30 days, or rolling 30 days from last paid order? (Impacts reporting consistency.)

## Definition of done for day 56
A checklist for reviewer + tester:
- [ ] FR-156: Order dashboard filter buttons present and clickable, with correct counts
- [ ] FR-156: Clicking filter changes order table display without page reload
- [ ] FR-157: Metric cards render with correct numbers (products, revenue, orders)
- [ ] FR-157: Metrics update when order status changes (manual test in dashboard)
- [ ] FR-24: Stock level displayed on product detail page (for visibility)
- [ ] FR-24: "Out of Stock" message appears when stock < cart qty
- [ ] FR-24: Checkout button hidden when product is out of stock
- [ ] FR-24: Stock decrements by order qty on successful Stripe payment (check database)
- [ ] FR-24: Duplicate webhook doesn't double-decrement stock (idempotent)
- [ ] FR-24: Seller can view/edit product stock in product editor
- [ ] All features mobile-responsive (< 640px viewport)
- [ ] All features have passing Playwright tests (regression test suite)
- [ ] No console errors or TypeScript build errors
- [ ] App builds and deploys to www.soloshopbox.com without errors
- [ ] Health check passes, homepage loads, orders dashboard accessible
