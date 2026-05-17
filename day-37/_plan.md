# Day 37 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 81
- **Saved:** 17/05/2026, 4:07:23 AM

---

FINISHED:
- Docker setup + environment configuration (Dockerfile, .env.example, .qadar-* config files)
- Basic API scaffolding (account/password, analytics routes)
- Project structure ready for rapid feature iteration

PENDING:
- #82: Docker build blocker (3 missing dynamic exports) — blocking all deployment
- #59: Import path corrections in checkout + orders pages — blocking payment features
- #77, #78: Backend implementation of FR-1 through FR-20 (auth, shop, products, cart, checkout, orders, dashboard) — ~60% of MVP
- #83: Full end-to-end feature completion + integration testing — blocker for customer signal
- #80, #76: CEO demo readiness — no working end-to-end flow yet
- #117: UI/visual polish — pages rendering poorly, affecting seller/customer experience
- #105: In-progress test suite for FR-21–FR-25 (Priya) — check completion status before assigning new tests

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix Docker blocker #82 first (unblocks deploy), then ship backend for FR-1 through FR-10 (#77: auth → shop → products → cart → checkout → orders). Parallel: fix import paths #59 so checkout/orders pages can actually call the APIs. Target: working Stripe integration + order creation via webhook by EOD.
- Stream 2 (designer): Ship Figma/HTML for FR-1 signup page, FR-2 shop creation form, FR-3 product CRUD UI, FR-5 storefront layout, and FR-11 seller order dashboard. These unblock engineer on form/page structure and give tester concrete surfaces to test against.
- Stream 3 (tester): Write Playwright tests for #74 (all 20 MVP features F1–F20) in parallel with engineer shipping. Start with signup flow + shop creation (#66 partial), then product CRUD (#66), cart + checkout (#74). Tests must cover the happy path: seller signs up → creates shop → adds product → customer buys → order appears in dashboard.
- Stream 4 (reviewer): Verify Docker fix #82 deploys cleanly, then spot-check backend APIs (#77) for correct request/response shape before tester writes against them. Ensure import paths #59 don't break on merge.
- Stream 5 (design_qa): Verify #117 (page rendering issues) against shipped design files — flag missing CSS, broken layout, or missing components before engineer ships FR-11+ (dashboard).

ROLE PLAN:
- engineering: YES — Docker blocker + 10 core MVP backend features must ship today to unblock demo + testing; Anil has capacity for 3–5 parallel tasks.
- review: YES — import path fixes + API contracts need review before tester writes tests; prevents rework.
- design: YES — Figma/HTML mockups for signup, shop, product forms, storefront, and dashboard are the north star for backend shape and tester confidence.
- design_qa: YES — #117 (visual bugs) is blocking seller confidence; fix before we showcase to first customers.
- test: YES — Playwright suite must grow in lockstep with backend; Priya finishes #105, then immediately starts #74 (MVP test coverage).
- requirements: NO — task board is clear; no new scope questions. Priya owns task triage if blockers emerge.

ONE-LINE SUMMARY:
Today the team ships Docker fix + FR-1 through FR-10 backend, signup/shop/product/dashboard UI mockups, and the first Playwright test suite, all in parallel to unlock the CEO demo by end of week.
