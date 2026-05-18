# Day 71 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 135
- **Saved:** 18/05/2026, 9:42:49 PM

---

FINISHED:
- Seller signup flow (email magic link auth)
- Shop creation with slug generation
- Product CRUD + S3 image upload (via Digital Ocean)
- Public shop storefront with product listing and filtering by category
- Shopping cart (localStorage-based, no login required)
- Stripe Checkout integration for customer payment flow
- Order creation from Stripe webhook (payment_intent.succeeded)
- Seller order dashboard (basic table, all orders visible)
- Order status workflow (pending → paid → in-progress → shipped)
- Docker + deployment pipeline (Dockerfile, DEPLOYMENT.md)
- 57 tasks closed; product is loadable and testable in browser

PENDING:
- #208: Order page + billing page return 401/unauthorized — auth middleware or token expiry issue on Anil's desk
- #207: S3 upload fails (Digital Ocean provider config missing or malformed in .env)
- #206: MyFatoorah callback error (likely webhook signature mismatch or missing secret)
- Unclear: which payment provider is live (Stripe or MyFatoorah or both?) — blocking order flow clarity

TODAY'S WORK STREAMS:

- **Stream 1 (engineer — Anil):** Fix #207 (verify Digital Ocean S3 credentials in .env and test upload) and #208 (trace auth token flow in order/billing routes — likely stale session or missing Authorization header). Both are blocking real usage. Once fixed, ship F11 completeness (order filtering by date range, customer email display) to make the dashboard production-ready. Reference FRs F11 + F12.

- **Stream 2 (designer — Chiara):** Ship order detail page mockup (customer-facing tracking view) and seller order management page (bulk actions: mark shipped, email customer). These are F12 polish + post-MVP wins. Also audit storefront mobile responsiveness (product tiles, checkout flow) — screenshot and flag any layout breaks.

- **Stream 3 (tester — Priya):** Write Playwright tests for the critical happy path: seller signup → product upload → customer visit shop → add to cart → Stripe Checkout → order appears in dashboard → seller marks shipped. Also test #207 and #208 fixes once engineer deploys. Reference F1–F12.

- **Stream 4 (connectivity QA — Zainab):** Verify Stripe webhook is firing correctly (check logs), confirm auth middleware isn't rejecting valid tokens (trace #208), and validate Digital Ocean S3 bucket policy allows PUTs (support #207). These are integration seams, not unit tests.

- **Stream 5 (task verifier — Mehrdad):** Verify #207, #208, #206 are closed and functionality is loadable in a real browser before end of day. Sign off on order dashboard and checkout flow.

ROLE PLAN:
- requirements: NO — no new scope today; all open work is bug fix or completion of already-defined features.
- design_qa: NO — design Polish happens after Chiara ships; fidelity check comes after, not before.
- connectivity_qa: YES — three bugs (#207, #208, #206) are integration/auth/webhook issues; Zainab must validate seams are wired.
- design: YES — order detail page and seller order management UI are missing and unblock post-MVP polish; Chiara ships mockups today.
- engineering: YES — two critical blockers (#207, #208) prevent real seller workflow; Anil owns both.
- review: YES — code shipping today (auth fixes, S3 config, webhook debug) needs same-day review to catch regressions.
- test: YES — happy path and three bug-fix scenarios must be covered in Playwright before we declare "ready."
- task_verifier: YES — Mehrdad proves #207, #208, #206 work in a live browser; no "passed locally" excuses.

ONE-LINE SUMMARY:
Today the team kills three blockers (#207, #208, #206), ships order tracking UI + seller management page, and proves the core seller-to-payment-to-order flow works end-to-end in a real browser.
