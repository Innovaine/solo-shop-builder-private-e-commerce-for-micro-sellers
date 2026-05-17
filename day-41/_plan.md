# Day 41 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 90
- **Saved:** 17/05/2026, 6:28:34 AM

---

FINISHED:
- Docker image builds (Dockerfile + .dockerignore in place)
- Environment scaffolding (.env.example, .qadar-* config files)
- Auth route skeleton (app/api/account/password/route.ts exists)
- Analytics + deployment docs (DEPLOYMENT.md + README.md)
- 40 tasks closed across 64 cycles (strong velocity baseline)

PENDING:
- #82: Docker build blocker — 3 missing dynamic exports (blocks all deploys)
- #59: Import path errors in checkout + orders pages (blocks payment flow)
- #123: Login bug in progress (Anil) — status unknown
- #105: FR-21 through FR-25 tests in progress (Priya) — status unknown
- #124: Dashboard error assigned to Anil — status unknown
- No Playwright test suite written yet (#74 open)
- No verified end-to-end flow (#80, #76 both open — CEO demo not yet signed off)

TODAY'S WORK STREAMS:

- **Stream 1 (engineer):** Fix #82 (Docker dynamic exports) + #59 (import paths) first to unblock deploy, then attack #77 (FR-1 to FR-10: auth + shop + products + cart + checkout + orders backend) and #78 (FR-11 to FR-20: dashboard + tracking + emails). Target shipping auth, product CRUD, and Stripe webhook wiring by EOD.

- **Stream 2 (designer):** Ship verify page (#65), product management UI (#65), and storefront product list (#47). These three pages are the critical path for sellers to create + sell. Publish as design/pages/verify.html, design/pages/product-management.html, design/pages/storefront.html.

- **Stream 3 (tester):** Write Playwright tests for #77 (auth signup + shop creation), #61 (image upload), #60 (product CRUD), and #64 (category filter). Tests should verify the happy path: seller signs up → creates shop → uploads product with image → sees it on storefront. Reference FR-1, FR-2, FR-3, FR-4, FR-6, FR-7.

- **Stream 4 (reviewer):** Verify #82 and #59 fixes compile + deploy cleanly, then review #77 and #78 PRs for schema correctness (order table, webhook handler, status enum). One review per feature block, not per commit.

- **Stream 5 (requirements):** Confirm with Kenji: are FR-1 through FR-20 the only scope for this week, or does CEO demo require FR-21+ (password auth, refunds)? If demo is signup-only, unblock Priya from #105.

ROLE PLAN:
- engineering: YES — unblock Docker + imports, then ship backend for auth + products + orders in parallel; 60–80 tool calls available
- review: YES — verify deployment fix and core backend PRs before merge
- design: YES — three critical UI pages (verify, product-management, storefront) ship in parallel with backend
- test: YES — Playwright suite for MVP features (FR-1 to FR-10) must land same day as backend
- design_qa: NO — no design fidelity issues logged yet; bring in after Chiara ships mockups if needed
- requirements: YES — one clarification call on scope (is week 1 FR-1–20 or FR-1–25?) before tester writes tests for stretch features

ONE-LINE SUMMARY:
Today the team unblocks Docker + imports, ships backend for signup + shop + products + Stripe, ships verify + product UI pages, and writes Playwright tests for the full signup-to-order flow — all in parallel.
