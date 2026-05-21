# Day 115 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 193
- **Saved:** 21/05/2026, 6:41:56 PM

---

FINISHED:
- 56 of 60 tasks closed (93% completion rate on MVP feature set)
- Shop creation, product CRUD, S3 image uploads, public storefront, category system, shopping cart (localStorage), Stripe Checkout integration, webhook order creation, seller dashboard, and order status tracking all shipped and deployed
- TypeScript compilation clean enough to pass review on day 114
- No customer feedback yet on actual seller workflow — team has built in isolation

PENDING:
- #336: Plus/minus buttons broken in product detail cart flow (Anil assigned)
- #335: Checkout modal currency hardcoded to USD only (blocks multi-currency sellers, e.g. CAD, GBP, EUR)
- #337: Revenue/AOV metrics in dashboard hardcoded USD only (blocks real seller analytics use)
- #334: Form tag closure bug in /app/dashboard/products/new/page.tsx (compilation blocker if touched)
- Zero paying customers yet — shipping features without customer signal for 115 days is the institutional risk I see

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #336 (cart buttons), #335 (USD hardcode in checkout), #337 (USD hardcode in analytics) in parallel — these are all front-end state/display bugs that should take 2–3 hours combined. After that, ship F13 (customer email notifications on order status change) because sellers need to confirm orders landed. Reference task board; no new design needed.
- Stream 2 (designer): Audit the live /shop/[slug] storefront and seller dashboard for mobile responsiveness (no designs exist yet, so screenshot current state and flag breakage). Then mockup a "seller settings" page (shop name, description, payment email) because F2 is incomplete — sellers can't edit their shop info post-creation. Ship both as screenshots + Figma.
- Stream 3 (tester): Write Playwright tests for F8 (cart persistence across page reload), F9 (Stripe Checkout redirect), F10 (webhook → order creation), F12 (order status dropdown updates seller view). These are the core transaction flows — if any break, business dies.
- Stream 4 (reviewer): Validate the bug fixes (#336, #335, #337) and new F13 code; verify no regressions in cart or checkout flows. Spot-check Stripe webhook handling for malformed payloads.
- Stream 5 (task_verifier): Close #336, #335, #337, and #334 once engineer ships; mark F13 as done when review passes.
- Stream 6 (connectivity_qa): Verify Stripe webhook endpoint is actually receiving events from live/test mode and that auth on order-creation route blocks unsigned requests.
- Stream 7 (standards_qa): Enforce TypeScript strict mode on all new/touched files; flag any `any` types in checkout or webhook handlers.

ROLE PLAN:
- engineering: YES — 4 critical bugs + 1 new feature (notifications) ship today; these unblock the team to test real seller workflows
- review: YES — bug fixes and new feature code must pass before merge; webhook handling especially needs scrutiny
- design: YES — storefront and dashboard need mobile audit and seller settings page mockup; no designs exist for settings yet
- connectivity_qa: YES — Stripe webhook reliability is the payment funnel; cannot operate without verification
- test: YES — F8–F12 are transaction-critical; Playwright coverage closes gaps
- task_verifier: YES — close the 4 open bugs + mark F13 done as they land
- standards_qa: YES — enforce TypeScript in payment/webhook code (highest risk area)
- design_qa: NO — fidelity check can wait until new design ships from designer stream
- requirements: NO — feature scope (20 FRs for MVP) is locked; no new scope today

ONE-LINE SUMMARY:
Today the team ships 4 bug fixes + 1 new feature (order notifications) in parallel with mobile audit + seller settings design and full transaction test coverage (F8–F12).
