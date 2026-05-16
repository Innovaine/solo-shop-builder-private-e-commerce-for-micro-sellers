# Day 27 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 62
- **Saved:** 16/05/2026, 11:02:58 PM

---

FINISHED:
- Auth verification route (app/api/auth/verify/route.ts) — magic link email signin implemented
- Checkout flow skeleton (app/api/checkout/route.ts) — Stripe integration points stubbed
- Dashboard page structure (app/dashboard/page.tsx) — order list UI frame ready
- Docker + deployment config (Dockerfile, DEPLOYMENT.md, .env.example) — container build ready once dynamic exports are added
- 17 closed tasks across auth, product CRUD API, and order schema foundation

PENDING:
- 3 missing `export const dynamic = 'force-dynamic'` declarations blocking npm run build (app/auth/verify/page.tsx, app/api/checkout/route.ts, app/dashboard/page.tsx) — fix takes 5 minutes, must happen before any deploy
- Product CRUD API fully wired but image upload handler (FR-4) still needs S3 integration test
- Order dashboard UI (FR-12) started by Anil but customer tracking page (FR-14) not yet designed
- Playwright test suite stub exists but 0 tests written for F1–F20 MVP features
- Design system components.html referenced in #58 not yet shipped to designer workspace

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix the 3 missing dynamic exports (5min), then attack FR-4 image upload S3 integration, FR-7 category filter API, and FR-12 order dashboard completion in parallel — unblock Priya's test writing and push toward a deployable build by EOD.
- Stream 2 (designer): Ship verify page UI (FR-2 frame), product management page UI (FR-3/FR-60 forms), category dropdown component (FR-6), and storefront product card component — these unblock Anil's frontend wiring and give Priya visual specs to test against.
- Stream 3 (tester): Write Playwright smoke tests for FR-1 (signup), FR-2 (verify), FR-5 (storefront load), FR-9 (cart add), FR-10 (checkout redirect) — cover the critical path before digging into product CRUD tests; once Anil ships FR-4 and FR-7, write tests for those same day.
- Stream 4 (reviewer): Verify the 3-line dynamic export fix rebuilds cleanly, spot-check new image upload handler for S3 credential leaks, validate Priya's test assertions match spec (test what customer clicks, not what the unit test inventor thought was clever).
- Stream 5 (requirements): Confirm category list is final (Handmade, Vintage, Supplies, Other) and locked for FR-6/FR-7 — no mid-sprint scope creep.

ROLE PLAN:
- engineering: YES — 3 files need 1-line fixes to unblock deployment; 4 open features (FR-4, FR-7, FR-12, FR-14) can ship in parallel without blocking each other.
- design: YES — 4 distinct pages/components (verify, product management, category filter, storefront card) are queued and unblock engineer's frontend wiring.
- test: YES — Playwright suite is stubbed; team can't prove F1–F10 work until Priya writes assertion-per-user-action; parallel to engineer shipping new code.
- review: YES — Build fix must be verified before shipping, and image upload handler needs security review before touching S3.
- requirements: YES — Category list scope lock prevents engineer churn and designer rework mid-day.

ONE-LINE SUMMARY:
Today the team fixes the 3-line build blocker, ships verify/product/dashboard UI and image upload + category filter APIs in parallel, and writes smoke tests to prove the signup→product→checkout→order critical path works end-to-end.
