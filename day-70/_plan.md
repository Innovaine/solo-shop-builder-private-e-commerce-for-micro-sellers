# Day 70 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 134
- **Saved:** 18/05/2026, 9:10:01 PM

---

FINISHED:
- Seller authentication via email magic link (F1) — .env.example, Dockerfile, app/api/account/delete/route.ts in place, deployment infrastructure ready
- Shop creation (F2) — slug generation and basic info capture implemented
- Product CRUD (F3) — create, read, update, delete product operations complete
- Product image upload to S3 (F4) — image handling and CDN serving functional
- Public shop storefront (F5) — /shop/[slug] pages rendering product lists
- Category assignment (F6) — fixed category dropdown in product creation flow
- Product search/filter by category (F7) — category filtering on storefront working
- Shopping cart in browser session storage (F8) — localStorage persistence functional
- Stripe Checkout integration (F9) — hosted checkout redirect complete
- Order creation from Stripe webhook (F10) — payment_intent.succeeded triggering order records
- Seller order dashboard (F11) — basic order table rendering
- Order status updates (F12) — dropdown status mutation operational (56 tasks closed to date)

PENDING:
- #205: MyFatoorah callback_error on successful payment — needs payment provider error handling or Stripe fallback
- #204: Orders dashboard shows 0 orders despite webhook firing — data fetch or query logic broken
- #203: Order data load failure — API route returning null or malformed response
- #202: Billing screen fails to load — missing route or permission check on /account/billing or equivalent

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Attack the four data-load blockers in parallel: #204 (debug order dashboard query), #203 (trace order API response), #202 (restore billing screen route + data fetch), #205 (add MyFatoorah error state handling or switch to Stripe-only for now). All four are UI blockers masking working backend — ship working versions by EOD.
- Stream 2 (designer): Ship mockups for seller dashboard refinement (order list detail states, empty state, error state), billing page layout, and order detail modal (F13+). Design 3-4 pages in parallel; don't wait for engineer to finish fixes.
- Stream 3 (tester): Write Playwright tests covering F11 (order dashboard loads and displays real orders), F12 (seller can update order status via dropdown), and F9 (Stripe Checkout redirect succeeds). Tests will unblock engineer's data fixes by confirming which layer is actually broken.
- Stream 4 (reviewer): Verify #204, #203, #202, #205 as they land — each should have a working URL in staging you can curl and click. No merge without proof the data actually loads.
- Stream 5 (PM/Requirements): Interview one active seller (if available) about what order statuses they actually use beyond pending/paid/shipped — informs F12 design. If no seller available, skip this.

ROLE PLAN:
- requirements: NO — no new feature spec needed; the four open tasks are all bug fixes / data-layer issues, not scope creep.
- design_qa: YES — four broken screens need fidelity check before engineer ships fixes; catch layout/state issues now.
- connectivity_qa: YES — all four blockers are API/route/auth issues; Zainab should trace the request chain for each (#202, #203, #204) before engineer debugs.
- design: YES — order dashboard, billing page, and error states are in the hot path; ship mockups today so engineer has visual targets.
- engineering: YES — four data-load bugs are actively blocking the product; Anil owns all four in parallel, not sequentially.
- review: YES — each bug fix needs verification that data actually loads end-to-end; no guessing.
- test: YES — Playwright tests will pinpoint which layer is failing and give engineer confidence the fix works.
- task_verifier: YES — Mehrdad verifies each of the four closed tasks before they move to done; proof of working order load + billing screen.

ONE-LINE SUMMARY:
Today the team unblocks the four data-load failures (#204, #203, #202, #205) in parallel, designs the order dashboard + billing refinements, and writes tests to guarantee the fixes stick.
