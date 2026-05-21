# Day 112 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 190
- **Saved:** 21/05/2026, 4:29:28 PM

---

FINISHED:
- F1–F12 (MVP feature set) + analytics dashboard, billing dashboard, product management UI — 53 tasks closed, app deploys to Docker
- Currency formatter logic shipped across 5 pages (day 111), waiting for tsconfig.json fix to compile
- Seller dashboard, order management, Stripe integration, product image upload to S3, public storefront all live and tested

PENDING:
- **BLOCKER: tsconfig.json path alias misconfiguration** — `@/lib/currency` import fails, Docker build will not complete until fixed. Engineer must resolve before shipping day 112.
- 6 open currency bugs (#317, #318, #319, #320, #321, #322) — all KWD support and USD-only regressions introduced by day 111 formatter work. Related to same import failure.
- 1 in-progress: #316 (currency reflection across all pages) — blocked by tsconfig fix.

TODAY'S WORK STREAMS:
- **Stream 1 (engineering):** Fix tsconfig.json path alias immediately, verify Docker build succeeds, then ship #317 (KWD support in dashboard), #319 (CSV export), and #321 (product price display). These are all formatter-dependent and will unblock the currency bugs once the build passes.
- **Stream 2 (design):** Ship page mockups for analytics dashboard back-button fix (#322 context), and verify billing/product dashboard KWD currency display layout is correct. One file: design/pages/dashboard-kwd-currency.html.
- **Stream 3 (tester):** Write Playwright tests for currency display on product detail page (F5), order dashboard (F11), and billing dashboard — validate USD and KWD render correctly. Also test CSV export functionality (F-new).
- **Stream 4 (connectivity QA):** Verify Stripe webhook still fires correctly after formatter changes, check auth flow for sellers accessing dashboard, validate API responses include correct currency fields.
- **Stream 5 (task verifier):** Once engineer ships #317–#321, Mehrdad verifies each against the currency spec — seller selects currency, it reflects everywhere, export includes currency code.

ROLE PLAN:
- engineering: YES — tsconfig fix is critical path, 5 open tasks are all shipping work, not blocked on design/test.
- review: YES — tsconfig fix and formatter code must pass review before merge; currency features need verification post-deploy.
- design: YES — analytics and billing dashboards need KWD layout validation, back-button UX spec for #322.
- connectivity_qa: YES — currency changes touch API response contracts, auth flows must hold.
- design_qa: YES — fidelity check on KWD currency display across 5 pages (dashboard, product, billing, analytics, order detail).
- test: YES — currency is now a multi-page feature, Playwright coverage needed.
- task_verifier: YES — 6 currency tasks all need proof before close.
- requirements: NO — scope is locked, all tasks are refinement of existing features.
- standards_qa: NO — not a code-style round, tsconfig and formatter are higher priority.

ONE-LINE SUMMARY:
Today the team fixes the tsconfig blocker, ships KWD currency support across 5 pages and CSV export in parallel, and validates currency display + Stripe integration hold under new formatter logic.
