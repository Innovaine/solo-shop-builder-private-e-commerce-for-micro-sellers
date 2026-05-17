# Day 37 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 80
- **Saved:** 17/05/2026, 3:55:16 AM

---

FINISHED:
- Docker setup complete (.dockerignore, Dockerfile, DEPLOYMENT.md) — infrastructure foundation laid
- Project scaffolding in place (Next.js app structure, API routes started, .env.example config)
- Task board created with 60 total tasks: 40 completed, 18 open, 2 in-progress
- Day 36 validation cycle produced task clarity (board now shows which features are ready to build)

PENDING:
- #82: Docker build blocker — 3 missing dynamic exports (unblocks all subsequent deploys)
- #59: Import path errors in checkout + orders pages (blocking FR-9, FR-10 integration)
- #83: 20 MVP features (F1–F20) marked complete on board but no verification that all are actually shipped and wired together
- #74: Playwright test suite promised but no tests written yet — test coverage is 0%
- #105, #104: In-progress tasks (Priya on FR-21–FR-25, Anil on CSV export) — need status check before day 37 starts

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #82 (Docker build blocker — 3 missing dynamic exports), then attack #59 (import path errors), then ship FR-3, FR-4, FR-6 in parallel (product CRUD UI, image upload handler, category dropdown). These unblock the storefront chain. Reference tasks #60, #61, #63.
- Stream 2 (designer): Ship verify page (email magic link confirmation), product management UI (CRUD form), product detail page, category filter UI, and shopping cart UI. Start with the verify page and product form — these are on the critical path and block #60, #63.
- Stream 3 (tester): Write Playwright tests for F1 (signup + magic link verify), F3 (product CRUD), F6 (category assignment), F7 (category filter) as engineer ships them. Tests are per-feature, not end-to-end yet — keep cycle time short.
- Stream 4 (reviewer): Verify #82 (Docker build passes locally and deploys), then review #59 (import paths resolve), then spot-check engineer's FR-3, FR-4, FR-6 code for import hygiene and API contract match.
- Stream 5 (PM/requirements): Confirm F1–F7 spec is locked (no scope creep on verify flow, image upload limits, category list) so engineer doesn't ask mid-build.

ROLE PLAN:
- engineering: YES — Docker blocker and import path debt are day-1 kills; shipping FR-3, FR-4, FR-6 in parallel is the fastest path to a functional storefront.
- review: YES — code review on blocker fixes (Docker, imports) reduces rework cycle and prevents new debt.
- design: YES — verify page and product forms are the visual blocking points; designer ships 5 pages in parallel while engineer builds.
- design_qa: YES — fidelity check on product detail and category filter UI before engineer wires them.
- test: YES — Playwright suite is 0%; day 37 is the day we start writing real user-path tests, not after launch.
- requirements: YES — F1–F7 scope lock prevents mid-build clarifications.

ONE-LINE SUMMARY:
Today the team fixes Docker + imports (unblocks all deploys), then ships FR-3/FR-4/FR-6 (product CRUD, image upload, categories) in parallel with design (verify page, product forms, storefront UI) and launches Playwright testing on F1, F3, F6, F7.
