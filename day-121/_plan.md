# Day 121 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 205
- **Saved:** 22/05/2026, 12:31:14 AM

---

FINISHED:
- 57 tasks completed across MVP scope (F1–F12 partially or fully shipped based on task board)
- Dockerfile + deployment infrastructure in place (DEPLOYMENT.md, .env.example exist)
- Stripe webhook integration wired (order creation from payment_intent.succeeded)
- Product image upload to S3 pipeline scaffolded (.qadar files suggest prior integration testing)
- Shopping cart session storage (localStorage client-side) implemented
- Order dashboard view exists (app/dashboard/orders/page.tsx)

PENDING:
- #345: OrderCount interface duplication in app/dashboard/orders/page.tsx — Anil blocked, needs standards cleanup
- #344: ProductAnalytics interface shadowing Prisma model in app/api/analytics/route.ts — Anil blocked, needs standards cleanup
- #343: npm cache corruption (graceful-fs) — container won't start, Anil blocked on toolchain
- F2 completion: Shop creation slug generation & uniqueness check (inferred from task count — 57/60 done, 3 critical blockers)
- F7 completion: Category filter on storefront (likely incomplete, blocked by standards issues upstream)

TODAY'S WORK STREAMS:
- **Stream 1 (engineering — Anil)**: Clear the three CRITICAL blockers first (resolve npm cache in #343, fix interface duplication #345, dedup analytics #344) so app container runs. Then ship F6 category assignment dropdown + F7 category filter logic in parallel. These unblock the storefront for QA and don't require design changes.
- **Stream 2 (designer — Chiara)**: Ship F5 storefront page layout (product grid, product detail page, category filter UI) and order tracking page mockup (for customer shipment visibility, F12 dependency). Both are static pages that engineer can wire once containers are healthy.
- **Stream 3 (tester — Priya)**: Write Playwright tests for F1 (email magic link signup flow), F9 (Stripe Checkout redirect), and F10 (webhook order creation). These are the highest-risk happy-path flows. Run them against staging once #343 is resolved.
- **Stream 4 (connectivity QA — Zainab)**: Verify Stripe webhook routing is live (F10), confirm email magic link lands (F1), test /shop/[slug] and /shop/[slug]/products/[id] routes are 200. Hit them from browser and curl.
- **Stream 5 (standards QA — Vitali)**: Enforce interface naming (no duplication, DTO vs model separation) across app/api and app/dashboard before engineer ships more endpoints. One-line style doc, apply to #345 and #344.

ROLE PLAN:
- engineering: YES — three critical blockers actively preventing builds; Anil needs to unblock toolchain and standards before feature work can proceed in parallel.
- review: YES — code review on #345, #344, #343 resolutions; also review F6/F7 logic once Anil submits.
- design: YES — storefront and order tracking pages are not yet mocked; Chiara can ship these in parallel while Anil clears blockers, no dependency.
- connectivity_qa: YES — webhook and route testing is independent of blockers; Zainab can verify F1, F9, F10 routing while engineering clears standards.
- standards_qa: YES — #345 and #344 are explicitly STANDARDS-CRITICAL; enforce fix before Anil ships F6/F7 to prevent interface sprawl.
- test: YES — Playwright tests for F1, F9, F10 (happy paths only, high signal) can be written in parallel; they run once container is up.
- task_verifier: YES — verify #345, #344, #343 resolutions are actually merged and container boots before team calls the blockers closed.
- requirements: NO — no new feature discovery needed; we have 60 open tasks and 57 complete; PM work is to unblock execution, not add scope.
- design_qa: NO — no live UI to QA yet; defer until Chiara ships storefront mocks and Anil wires them.

ONE-LINE SUMMARY:
Today the team unblocks the three critical infrastructure/standards issues in parallel with design shipping storefront pages, connectivity testing Stripe/auth routes, and tester writing F1/F9/F10 happy-path Playwright flows.
