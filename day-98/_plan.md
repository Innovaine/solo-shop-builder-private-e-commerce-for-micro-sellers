# Day 98 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 169
- **Saved:** 20/05/2026, 5:35:27 PM

---

FINISHED:
- 58 closed tasks across MVP scope (product CRUD, shop creation, Stripe integration, order dashboard wiring)
- Deployment pipeline live (Dockerfile, .env.example in place)
- Core data model and routes structured (app/api/account/* exists)
- Day 97 code review completed (review.md written, no blocking feedback flagged)

PENDING:
- #280: Duplicate s3.ts file shadows lib/s3.ts (WIRING-CRITICAL, unassigned)
- #255: route-validator shows 3 broken template strings, 4 orphans, 1 method mismatch (WIRING-CRITICAL, BLOCKED)
- No test coverage visible in warehouse listing — Playwright tests for F1–F12 not yet written
- Design QA pass on storefront + order dashboard UX never run (no design_qa record)
- Connectivity validation never run on Stripe webhook → order creation (no connectivity_qa record)

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Unblock #255 (fix route-validator issues) and close #280 (remove duplicate s3.ts). Then ship product image resize/CDN logic for F4 and order status update endpoint for F12. Reference task board for exact scope.
- Stream 2 (designer): Ship product detail page mockup (storefront detail view) and seller order dashboard layout (F11 visual). These unblock engineer's storefront rendering and feed tester's coverage of customer + seller happy paths.
- Stream 3 (tester): Write Playwright tests covering F1 (email signup), F5 (storefront render), F9 (Stripe Checkout redirect), F10 (webhook creates order), F12 (status update). Run tests against deployed URL by EOD.
- Stream 4 (reviewer): Verify #255 and #280 fixes compile + route structure is clean. Run connectivity check on Stripe webhook handling before tester runs payment flow test.
- Stream 5 (connectivity_qa): Validate Stripe webhook endpoint receives POST, parses payment_intent.succeeded, creates order row without data loss. Run before tester's E2E payment test.
- Stream 6 (design_qa): Fidelity check on storefront (F5, F7 category filter) and seller dashboard (F11). Compare to product spec — ensure mobile-responsive at minimum.
- Stream 7 (standards_qa): Enforce TypeScript strict mode, env var naming (all .env keys match .env.example), S3 client consistency post-#280 fix.

ROLE PLAN:
- engineering: YES — two WIRING-CRITICAL blockers are day-zero work; unblocking #255 and #280 lets the rest of the week compound
- review: YES — blockers need verification before engineer ships new features on top
- design: YES — storefront and dashboard layouts are overdue; these unblock tester's E2E scenarios and prevent engineer rework
- connectivity_qa: YES — Stripe webhook is the revenue heartbeat; validate it before payment tests run
- design_qa: YES — storefront is customer-facing; fidelity check prevents scope creep later and catches responsive issues early
- test: YES — 58 tasks closed with zero test coverage is a speed debt; tests run in parallel with new features and catch regressions
- standards_qa: YES — S3 duplicate and route-validator chaos suggest drift in code hygiene; lock it down before feature velocity accelerates
- task_verifier: YES — blockers close and new tasks ship fast; someone must verify they're actually done
- requirements: NO — task board is clear; PM overhead would slow parallel execution today

ONE-LINE SUMMARY:
Today the team unblocks wiring (routes + S3), ships storefront design + order dashboard layout in parallel, and writes tests covering signup through payment, while connectivity validates the Stripe webhook integration.
