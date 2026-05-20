# Day 107 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 184
- **Saved:** 21/05/2026, 2:39:46 AM

---

FINISHED:
- 56/60 tasks closed; app architecture (auth, email, Prisma schema) refactored to production standards
- Seller signup, shop creation, product CRUD, image upload to S3, public storefront, cart, Stripe Checkout wiring all shipped and in warehouse
- OrderDetailClient.tsx refactored to import Order/OrderItem types from Prisma (task #306–308 completed structurally)
- Dockerfile and deployment config in place; environment setup documented

PENDING:
- **BLOCKER**: TypeScript build failure — OrderDetailClient.tsx:134 passes Prisma `Date` type to `formatDate()` expecting `string`; must be fixed before app starts or any feature can be verified
- Task #312: sessionOptions runtime loading (auth.ts)
- Task #311: nodemailer lazy initialization (email.ts)
- Task #310: Date type mismatch fix (the actual runtime repair, not just the interface import)
- No smoke tests run yet; no live server; no feature verification since day 106

TODAY'S WORK STREAMS:
- **Stream 1 (engineer)**: Fix task #310 (Date type mismatch in formatDate call — convert Prisma Date to string or change utility signature), complete task #312 (sessionOptions runtime read), complete task #311 (nodemailer lazy getter). Unblock the build so app can start.
- **Stream 2 (designer)**: Ship dashboard layout mockup (seller order list view), order detail page (status dropdown UI), and product list admin page (edit/delete affordances). Reference design/pages/seller-orders.html, design/pages/order-detail.html, design/pages/products-admin.html.
- **Stream 3 (tester)**: Write Playwright tests for FR-11 (seller order dashboard loads + displays orders), FR-12 (order status update via dropdown), FR-1 (email magic link signup flow). Tests depend on app starting, so unblock #310 first.
- **Stream 4 (reviewer)**: Once engineer ships #310, #311, #312, verify build passes TypeScript check and app starts in Docker. Smoke test: curl shop homepage, verify Stripe webhook listener is wired.
- **Stream 5 (requirements)**: Document the 4 remaining open tasks as acceptance criteria; confirm with Anil if there are hidden dependencies blocking the Date fix.
- **Stream 6 (connectivity QA)**: Test /api/orders webhook route (Stripe → order creation), test auth session persistence across requests, test S3 image upload/CDN route.
- **Stream 7 (standards QA)**: Audit the sessionOptions and nodemailer refactors (#312, #311) for module-scope leaks; check that runtime initialization is correct.
- **Stream 8 (task verifier)**: Confirm tasks #310, #311, #312 are closure-ready once engineer ships; mark closed only if build passes.

ROLE PLAN:
- engineering: YES — 3 blocking tasks (#310, #311, #312) are the only thing stopping the app from compiling; engineer must ship these in parallel to unblock the full team.
- review: YES — app doesn't run; code review gates whether testing, deployment, and feature verification can start today.
- design: YES — seller dashboard and order management UX are critical path for customer signal; ship mockups in parallel so engineer has reference and tester has design to write against.
- test: YES — once #310 ships, smoke tests and Playwright suites for FR-1, FR-11, FR-12 are the second wave to verify the 56 closed tasks actually work.
- connectivity_qa: YES — webhook wiring and auth session behavior are not yet verified in live environment; must run in parallel with engineer's fixes.
- standards_qa: YES — the refactors in #311, #312 are runtime-critical; need sign-off that module-scope leaks are eliminated before deploy.
- task_verifier: YES — close out the 4 open tasks once engineer + reviewer confirm they meet acceptance; unblock next cycle.
- design_qa: NO — design fidelity check happens after design ships mockups; premature today.
- requirements: YES — confirm task definitions with engineer; no blockers should be hidden.

ONE-LINE SUMMARY:
Engineer fixes the TypeScript build (#310, #311, #312) while designer ships dashboard mockups and tester preps Playwright suites; reviewer gates compilation, connectivity QA stress-tests webhooks + auth, and standards QA clears the refactors for deploy.
