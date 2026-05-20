# Day 100 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 172
- **Saved:** 20/05/2026, 7:24:58 PM

---

FINISHED:
- Project infrastructure (Dockerfile, .env.example, .gitignore, deployment config) — team can run locally and deploy
- Account deletion route stub (app/api/account/delete/route.ts) — auth scaffold started
- Project metadata and integration config files — qadar scaffolding complete

PENDING:
- No seller signup flow (F1) — magic link auth not yet built
- No shop creation (F2) — seller dashboard doesn't exist
- No product CRUD (F3) — product model and routes not implemented
- No storefront (F5) — public /shop/[slug] page missing
- No Stripe integration (F9, F10) — Stripe webhook handler and checkout flow not wired
- No seller order dashboard (F11) — order table UI and data fetching missing
- Database schema not finalized — unclear if using PostgreSQL or other; migrations not written

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Build database schema (users, shops, products, orders tables with migrations), ship seller signup with email magic link (F1), and wire product CRUD routes (F3). This unblocks designer and tester on the happy path. Reference F1, F3 in task board.
- Stream 2 (designer): Ship shop creation flow (F2 — form mockup), product upload form (F3 — upload + image preview UI), and seller order dashboard layout (F11 — table with status dropdown). These are the core seller workflows; unblock engineering on the next wave.
- Stream 3 (tester): Write Playwright tests for seller signup happy path (F1 — email magic link lands, user logs in), product creation (F3 — form submission, image upload, product appears in list), and order status update (F12 — seller marks order shipped, UI reflects change). Start with auth and CRUD; ignore Stripe for now.
- Stream 4 (reviewer): Verify database migrations are sound (schema matches product spec), signup flow doesn't expose secrets in logs, and product routes handle missing images gracefully. Code review signup + product CRUD PRs same day.
- Stream 5 (requirements): Write task board for F1–F8 (MVP phase 1) with concrete acceptance criteria tied to Playwright tests; unblock team on what "done" looks like. One task per feature, reference design files from designer, tag as "blocker" or "nice-to-have."

ROLE PLAN:
- requirements: YES — product spec exists but task board is empty; PM must convert spec into concrete tasks with acceptance criteria so team doesn't guess what "done" means
- design_qa: YES — designer will ship 3 pages today; design QA checks fidelity to product spec (forms match spec, labels are clear, no broken flows)
- connectivity_qa: YES — signup, product routes, and order status updates need auth + API validation; connectivity QA verifies routes exist, auth gates work, Stripe webhook structure is correct before tester writes tests
- design: YES — seller workflows (signup, shop creation, product upload, order dashboard) are the critical UI surfaces; designer must ship mockups so engineer has a target and tester has a reference
- engineering: YES — database + signup + product CRUD are the MVP foundation; everything else is blocked until these three land
- review: YES — signup and product routes are security-sensitive (auth, file upload); code review must catch credential leaks, SQL injection, and S3 misconfigs same day
- test: YES — signup and CRUD are the happy path; Playwright tests for these flows verify the team's work and catch regressions before they compound
- task_verifier: YES — as tasks close (F1 signup done, F3 product CRUD done), verifier checks artifacts match task acceptance criteria and test passes
- standards_qa: YES — first real code landing today; enforce naming (camelCase for routes, PascalCase for components), type safety, and no console.log spam before it becomes habit

ONE-LINE SUMMARY:
Today the team ships database schema, seller signup (F1), and product CRUD routes (F3) in parallel while designer mocks shop creation and order dashboard, unblocking wave 2.
