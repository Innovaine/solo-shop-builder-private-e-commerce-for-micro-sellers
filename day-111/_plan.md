# Day 111 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 189
- **Saved:** 21/05/2026, 3:37:45 PM

---

FINISHED:
- 59 of 60 tasks completed; product MVP nearing feature-complete state
- Core infrastructure: Docker, deployment pipeline (DEPLOYMENT.md), environment config
- Seller auth: magic-link signup (F1)
- Shop creation & product management: CRUD, S3 image upload (F2, F3, F4)
- Storefront: public shop pages, category filtering, search (F5, F6, F7)
- Cart & checkout: session storage, Stripe Checkout integration (F8, F9)
- Order pipeline: webhook handler, order creation, seller dashboard, status tracking (F10, F11, F12)
- One route handler live: `/api/account/delete`

PENDING:
- #316: Currency display bug — prices show USD across all pages even when seller selects KWD; needs verification on all currency-aware pages (product list, cart, checkout confirmation, order dashboard)

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #316 currency display across all seller-facing and customer-facing pages (product detail, cart summary, checkout confirmation, order history). Deploy currency state from shop config to all price-rendering contexts. 1–2 hour fix; unblocks task verifier sign-off.
- Stream 2 (designer): Audit all current pages for visual consistency (product detail, cart, checkout, order dashboard, seller settings). Produce one design file per page showing current state vs. corrections needed. Ship corrected mockups for any pages missing or misaligned with MVP spec.
- Stream 3 (tester): Write Playwright tests covering F5–F12 (storefront filtering, cart add/remove, Stripe webhook order creation, order status transition, seller dashboard load). Verify #316 currency fix renders correctly in each context.
- Stream 4 (reviewer): Code review #316 fix and any refactoring needed for currency state management. Verify tests pass before merge.
- Stream 5 (connectivity_qa): Spot-check all API routes for correct status codes, auth headers, webhook signature validation. Confirm Stripe webhook delivery is configured and functional.
- Stream 6 (task_verifier): Confirm #316 closed by testing in browser across all pages (USD → KWD toggle). Sign off on task before engineer deploys.

ROLE PLAN:
- requirements: NO — spec is locked, no new scope this cycle; Kenji's time better spent unblocking the team mid-day if a question arises
- design_qa: YES — one final visual consistency pass before v1 launch; catch any misaligned states in existing pages
- connectivity_qa: YES — webhook integration is critical path to order creation; must verify Stripe signature validation and delivery before we call this done
- design: YES — designer ships visual audit mockups; MVP pages need one final polish pass before paying customers land
- engineering: YES — currency bug is the only blocker left; fix is small, high-confidence, unblocks final sign-off
- review: YES — currency refactor needs review to ensure all price contexts receive shop currency correctly
- test: YES — Playwright test suite for F5–F12 is the gate before launch; tester writes tests for every user flow
- task_verifier: YES — #316 must be verified in running browser before close; Mehrdad spot-checks all currency states
- standards_qa: YES — code review hygiene; ensure #316 fix follows project conventions before merge

ONE-LINE SUMMARY:
Today the team ships #316 currency fix, audit all MVP pages for visual polish, and build the Playwright test suite for storefront + order flows in parallel.
