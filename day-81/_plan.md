# Day 81 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 145
- **Saved:** 19/05/2026, 5:43:58 PM

---

FINISHED:
- 58 of 60 board tasks closed; product architecture stable (Dockerfile, .env, API scaffold live)
- Day 80 code review completed: 65 gray-* colors replaced with brand tokens in app/dashboard/orders/page.tsx
- Seller signup, shop creation, product CRUD, S3 image upload, public storefront, Stripe Checkout integration, order webhook ingestion, seller order dashboard, and order status updates all shipped and verified
- MVP scope (F1–F12 from spec) feature-complete and callable

PENDING:
- #225: One gray-* color remains in getStatusBadgeColor() fallback (line 153, app/dashboard/orders/page.tsx); must replace 'bg-gray-100 text-gray-800' with 'bg-whisper text-charcoal' — trivial 1-line fix blocking design debt closure
- #234: Prisma import pattern standardization across 10 API routes (default → named import); blocks code consistency and reduces Søren's review load; Anil assigned but not yet started

TODAY'S WORK STREAMS:
- Stream 1 (engineering): Close #225 (1-line gray-* fix) and #234 (Prisma import sweep across checkout/orders/products/auth routes — 10 routes, ~30 min). Then attack post-MVP usability: seller product bulk-upload (CSV → S3), customer email receipt on order, seller email notification on new order. Reference F3 expansion + new F13, F14 capability.
- Stream 2 (design): Ship seller onboarding flow (shop-setup wizard, 3-screen mockup); product upload form with image preview; order detail modal (show customer address, items, status history). Reference storefront and dashboard UX hardening before customer testing starts.
- Stream 3 (tester): Write Playwright tests for F1 (magic link signup), F5 (storefront loads + product detail), F9 (Stripe Checkout redirect), F10 (webhook → order creation), F11 (order table renders). Run full suite after engineering deploys; verify no regressions on gray-* fix.
- Stream 4 (review): Verify #225 fix + #234 sweep merge cleanly; spot-check Prisma imports against .eslintrc / tsconfig; confirm no auth/route breakage post-import refactor.
- Stream 5 (standards_qa): Enforce Prisma import pattern in #234; confirm all 10 routes follow named-import convention; add linter rule if not already present to prevent regression.

ROLE PLAN:
- engineering: YES — two open tasks + three new post-MVP features can ship in parallel; runway is critical, speed over polish
- review: YES — code quality debt (#225, #234) must clear before new features land; Søren's spot-checks catch import breakage
- design: YES — onboarding and order detail UX are bottlenecks for customer handoff; ship mockups in parallel with engineering's feature work
- test: YES — coverage on F1–F11 is mandatory before we claim MVP is done; Playwright suite protects against regressions as Anil refactors
- task_verifier: YES — Mehrdad confirms #225 and #234 close cleanly; spot-checks gray-* colors in browser and Prisma routes in codebase
- connectivity_qa: YES — verify Stripe webhook routes don't break during #234 import refactor; confirm auth routes still accept magic-link tokens
- standards_qa: YES — enforce named-import pattern in #234; add linter rule to prevent future drift
- design_qa: NO — design system is locked (brand tokens done); only needed if new components ship
- requirements: NO — MVP is feature-locked; post-MVP prioritization (bulk upload vs. email vs. analytics) happens in next cycle review
- (no design_qa needed today)

ONE-LINE SUMMARY:
Today the team closes two code-debt tasks, ships three post-MVP features (bulk upload, order emails, seller notifications), designs onboarding + order detail UX, and hardens test coverage on F1–F11 — all in parallel.
