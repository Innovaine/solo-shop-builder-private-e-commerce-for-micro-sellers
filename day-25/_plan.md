# Day 25 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 57
- **Saved:** 16/05/2026, 8:56:13 PM

---

FINISHED:
- App builds and runs on localhost:3000 after Prisma P3009 database repair (day 24)
- 17 tasks closed across auth, checkout, and orders infrastructure
- Dockerfile + deployment config in place; .qadar metadata tracking integrations
- Auth routes (signup, verify, logout) scaffolded; Stripe webhook handler live

PENDING:
- Import path errors blocking checkout + orders pages (#59) — must fix before payment features land
- Design system components.html not shipped yet (#58) — blocks UI work on verify/product forms
- No feature UI shipped yet — all 15 open tasks are features waiting for designer + engineer to converge
- Product CRUD API exists but no UI layer (#70); category filter (#64, #7) API-ready but UI stub only
- Playwright test suite empty — no coverage for any FR yet (#66)

TODAY'S WORK STREAMS:

- Stream 1 (engineer): Fix import paths in checkout + orders (#59) first (15 min), then ship product CRUD API + image upload handler (#70, #61) in parallel with order dashboard API (#71). These three unblock the designer and tester. Target: 3 API routes + image S3 integration working on localhost by EOD.

- Stream 2 (designer): Ship verify page UI (#62), product management forms UI (#60, #63), and design system components.html (#58) — these are the three blockers for engineer's UI layer. Once components.html lands, engineer can wire them into checkout + storefront. Target: 3 pages in design/pages/, 1 components file.

- Stream 3 (tester): Write Playwright tests for product CRUD happy path (create product, upload image, list products, filter by category) + email verify flow (#66). Don't wait for UI — test the API routes as engineer ships them, then layer UI tests on once designer's pages land. Target: 8–12 tests covering FR-2, FR-4, FR-6, FR-7.

- Stream 4 (reviewer): Verify import path fix (#59) doesn't break other routes, then spot-check product API routes (#70, #61) for S3 integration correctness + database writes. Final check: all three streams' output loads on localhost:3000.

- requirements: NO — spec is locked; Kenji can stand down today.
- test: YES — Priya writes tests against engineer's API output in real time; unblocks design + review feedback loop.

ROLE PLAN:
- engineering: YES — Three critical API features (#59, #70, #61) are sequential fixes that unblock designer and tester; we cannot hit storefront by day 28 without these routes live today.
- design: YES — Three UI pages (#62, #60, #58) are the direct blocker for engineer's day 26–27; ship them in parallel with engineer's API work so day 26 is pure wiring.
- test: YES — Priya tests API routes live as Anil pushes them; catches import/S3 bugs before they cascade; gives engineer confidence to move fast.
- review: YES — Søren verifies the import fix doesn't regress, spot-checks new routes for auth scope + database correctness, signs off on localhost build.

ONE-LINE SUMMARY:
Today the team ships import path fix + product CRUD API + image upload + order dashboard API (engineer), verify page + product forms + design system (designer), and product/verify/category Playwright tests (tester) in parallel — all three streams unblock day 26 UI wiring.
