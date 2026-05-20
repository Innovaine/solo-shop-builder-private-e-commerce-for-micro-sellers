# Day 99 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 170
- **Saved:** 20/05/2026, 6:20:51 PM

---

FINISHED:
- 56 tasks closed across 98 prior days; product at 56/100 features toward v1.0 scope
- Dockerfile + deployment infrastructure in place (DEPLOYMENT.md exists)
- Core auth flow: seller signup via email magic link (F1)
- Shop creation + slug routing (F2)
- Product CRUD scaffolding + image upload to S3 (F3, F4)
- Public storefront + category assignment (F5, F6)
- Shopping cart in browser session storage (F8)
- Stripe Checkout integration + webhook order creation (F9, F10)
- Seller order dashboard + status update UI (F11, F12)

PENDING:
- #281: Product detail page missing product image (shows emoji only) — blocks customer purchase flow
- #283 + #282: Duplicate s3.ts file; app importing wrong copy, missing ACL — blocks product image upload for new sellers
- #255: route-validator shows 3 broken template strings, 4 orphans, 1 method mismatch — blocks connectivity QA sign-off on routes + auth

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Kill the duplicate s3.ts wiring (#282, #283) — one source of truth for S3 client + ACL. Then fix product detail page image render (#281) so customer can see what they're buying. Both are 30-min fixes blocking checkout UX. Anil owns this serial chain.
- Stream 2 (designer): Ship product detail page mockup (design/pages/product-detail.html) + seller dashboard refinement (design/pages/seller-dashboard.html) so engineer has pixel targets. Two files, one afternoon.
- Stream 3 (tester): Write Playwright suite for F5 (storefront browse), F7 (category filter), F9 (Stripe Checkout redirect), F12 (order status update). Four test files covering the happy path a real customer + seller would walk.
- Stream 4 (connectivity_qa): Unblock #255 by validating route-validator output — map broken template strings to actual routes, verify auth middleware wiring, confirm method + path match. One pass.
- Stream 5 (review): Code review s3.ts consolidation + product detail render before merge. One pass.

ROLE PLAN:
- requirements: NO — no new feature discovery needed; board is clear; PM overhead would slow shipping
- design_qa: YES — fidelity check that product detail page mockup matches storefront aesthetic + checkout flow visual continuity
- connectivity_qa: YES — unblock #255 route-validator issues before engineer ships
- design: YES — product detail page + seller dashboard mockups are blocking engineer on two open tasks
- engineering: YES — three wiring bugs (#281, #282, #283) are sprint blockers; engineer owns all three; 60-80 tool calls available for this + small follow-up fixes
- review: YES — s3.ts consolidation is wiring-critical; one code review pass prevents re-infection
- test: YES — four new test files cover the four most customer-facing flows (browse → filter → checkout → order tracking)
- task_verifier: YES — verify #281, #282, #283, #255 closed; sign off before EOD
- standards_qa: NO — no new patterns introduced; existing code conventions hold

ONE-LINE SUMMARY:
Today the team ships the s3.ts fix + product detail image render (engineer), product detail + dashboard mockups (designer), route validation pass (connectivity), and four core customer flow tests (tester) in parallel—unblocking the checkout → order pipeline.
