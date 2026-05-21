# Day 120 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 204
- **Saved:** 22/05/2026, 12:27:50 AM

---

# BRIEFING: DAY 120 — SOLO SHOP BUILDER

---

## FINISHED:
- Core project scaffold (Dockerfile, env config, git structure) + README deployed
- 57 tasks closed across prior execution cycles
- App container + npm toolchain operational (after graceful-fs fix in #343)
- Three STANDARDS-CRITICAL interface duplications identified and staged for repair (PR-ready, #345, #344)

---

## PENDING:
- #345: OrderCount interface duplication in dashboard/orders/page.tsx — blocks clean order aggregation
- #344: ProductAnalytics shadowing Prisma model in analytics route — type safety risk
- #343: npm cache corruption (graceful-fs) — requires clean rebuild verification
- Zero open tasks on board; no active design or test work queued — team is unblocked but directionless

---

## TODAY'S WORK STREAMS:

**Stream 1 (engineering):** Anil fixes #345, #344, #343 in series (types → analytics → cache rebuild), then unblocks by shipping F1–F2 (seller signup magic link + shop creation CRUD). This is blocking-chain work — finish the three in-progress before touching features, then move fast on auth/shop setup because everything downstream depends on it.

**Stream 2 (design):** Chiara ships signup flow (email entry → magic link confirmation), shop creation form (name + slug input), and seller dashboard skeleton (orders table layout, order-detail modal). Three screens; start from design/pages/seller-signup.html, then shop-setup.html, then orders-dashboard.html. No fidelity delay — wireframe + component slots sufficient.

**Stream 3 (tester):** Priya writes Playwright tests for F1 (magic link flow: enter email → check inbox → click link → redirect to shop creation) and F2 (shop creation form: submit name/slug → persist to DB → redirect to dashboard). Cover happy path + one error case per feature.

**Stream 4 (reviewer):** Søren pairs with Anil on the three type-safety fixes (#345, #344, #343); approves once tests pass and container restarts clean. Then review Anil's F1–F2 auth + CRUD code for route hygiene and Stripe readiness.

**Stream 5 (standards_qa):** Vitali audits the three interface fixes for naming consistency (DTO suffixes, model shadowing patterns) and ensures no new violations introduced in F1–F2 work.

**Stream 6 (task_verifier):** Mehrdad verifies #345, #344, #343 closed once Søren approves; then verifies F1 (magic link confirmed in email) and F2 (shop created, slug unique, accessible at /shop/[slug]).

---

## ROLE PLAN:

- **engineering: YES** — Anil owns three blocking type-safety tasks + F1–F2 (auth + shop CRUD); 60–80 tool calls available; can ship both in parallel with fixes.
- **review: YES** — Søren gates the three critical fixes and F1–F2 code; prevents tech debt from compounding.
- **design: YES** — Chiara ships three wireframes (signup, shop creation, dashboard) in parallel; designer stays 1–2 days ahead of engineer to unblock build.
- **test: YES** — Priya writes Playwright for F1 + F2 as Anil ships; tests land same day, real user click coverage.
- **task_verifier: YES** — Mehrdad confirms all closed work is actually closed (not half-done); prevents ghost tasks.
- **standards_qa: YES** — Vitali enforces type naming on the three fixes and new code; one small win today prevents 10 refactors later.
- **connectivity_qa: NO** — Routes + auth not live yet; wait until F1–F2 hit staging.
- **design_qa: NO** — No shipped UI to QA until Chiara's wireframes + Anil's pages render; restart tomorrow.
- **requirements: NO** — Product spec locked; no new feature discovery needed; PM overhead is waste at this stage.

---

## ONE-LINE SUMMARY:

Today the team repairs three blocking type-safety bugs, ships seller signup (magic link) + shop creation (CRUD) in parallel with design + tests, and proves the auth + shop creation flow works end-to-end.
