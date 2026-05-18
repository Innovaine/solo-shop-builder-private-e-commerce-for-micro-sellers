# Day 72 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 136
- **Saved:** 18/05/2026, 10:46:23 PM

---

# EXECUTION DAY 72 — SOLO SHOP BUILDER

## FINISHED:
- Seller signup + magic link auth (F1) — /app/api/account/magic-link/route.ts + email delivery working
- Shop creation + slug generation (F2) — /app/api/shop/route.ts, shop table schema, unique constraint on slug
- Product CRUD (F3) — /app/api/products/route.ts, POST/GET/PATCH/DELETE fully wired
- Product image upload to S3 (F4) — S3 client configured, image resize pipeline (via sharp), CDN URL mapping in product table
- Public storefront list view (F5) — /shop/[slug]/page.tsx renders product grid, no auth required
- Category dropdown + filter (F6, F7) — categories enum in product schema, filter logic on storefront query
- Shopping cart in browser (F8) — localStorage persistence, add/remove/quantity update working
- Stripe Checkout integration (F9) — POST /api/checkout/session creates Checkout URL, customer redirected
- Order creation from webhook (F10) — POST /api/webhooks/stripe receives payment_intent.succeeded, writes order row with customer email + items + total
- Seller order dashboard (F11) — /app/dashboard/orders, authenticated view, table lists all orders (no filtering yet)
- Order status workflow (F12) — PATCH /api/orders/[id] updates status dropdown (pending → paid → in-progress → shipped)
- Deployment: Dockerfile + docker-compose working, env example committed, README.md with setup steps

## PENDING:
- #210: API billing unauthorized — Anil needs to verify auth check on billing/usage routes (if shipping pricing tier v1)
- #209: API order unauthorized — Anil needs to verify seller can only read/update their own orders; cross-tenant leak risk

## TODAY'S WORK STREAMS:

- **Stream 1 (engineering):** Fix #209 and #210 authorization checks on orders + billing endpoints to prevent cross-tenant data leaks (15–20 min max per task). Then ship product image gallery lightbox on detail page (F5 refinement) + order shipment tracking page for customers (post-purchase email sends /track/[order-id] link, customer sees status + estimated delivery). Attack these in parallel with the auth fixes. Reference: product detail page needs image carousel; order tracking page is pure read-only customer view hitting GET /api/orders/[id]/public (no seller auth required, only order UUID in URL).

- **Stream 2 (designer):** Ship detail page mockup with image gallery (design/pages/product-detail.html) + customer order tracking page mockup (design/pages/order-tracking.html). Both are high-signal for seller/customer trust — show Anil exactly what the gallery layout should be (carousel, zoom, thumbnail strip) and what tracking page shows (status timeline, estimated ship date, customer can message seller from here). No redesign of dashboard yet — keep storefront simple.

- **Stream 3 (tester):** Write Playwright tests covering F9 (Stripe Checkout redirect, mock payment webhook), F10 (order creation from webhook payload), F11 (seller dashboard loads only their orders), F12 (order status update persists). Tests should follow actual user paths: seller logs in → creates product → customer navigates storefront → adds to cart → pays → order appears in seller dashboard → seller ships. Also test authorization: seller B cannot view/edit seller A's orders (F11/F12 auth boundary).

- **Stream 4 (reviewer):** Verify #209 and #210 fixes before merge (Søren spot-checks auth logic, confirms seller context properly scoped to all order/billing queries). Spot-check connectivity between Stripe webhook payload and order creation (no missing fields, webhook signature validation working).

- **Stream 5 (requirements):** Kenji writes shipping label v1 spec (lightweight: seller clicks "mark shipped," enters tracking number, customer gets email with link — no carrier API yet, manual entry only). Unblock F13 for next cycle.

- **Stream 6 (design_qa):** Gopal checks that product detail gallery doesn't break on mobile (image dimensions, thumbnail scroll). Check order tracking page is usable on phone (customer likely checking status on mobile after purchase).

- **Stream 7 (connectivity_qa):** Zainab end-to-end tests the full payment → order creation → dashboard flow on staging. Confirms webhook signature validation passes, order UUID is properly indexed (tracking page loads instantly), auth tokens don't leak across tenants.

- **Stream 8 (task_verifier):** Mehrdad verifies #209 and #210 closed (auth boundary holds under test), product detail page + tracking page mockups match brand, Playwright tests all pass on staging before deploy.

## ROLE PLAN:
- **engineering: YES** — Two critical auth fixes blocking production confidence + three customer-facing features (gallery, tracking, messaging scaffold) to reduce churn from unclear order status post-purchase.
- **review: YES** — #209 and #210 are security boundaries; need human eyes on seller/order context isolation before any deploy.
- **design: YES** — Detail page + tracking page are high-touch customer moments; mockups unblock engineer and give tester clear acceptance criteria.
- **design_qa: YES** — Gallery and tracking page both mobile-first surfaces; responsiveness bugs now are cheap to fix.
- **connectivity_qa: YES** — Full webhook → order → dashboard flow is new payment-critical surface; needs end-to-end validation before production traffic.
- **test: YES** — F9–F12 are user-facing money paths; Playwright tests prevent regression and confirm authorization holds under load.
- **task_verifier: YES** — Auth fixes are sensitive; need explicit verification that #209/#210 are actually closed + customer-facing flows match design before deploy.
- **requirements: YES** — Shipping label spec (F13) is next-cycle blocker; write it now so engineer can estimate scope; unblock design of seller shipping flow.

## ONE-LINE SUMMARY:
Today the team ships order authorization fixes + customer tracking page + product detail gallery in parallel, then verifies auth boundaries hold and tests full payment-to-order flow.
