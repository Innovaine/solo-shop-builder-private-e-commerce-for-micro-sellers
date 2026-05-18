# Day 77 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 141
- **Saved:** 19/05/2026, 1:39:27 AM

---

FINISHED:
- 58 tasks closed; project at scaling stage with MVP feature set substantially complete
- Dockerfile, deployment pipeline, and core infrastructure in place
- Seller signup (F1), shop creation (F2), product CRUD (F3), S3 image upload (F4), storefront (F5), category system (F6–F7), cart (F8), Stripe Checkout (F9), webhook order creation (F10), order dashboard (F11), order status updates (F12) all shipped and integrated
- Magic link auth flow operational; Stripe payment_intent.succeeded → order creation working end-to-end
- .qadar metadata channels, git history, environment snapshots logged (instrumentation live)

PENDING:
- #222: My Fatoorah callback fails — webhook path receives paymentId but redirect to checkout fails; blocker on payment flow robustness
- #221: [STANDARDS-CRITICAL] app/api/products/import/route.ts creates new PrismaClient() instead of importing singleton — violates DB connection pooling standard; low impact until scale but must close today

TODAY'S WORK STREAMS:
- **Stream 1 (engineering):** Attack #222 (Fatoorah webhook callback + redirect) and #221 (PrismaClient singleton import) first — both are live bugs that will break in production or under load. Then ship any remaining MVP polish (edge cases in order status, cart validation, image upload error handling). Reference F10 (webhook integrity) and F3 (product CRUD).
- **Stream 2 (designer):** Ship seller dashboard refinement (order table UX — sorting, status badge styling, empty state); seller settings page mockup (shop name/slug edit, shop info form); and customer order tracking page (what buyer sees after purchase). Reference F11 and implicit tracking page.
- **Stream 3 (tester):** Write Playwright tests covering F10 (webhook receipt → order creation), F12 (order status dropdown updates + persistence), F8 (cart add/remove/checkout flow), and F6–F7 (category filter). Tests should verify customer journey and seller admin actions, not unit logic.
- **Stream 4 (reviewer):** Code review #222 and #221 fixes before merge; verify Fatoorah redirect logic and PrismaClient pattern are production-safe. Spot-check any new product import logic if shipped.
- **Stream 5 (connectivity_qa):** Verify Fatoorah webhook endpoint routing, Stripe webhook re-entry, and auth session persistence across shop slug changes. **Stream 5b (task_verifier):** Confirm #222 and #221 closed with proof (screenshot of webhook firing, grep of singleton import).

ROLE PLAN:
- engineering: YES — two live bugs (#222, #221) require immediate fix before day 80; engineer can ship both + cart/image edge cases in parallel with other streams
- review: YES — #222 (Fatoorah callback) and #221 (DB pool) are both production-risk; review gates merge
- design: YES — seller dashboard, settings, and customer tracking page are next user-facing increments; designer ships mockups in parallel
- connectivity_qa: YES — Fatoorah + Stripe webhook routing must be verified after #222 fix; routes are fragile at scale
- test: YES — F10, F12, F8, F6–F7 have zero Playwright coverage; tester writes suites covering payment + status + cart flows
- task_verifier: YES — #222 and #221 need proof-of-close (logs, code grep, redirect test); verifier gates task board update
- design_qa: NO — fidelity check happens after design ships; not blocking today
- requirements: NO — scope is locked (100 features, MVP defined); no new requirements this cycle
- standards_qa: YES — #221 is a standards violation; Vitali should audit app/api/ for other new PrismaClient() instances before day 80

ONE-LINE SUMMARY:
Today the team ships Fatoorah webhook fix + PrismaClient singleton refactor + seller dashboard/settings design + cart/payment Playwright tests in parallel.
