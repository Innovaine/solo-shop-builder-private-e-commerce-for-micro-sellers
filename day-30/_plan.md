# Day 30 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 65
- **Saved:** 17/05/2026, 1:24:12 AM

---

FINISHED:
- Docker setup + root config files (.dockerignore, Dockerfile, .env.example, deployment.md)
- API skeleton (auth, analytics, account routes registered)
- Day 29 code review completed — identified FormField API mismatch in 4 pages (branding, email-template, billing, analytics); profile page pattern correct; 2-minute fix path documented
- Task board created with 58 total items; 20 features completed to date

PENDING:
- **BLOCKER #82**: Docker build fails — 3 missing dynamic exports; blocks all local development
- **BLOCKER #59**: Import path errors in checkout + orders pages; payment features unreachable
- **Day 29 carry-over**: FormField API fixes in branding/email-template/billing/analytics pages (4 pages, copy profile pattern)
- **MVP core incomplete**: FR-1 through FR-20 partially shipped but not integrated end-to-end; #83 (full MVP test) and #76 (CEO demo walk-through) still open
- **No Playwright test suite yet**: #74 is unstarted; no automated test coverage for any MVP features
- **Design system compliance unknown**: #79 and #75 unstarted; unclear if all pages meet accessibility + component standards

TODAY'S WORK STREAMS:

- **Stream 1 (engineer)**: Fix #82 (Docker dynamic exports) and #59 (checkout/orders import paths) first — these unblock everything. Then attack #77 (FR-1 to FR-10 backend: auth → products → cart → checkout → orders) and #78 (FR-11 to FR-20: dashboard → tracking → emails → errors). These are the MVP core; parallel implementation of backend auth/shop/checkout keeps velocity high.

- **Stream 2 (designer)**: Ship #65 (verify page + product management UI + design system component compliance) and #79 (design system accessibility audit + polish). Pair with engineer on #60 (product CRUD forms) to unblock product creation UI. Designer should output verified component specs so engineer can build without rework.

- **Stream 3 (tester)**: Write Playwright suite (#74) covering F1–F20 (signup, shop creation, product CRUD, category filter, cart, checkout, order creation, order status updates, tracking). Focus on the happy path first — customer signup → order → tracking and seller signup → product creation → order receipt. These tests become the CEO demo validation script.

- **Stream 4 (reviewer)**: Verify #77 and #78 landings against product spec (do all 20 features work end-to-end?). Review #59 and #82 fixes for correctness. Spot-check #65 (design compliance) before designer ships.

- **Stream 5 (requirements)**: Unblock designer on spec interpretation: clarify F6 (category dropdown UX — seller-facing or customer-facing first?) and confirm F12 (order status flow: do we need "pending" before "paid" or skip straight to paid after Stripe webhook?). One 15-min call with Chiara.

ROLE PLAN:
- engineering: YES — two critical blockers (#82, #59) must be fixed today or nothing else ships; then FR-1 to FR-20 backend core work is the only path to CEO demo and paying customers.
- review: YES — day 29 fixes need verification before engineer pushes; #77/#78 landings need spec compliance check; no demo without code review passing.
- design: YES — #65 and #79 unblock product UI; designer must ship verified components so engineer doesn't iterate 3x on FormField patterns.
- design_qa: NO — no fidelity check needed until #65 lands; design_qa can stand by for day 31.
- requirements: YES — one clarification call needed (category UX + order status flow) to unblock designer and engineer on edge cases; 15 minutes, high ROI.

ONE-LINE SUMMARY:
Today the team fixes two critical blockers (#82 Docker, #59 imports), ships MVP backend core (#77, #78: auth through orders), designs product UI + system compliance (#65, #79), and writes end-to-end Playwright tests (#74) in parallel.
