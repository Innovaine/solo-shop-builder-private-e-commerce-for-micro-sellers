# Day 24 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 56
- **Saved:** 16/05/2026, 8:31:02 PM

---

FINISHED:
- Docker image builds successfully (app/api auth routes + checkout route structure in place)
- Prisma schema defined; migration P3009 blocked execution
- Import/export paths corrected across 8 files (Søren's review, day 23)
- Task board created: 15 completed, 16 open, 1 in-progress

PENDING:
- #68: Prisma migration P3009 must be rolled back (`npx prisma migrate resolve --rolled-back`) before app runs — this is the hard blocker
- #59: Import path corrections in checkout + orders pages (partially fixed, verify against live routes)
- Design system components (FR-2, FR-4, FR-6 UI pages) not yet shipped — blocking 5 engineer tasks
- No Playwright tests written yet (test board empty)
- Myfatoorah integration (#67) marked open but not prioritized (HOLD — Stripe is sufficient for MVP)

TODAY'S WORK STREAMS:

- **Stream 1 (engineer):** Anil: (1) Resolve Prisma P3009 migration immediately—this unblocks everything. (2) Ship #70 (product CRUD API: create/read/update/delete endpoints + category filtering). (3) Ship #61 (image upload handler to S3). By EOD, Anil should have a working product list endpoint returning from database and images uploaded to S3.

- **Stream 2 (designer):** Chiara: Ship design/pages/verify.html, design/pages/product-management.html, and design/pages/storefront.html (includes category filter UI). These unblock #69, #60, #63, #64. Design system components (buttons, forms, cards) live in design/system/components.html — finalize by 2pm so engineer can reference.

- **Stream 3 (tester):** Priya: Write Playwright tests for #70 (product CRUD endpoints), #61 (image upload), #64 (category filter on storefront). Tests run against live Docker image once Anil's work lands. Aim for 3 test suites covering happy path + failure cases (missing image, invalid category, duplicate product name).

- **Stream 4 (reviewer):** Søren: Verify Anil's Prisma migration fix works (app actually runs). Code-review #70 + #61 endpoints for SQL injection, proper error handling, S3 permissions. Spot-check Chiara's design handoff (does it match product spec FRs).

- **Stream 5 (requirements):** Kenji: One task — confirm with Fatima that Myfatoorah (#67) stays parked. Stripe is live; Myfatoorah adds complexity with zero customer signal. If decision holds, close #67 as WONTFIX.

ROLE PLAN:
- engineering: YES — Prisma blocker must be resolved today; product CRUD API and image upload are critical path to functioning shop by day 28.
- review: YES — Migration fix must be verified; API code must pass security baseline before Priya tests against it.
- design: YES — Verify page, product management UI, and storefront filter pages are shipping blockers; engineer cannot build without them.
- test: YES — Priya writes tests in parallel; tests land same day as engineer code so team ships with coverage.
- requirements: YES — One decision call (Myfatoorah hold-or-go) clears ambiguity and keeps backlog clean.

ONE-LINE SUMMARY:
Today the team unblocks the database, ships product CRUD API + image upload + category filtering backend, designs verify/product/storefront UI pages, and writes Playwright tests for all three—parallel execution across all 5 streams.
