# Day 114 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 192
- **Saved:** 21/05/2026, 6:10:51 PM

---

FINISHED:
- Day 113 code deployed and verified live (health endpoint 200 OK); 6 files shipping dynamic currency, draft filtering, CSV export
- 55 tasks closed across MVP feature build (shop CRUD, Stripe integration, order dashboard, product search)
- Product spec locked at ~100 features total; Stage 0 MVP target is 20 features, mostly complete

PENDING:
- #332: ProductAnalytics interface drift (productId, productTitle, totalQuantity, totalRevenue missing from Prisma schema) — blocks analytics queries
- #331: 4 incomplete template strings in /shop routes — causes 404s on dynamic shop pages
- #330: app/dashboard/products/new/page.tsx broken build — page won't render
- #327: 4 orphaned page routes need routing audit — possible dead code or missing wiring
- #326: 4 broken Link/router template strings in shop pages — navigation fails at runtime

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix the 5 wiring + standards blockers today (#330 broken build, #331 template strings, #326 router links, #327 route audit, #332 schema drift). These are all sub-1-hour fixes that unblock the whole storefront. Anil should dispatch all 5 in parallel, not sequentially.
- Stream 2 (designer): Ship public storefront page mockups (product list, product detail, checkout flow) and seller dashboard page (order table, product editor). Reference design against F5 (storefront), F3 (product CRUD), F11 (order dashboard) from spec.
- Stream 3 (tester): Write Playwright tests for happy-path seller flow (signup → product create → storefront load → customer add-to-cart → Stripe redirect) and order dashboard (mark order shipped, see status change). Cover F1, F3, F5, F8, F9, F11, F12.
- Stream 4 (connectivity QA): Verify Stripe webhook wiring (F10: payment_intent.succeeded triggers order creation), magic-link auth flow (F1), and shop slug routing (F2, F5). Test with live test mode or sandbox credentials.
- Stream 5 (standards QA): Lock down ProductAnalytics interface definition — reconcile what fields actually exist in Prisma schema vs. what the dashboard queries. Write once, reference everywhere.

ROLE PLAN:
- engineering: YES — 5 critical wiring tasks are pure code fixes; Anil can ship all in one cycle and unblock the team
- review: YES — Søren verifies the 5 fixes deploy cleanly and don't introduce regressions
- design: YES — storefront and dashboard pages are undesigned; designer ships mockups that tester can write against and engineer can wire to
- connectivity_qa: YES — Stripe webhook + auth + routing are the spine of the product; must be verified before load testing
- standards_qa: YES — ProductAnalytics drift will cause silent bugs; lock schema + interface now or pay for it in production
- design_qa: YES — verify mockups match spec language (F5 storefront, F11 order dashboard) before engineer builds to them
- test: YES — happy-path seller flow + order status update are the two core user journeys; Playwright coverage is non-negotiable at day 114
- task_verifier: YES — each of the 5 wiring fixes needs proof of fix + proof of deploy before we move on
- requirements: NO — product spec is locked; no new FRs until we have 10+ paying sellers; requirements becomes active at stage 1

ONE-LINE SUMMARY:
Today the team ships 5 critical wiring fixes (broken build, template strings, schema drift), designs the storefront + dashboard pages, and writes Playwright tests covering the full seller signup-to-order flow in parallel.
