# Day 44 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 95
- **Saved:** 17/05/2026, 9:26:09 AM

---

FINISHED:
- Dockerized app ready to deploy (Dockerfile + .dockerignore present)
- 52 tasks closed; MVP feature backbone sketched in task board
- Environment configuration framework in place (.env.example, .qadar files)
- Account deletion API endpoint stubbed (app/api/account/delete/route.ts)

PENDING:
- #106: Re-deploy day 29 features (F31-F40) — still waiting on engineer confirmation that build passes
- #83: Full MVP feature completion (F1-F20) — auth, shop, products, cart, checkout, orders all need verification before demo
- #80: CEO demo flow verification — cannot greenlight until end-to-end (signup → order → tracking) is tested live
- #105: FR-21 through FR-25 tests (password auth, webhook, refund, CSV) — in-progress, needs review before merge
- No code review artifacts in warehouse yet — reviewer needs to gate merged code before tester writes final suite

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship FR-1 through FR-10 backend (auth magic link, shop creation, product CRUD, cart session, Stripe Checkout integration, order webhook handler). Attack #77 + #83 in parallel — these are the critical path to demo-ready. Deploy to staging by EOD.
- Stream 2 (designer): Ship public storefront pages (product list view, product detail, cart summary, order confirmation) and seller dashboard skeleton (order table, status dropdown). Reference design/pages/storefront.html, design/pages/dashboard-orders.html, design/pages/checkout.html.
- Stream 3 (tester): Write Playwright test suite covering F1–F10 (signup flow, shop creation, product add/edit/delete, category filter, cart persistence, Stripe webhook success). Block on engineer shipping backend; tests run in parallel with Stream 2 design landing.
- Stream 4 (reviewer): Gate #105 merge immediately; review engineer's #77 PRs for cart + webhook logic before they hit staging; spot-check Stripe integration for PII handling.
- Stream 5 (requirements): Clarify with Priya: does F6 (category dropdown) need multi-select or single-select? Does order dashboard need date-range filter before demo, or after? Lock scope to demo-minimum by 9am.

ROLE PLAN:
- engineering: YES — MVP backend is 80% of the ship-or-die path; Priya needs to move fast and deploy early to catch integration bugs.
- review: YES — Stripe webhook + payment handling is security-critical; #105 tests need approval before merge; engineer will produce 3-5 PRs today and can't ship all at once.
- design: YES — Storefront + dashboard pages are customer-facing; designer needs to ship high-fidelity pages in parallel so engineer doesn't wait for mockups; Priya will integrate CSS/layout while building backend routes.
- test: YES — Priya writes tests as engineer ships; Playwright suite for F1–F10 unblocks demo readiness and catches regressions before CEO sees broken flow.
- requirements: YES — Scope creep risk is high with 60 open tasks; PM needs to lock demo-minimum features (F1–F12 only) and block F31-F40 until v1 ships; clarify billing/analytics questions for Priya before day 45.

ONE-LINE SUMMARY:
Today the team ships FR-1 through FR-10 backend + storefront/dashboard pages + Playwright test suite for MVP flow, unblocking CEO demo verification by day 46.
