# Day 53 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 111
- **Saved:** 18/05/2026, 6:04:25 AM

---

FINISHED:
- Day 52: Back-button UX enhancements shipped live; password reset (FR-22) verified working
- Production build + health checks passing; all 56 completed tasks verified
- Seller dashboard, shop storefront, product CRUD, Stripe integration, order management baseline live
- 4 open high-priority tasks ready for engineering attack

PENDING:
- #144 (FR-37): Email template editor — blocked until schema finalized (sanitization rules unclear)
- #143 (FR-32): CSV product import — schema ready, parsing logic untested at scale
- #131 (FR-25): Seller profile endpoints — low-lift; can ship in parallel
- #130 (FR-24): Inventory tracking — high-risk; touches checkout atomicity (payment + stock decrement must not race)

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #131 (FR-25: seller profile GET/PUT endpoints) and #143 (FR-32: CSV import parsing + validation) in parallel; flag #130 (FR-24: inventory + atomic checkout) as blocked until connectivity QA verifies Stripe webhook + stock transaction safety. Start #144 (FR-37) only after requirements clarifies XSS sanitization rules (strip vs. allow-list).
- Stream 2 (designer): Ship /dashboard/profile page (seller bio, image, social links form), /dashboard/products/import page (CSV upload + preview table), and /dashboard/email-templates page (subject + body editor with merge-tag docs). All 3 are straightforward data-entry forms; no new patterns needed.
- Stream 3 (tester): Write Playwright tests for profile update (auth + own-profile-only), CSV import (valid/invalid rows, error reporting), and email template save (merge-tag rendering). Defer inventory tests until #130 is unblocked.
- Stream 4 (reviewer): Verify profile + CSV import + email template code for auth correctness, input validation, and XSS prevention before merge. Check Stripe webhook atomicity if #130 ships.
- Stream 5 (requirements): Confirm sanitization rules for #144 (can we allow <b>, <i>, <a>? or strip all HTML except merge tags?). Write acceptance criteria for #130 inventory + checkout race condition.

ROLE PLAN:
- requirements: YES — blockers on #144 and #130 need immediate clarification before engineer spins wheels
- design_qa: YES — fidelity check on new forms (profile, CSV import, email template) before handoff to engineer
- connectivity_qa: YES — Stripe webhook atomicity + stock decrement transaction must be vetted before #130 ships
- design: YES — 3 new pages ship in parallel with engineer; no design debt from day 52
- engineering: YES — 4 open tasks; engineer can ship 2-3 cleanly today (#131, #143, maybe #144 if requirements unblocks)
- review: YES — 2-3 PRs need verification; XSS + auth are non-negotiable
- test: YES — coverage for new endpoints + CSV parsing + email merge tags

ONE-LINE SUMMARY:
Today the team ships seller profile, CSV bulk import, and email template editor in parallel while connectivity QA gates inventory checkout atomicity.
