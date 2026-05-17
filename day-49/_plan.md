# Day 49 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 105
- **Saved:** 18/05/2026, 2:22:56 AM

---

FINISHED:
- Day 48 shipped 4 Stage 1 hardening features: seller password auth (bcrypt 12), password reset (1hr tokens), product variants with inventory (stock validation + atomic decrement), shop branding (color + tagline). All verified in code review; containers healthy; build passing.
- 48 of 60 total Stage 0 + Stage 1 tasks now closed.
- Storefront displays seller customizations (branding); checkout atomically validates and decrements variant stock.

PENDING:
- #144 (FR-37: email template editor) — incomplete; seller needs ability to customize order confirmation emails with merge tags + XSS sanitization.
- #143 (FR-32: product CSV import) — incomplete; seller needs bulk product upload to scale product catalog entry.
- #140 (FR-30: order CSV export) — incomplete; seller needs fulfillment/accounting export.
- #133 (DESIGN: password reset + profile + branding UI) — design mockups for reset-password, seller profile, shop branding pages not yet shipped to Figma/repo.
- #131 (FR-25: seller profile model + endpoints) — backend incomplete; GET/PUT /api/sellers/{id} endpoints not yet written.
- #130 (FR-24: inventory tracking) — partially shipped (variants + stock field exist); checkout validation logic needs verification.
- Day 48 code review passed; no blockers listed. Ready to merge and ship.

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #143 (FR-32: CSV product import), #140 (FR-30: order CSV export), and #130 (FR-24: finish inventory checkout validation). CSV import validates columns + enums + decimals and creates bulk Product records; CSV export returns orders as downloadable file for fulfillment; inventory checkout rejects if stock == 0 and decrements atomically post-payment. Parallel work: no dependency between these three — start all three today.
- Stream 2 (designer): Ship mockups for #133 (password reset page, seller profile editor, shop branding customizer). All three mobile-responsive, matching existing design patterns in repo. Reference existing form components + color picker library. Ship to design/ folder by EOD.
- Stream 3 (tester): Write Playwright tests for FR-32 (CSV parse, validation, error handling), FR-30 (export file generation + content), FR-24 (stock validation at checkout, decrement post-payment), FR-25 (profile GET/PUT, auth boundary). Tests run against live deployed instance.
- Stream 4 (reviewer): Code review #143, #140, #131, #130 before merge. Verify: CSV parsing handles malformed input; export respects shop ownership; inventory decrements atomically; profile endpoints enforce seller auth. Verdict required before end of day.
- Stream 5 (requirements): No new requirements writing today; all tasks linked to existing FRs (37, 32, 30, 25, 24). Kenji: confirm task board reflects current state; flag any blockers at standup.

ROLE PLAN:
- engineering: YES — 3 high-priority features with clear acceptance criteria; no design dependency; CSV + inventory are Stage 1 shipping blockers.
- review: YES — four features landing today need verification before merge; code review is gating factor for shipping.
- design: YES — #133 mockups unblock engineer work on branding + profile endpoints; 3 pages, all same pattern, high velocity expected.
- test: YES — CSV import/export + inventory validation are risky (data integrity); Playwright tests prevent regressions before we hit paying sellers.
- requirements: NO — all open tasks already spec'd; Kenji's time better spent unblocking engineer questions mid-day if they arise.
- design_qa: NO — design review can fold into review role; not a bottleneck today.

ONE-LINE SUMMARY:
Today the team ships CSV import + export, finishes inventory validation, and designs 3 seller-facing pages—all in parallel—pushing Stage 1 hardening to ship-ready.
