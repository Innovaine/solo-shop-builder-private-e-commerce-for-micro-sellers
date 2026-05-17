# Day 49 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 102
- **Saved:** 17/05/2026, 2:55:26 PM

---

FINISHED:
- Day 48 shipped 4 Stage 1 hardening features: password auth (bcrypt 12), password reset (1hr tokens), product variants + inventory validation, shop branding (color + tagline). All verified in code review; build + containers healthy.
- 52 tasks closed to date; MVP core (F1–F12) + password auth flow + variant system + branding endpoints deployed and working.
- Storefront displays seller customizations; checkout validates stock atomically; webhook decrements inventory in transaction.

PENDING:
- #133 (design): Password reset + seller profile + shop branding UI pages — mockups started but not shipped to Figma/frontend yet.
- #131 (engineering): Seller profile endpoints (GET/PUT /api/sellers/{id}) — model exists, endpoints not yet written.
- #130 (engineering): Inventory tracking UI + stock label on storefront — backend validation done, storefront label missing.
- #105 (test): FR-21–FR-25 verification (password auth, reset, webhook, refund, CSV) — in progress, not closed.
- #106 (deploy): Day 29 features re-deploy (F31–F40) — blocked pending #131 + #133 completion.
- #76 (demo): CEO end-to-end walkthrough — cannot run until #131 + #130 storefront label ship.

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #131 (seller profile GET/PUT endpoints + auth check) + #130 (add stock label to storefront, integrate inventory validation into cart/checkout). Both unblock demo and next stage features. Reference FR-25, FR-24 in product-spec.md.
- Stream 2 (designer): Ship #133 mockups (password reset form, seller profile editor, branding dashboard) in Figma + export to `/design/pages/` folder. These unblock #131 frontend work and day 50 engineering sprint.
- Stream 3 (tester): Write Playwright tests for #131 (profile GET/PUT with auth), #130 (stock validation + checkout reject if OOS), password reset flow (FR-24 acceptance). Tests reference requirements.md acceptance criteria.
- Stream 4 (reviewer): Verify #131 + #130 merge requests once engineer pushes; check stock decrement atomicity, profile auth boundaries, password reset token expiry. Sign off before day 50.
- Stream 5 (requirements/PM): Update task board when #131 + #130 close; flag #106 unblocked status; confirm CEO demo schedule once #76 prerequisites ship.

ROLE PLAN:
- engineering: YES — #131 + #130 are blockers for demo + stage 1 completion; engineer has capacity for 2 super-tasks in speed mode.
- review: YES — code must land before day 50 deploy; reviewer needs to verify stock atomicity + auth boundaries, not just syntax.
- design: YES — #133 mockups are on critical path; designer ships 5–10 files in parallel mode; storefront label + profile UI are not optional.
- test: YES — #131 + #130 ship untested code if tester doesn't run today; Playwright tests for auth + inventory are non-negotiable before CEO demo.
- design_qa: YES — fidelity check on #133 mockups against brand + accessibility (password form, profile editor, branding dashboard must be mobile-responsive).
- requirements: YES — PM must close #131 + #130 tasks as they merge, unblock #106, confirm demo feasibility.

ONE-LINE SUMMARY:
Today the team ships seller profile endpoints (#131), inventory storefront labels (#130), and password reset/profile/branding UI mockups (#133) in parallel, unblocking the CEO demo and day 50 stage 1 hardening close.
