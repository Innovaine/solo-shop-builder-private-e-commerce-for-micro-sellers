# Day 52 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 110
- **Saved:** 18/05/2026, 5:12:43 AM

---

FINISHED:
- FR-28 (CSV product import): Full validation pipeline, error recovery, per-row atomicity — live at /dashboard/products/import
- FR-35 (email template editor): DOMPurify XSS protection, merge tag picker, live preview — live at /dashboard/email-template
- 56/60 task board items closed; both features passed code review day 51, verified 200 OK on production
- Dockerfile + deployment infrastructure ready; app responding on soloshopbox.com

PENDING:
- #144 (FR-37): Email template editor task still shows open in board — but code review confirms FR-35 shipped; task label mismatch needs clarification (likely same work, task needs closure)
- #143 (FR-32): Shows open but code review confirms CSV import (FR-28) shipped; board sync issue
- #131 (FR-25): Seller profile model + endpoints — NOT started
- #130 (FR-24): Inventory tracking (stock count + checkout validation) — NOT started
- No test suite visible in warehouse; no Playwright tests found for FR-28 or FR-35

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Close #131 (FR-25: seller profile model + GET/PUT endpoints with auth) and #130 (FR-24: inventory tracking — quantity_available field, stock validation on checkout, atomic decrement). Both are high-priority, backend-heavy, and unblock seller dashboard completeness. 2 solid super-tasks, 1 day feasible.
- Stream 2 (designer): Ship /dashboard/profile page (seller bio, profile image, social links form), /dashboard/products page refinement (show stock levels, edit stock inline), and /shop/[slug] storefront update (add "In Stock" / "Out of Stock" label on product cards). 3 pages that directly support the engineer's work.
- Stream 3 (tester): Write Playwright tests for FR-28 (CSV import success path + error handling), FR-35 (email template save + merge tag rendering), FR-25 (seller profile fetch + update, auth boundary check), FR-24 (add to cart when stock=0, checkout rejection, stock decrement). Coverage for shipped + landing features.
- Stream 4 (reviewer): Verify #131 and #130 ship with zero defects — check seller profile auth enforcement, inventory atomicity under concurrent checkout attempts, schema migration safety.
- Stream 5 (requirements/PM): Close task board items #144, #143 to match code review reality; confirm next 4 features in queue for day 53+ (likely shipping, notifications, analytics starter, payment retry logic).

ROLE PLAN:
- requirements: YES — task board has label/status drift (FR-28, FR-35 marked open but shipped); need board closure and next-4-features clarity by day 53
- design_qa: YES — fidelity pass on seller profile, product stock UI, storefront OOS label (pixel-perfect against design system)
- connectivity_qa: YES — route smoke tests on new /api/sellers/{id} endpoints, stock atomicity under load (concurrent checkout), Stripe webhook resilience
- design: YES — 3 new pages (seller profile, product stock editor, storefront stock label) ship in parallel; design system consistency
- engineering: YES — #131 + #130 are high-signal customer-facing features that unlock seller self-service; both fit 1 day at current velocity
- review: YES — both features introduce auth + financial atomicity; code review is mandatory gate before production
- test: YES — zero test coverage visible; Playwright suite must cover shipping features + new inventory logic (prevents regression in high-risk area)

ONE-LINE SUMMARY:
Today the team ships seller profiles + inventory tracking in parallel, with design + test coverage for both, while closing task board drift from day 51's shipped work.
