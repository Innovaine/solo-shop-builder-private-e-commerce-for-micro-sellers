# Day 90 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 160
- **Saved:** 20/05/2026, 11:42:16 AM

---

FINISHED:
- Seller account deletion endpoint (app/api/account/delete/route.ts) — stub created, wired but not tested
- Docker + deployment pipeline working end-to-end (Dockerfile, .dockerignore, DEPLOYMENT.md) — health check passing at https://www.soloshopbox.com/api/health
- TypeScript compilation fixed — @types/node added to tsconfig.json; build succeeds
- Shop storefront template string fixed (params.slug → shop.slug); no broken refs remain in core paths
- 55 tasks closed across F1–F12 (seller signup, shop creation, product CRUD, S3 images, storefront, cart, Stripe, orders, dashboard, status updates)

PENDING:
- #258: S3 env values read at compile time instead of runtime — causes wrong bucket/region on startup (BLOCKER for image upload in prod)
- #257: import/route.ts validation still using manual string checks instead of zod schema (tech debt, not blocking ship)
- #256: import/route.ts manual cookie parsing instead of requireAuth() helper (tech debt, not blocking ship)
- #255: route-validator shows 3 broken template strings, 4 orphans, 1 method mismatch — needs audit pass
- #254: @types/node added but TypeScript may still fail on Node APIs in other routes — needs full compile check
- Seller account deletion (F-not-in-spec) exists as stub; no delete logic, no cascade cleanup, no test

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #258 (S3 env runtime loading) immediately — this breaks production image upload; then hit #256 (swap to requireAuth() in import/route.ts) and #257 (zod validation refactor) while test suite runs. These are the 3 critical fixes from day 89 audit. Deploy after each fix lands.
- Stream 2 (designer): Ship product-detail.html page mockup (customers need to see full product before adding to cart — currently missing from storefront), and refine order-detail.html for seller dashboard (track shipment view for customer). Two pages, both live designs needed before engineer can wire customer-facing flows.
- Stream 3 (tester): Write Playwright tests covering F3 (product CRUD), F4 (image upload to S3), F5 (storefront rendering), F9 (Stripe Checkout redirect). These are customer-critical paths that haven't been tested end-to-end yet. Run in parallel with engineer's fixes.
- Stream 4 (connectivity_qa): Audit #255 (route-validator wiring) — trace all 3 broken template strings, 4 orphans, 1 method mismatch to source; confirm import/route.ts, product routes, order routes are wired correctly before engineer ships fixes.
- Stream 5 (review): When engineer pushes fixes for #258/#256/#257, verify they compile, health check still passes, no regressions in closed tasks.
- Stream 6 (task_verifier): Confirm #258 fix works in staging (S3 read at runtime, correct bucket on startup). Confirm #256 swap to requireAuth() doesn't break seller auth flow.
- Stream 7 (standards_qa): Audit #254 full TypeScript compilation across all /api routes — ensure @types/node doesn't hide new Node API usage errors in untested paths.

ROLE PLAN:
- engineering: YES — 3 critical audit fixes (#258, #256, #257) are blocking production stability and seller auth; Anil owns all three
- review: YES — these fixes need immediate verification that health check holds and no regressions surface
- design: YES — product-detail and order-detail pages are missing from storefront; tester can't write end-to-end tests without mockups to work from
- connectivity_qa: YES — #255 wiring audit must happen before engineer deploys, or we ship with broken routes
- test: YES — F3–F9 have zero test coverage; parallel test writing unblocks confidence in engineer's fixes
- task_verifier: YES — #258 is a blocker; needs staging proof that S3 now reads at runtime
- standards_qa: YES — @types/node addition may mask new errors; full compile audit needed before ship
- design_qa: NO — fidelity check can wait 1 day; wiring and tests are higher priority
- requirements: NO — spec is locked; no new features today, only audit + fixes

ONE-LINE SUMMARY:
Today the team ships S3 runtime-env fix, auth refactor, two storefront pages, and F3–F9 test coverage in parallel—ship by EOD after wiring audit clears.
