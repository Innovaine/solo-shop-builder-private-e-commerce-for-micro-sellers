# Day 24 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 55
- **Saved:** 16/05/2026, 8:07:51 PM

---

FINISHED:
- Docker image builds successfully (8 import/export path fixes from day 23)
- Prisma schema compiles; migration P3009 is rolled back but unresolved
- Auth endpoints exist (signup, verify, logout routes in app/api/auth/)
- Checkout and orders API stubs present but unreachable due to import errors
- Database schema defined (Prisma models for User, Shop, Product, Order, OrderItem)

PENDING:
- #59: Prisma migration P3009 must be resolved (`npx prisma migrate resolve --rolled-back`) before any feature code runs — blocking all FR tasks
- #61, #60: Product image upload + CRUD forms depend on migration fix
- #62, #63, #64: Verify page, category dropdown, category filter depend on working product schema
- #66: Playwright tests cannot run until app is deployable
- Design system components.html (#58) not yet shipped — blocks UI consistency across all feature pages
- Stripe checkout wired but no order-to-webhook flow tested end-to-end

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Resolve migration P3009 immediately, then ship #61 (image upload handler) and #60 (product CRUD forms) in parallel — these unblock all downstream storefront work. Reference Prisma docs for S3 image path handling. Target: uploadable images + saveable products by EOD.
- Stream 2 (designer): Ship design/pages/verify.html (#62), design/pages/product-management.html (#60 UI mockup), and design/system/components.html (#58) in parallel — all use the same button/form/card tokens. Focus: verify flow, product form (title/price/description/image), category dropdown. Don't wait for engineer; provide Figma links and HTML by noon.
- Stream 3 (tester): Write Playwright tests for #61 (image upload success/fail paths), #60 (CRUD: create/edit/delete product), #62 (verify link email → dashboard redirect), #63/#64 (category filter works on storefront). Tests run after engineer merges; target 8–12 test cases total.
- Stream 4 (reviewer): Verify migration rollback succeeded (check database state post-fix), code-review #61 + #60 for S3 path safety and form validation, ensure email verification flow doesn't leak seller identity. Green-light only after #59 is resolved.
- requirements: One line on whether category taxonomy is final (Handmade, Vintage, Supplies, Other) or if new categories can be added dynamically by seller — impacts #63 scope.

ROLE PLAN:
- engineering: YES — migration is a hard blocker; unblocking it unlocks 5 features today. Anil has the context and knows the codebase state.
- review: YES — every merged PR today touches database or payment paths; Søren must verify migration safety and no regressions in auth flow.
- design: YES — verify page, product management UI, and design system components are shipped independently of engineer progress; Chiara unblocks the team visually while engineer solves infrastructure.
- test: YES — Playwright suite grows as engineer ships; Priya writes tests in parallel to keep coverage ahead of features, not behind.
- requirements: YES — one clarification call on category model (fixed vs. dynamic) takes 10 minutes and removes ambiguity from #63.

ONE-LINE SUMMARY:
Today the team resolves the migration blocker, ships product CRUD + image upload + verify page UI + design system in parallel, and writes full Playwright coverage — 5 features unblocked by EOD.
