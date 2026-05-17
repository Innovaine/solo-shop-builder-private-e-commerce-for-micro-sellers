# Day 49 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 100
- **Saved:** 17/05/2026, 2:02:44 PM

---

FINISHED:
- Day 48 shipped 4 Stage 1 hardening features: seller password auth (bcrypt 12), password reset (1hr tokens), product variants with inventory tracking, shop branding (color picker + tagline validation)
- Build verified healthy, database migrated, Stripe webhook decrements stock atomically, storefront displays all customizations
- MVP core (F1–F12) production-ready; 52 of 60 board tasks closed
- Code review passed; containers passing health checks

PENDING:
- #133 (Design mockups for password reset + seller profile + branding UI) — Chiara blocked, waiting assignment
- #131 (FR-25: Seller profile endpoints GET/PUT) — backend wiring incomplete
- #130 (FR-24: Stock validation at checkout) — logic merged but not tested end-to-end
- #106 (Re-deploy day 29 features) — staging verification incomplete
- #105 (Test FR-21–FR-25) — Priya in progress, needs engine output to verify
- #76 (CEO demo script) — walk-through not yet recorded

TODAY'S WORK STREAMS:
- **Stream 1 (engineer):** Ship #131 (seller profile endpoints), #130 (stock checkout validation e2e), and hardening for password reset edge cases (expired tokens, invalid email). These unblock the designer and tester immediately. Reference FR-24, FR-25.
- **Stream 2 (designer):** Ship mockups for #133 (password reset page, seller profile editor, branding dashboard) using existing design patterns. Mobile-responsive. Chiara has reference from day 48 branding work; should take 2–3 hours.
- **Stream 3 (tester):** Write Playwright tests for stock validation (out-of-stock label, checkout reject, atomic decrement), seller profile CRUD, and password reset flow (valid token, expired token, wrong email). Cover FR-24, FR-25, and password reset edge cases from day 48.
- **Stream 4 (reviewer):** Verify #131 endpoints (auth checks, seller isolation), #130 stock atomicity (no race conditions), password reset token expiry. Check database schema migrations before deploy.
- **Stream 5 (requirements/PM):** Confirm acceptance criteria for #131 and #130 are testable; flag any missing field validations to engineer before they ship.

ROLE PLAN:
- engineering: YES — 3 open super tasks (#131, #130, password reset hardening) unblock design and test; engineer has 60–80 tool calls capacity to ship all three today
- review: YES — password reset, seller profile endpoints, and stock atomicity all need verification before merge; no ship without reviewer sign-off
- design: YES — #133 is high-priority and ready to mock; 2–3 design files (reset, profile, branding dashboard) fit parallel cadence
- test: YES — password reset flow + seller profile + stock validation all have clear acceptance criteria; Priya can write 15–20 Playwright tests covering edge cases while engineer builds
- design_qa: YES — fidelity check on #133 mockups against brand guidelines and existing UI patterns; Gopal should verify mobile responsiveness
- requirements: YES — Kenji confirms acceptance criteria for #131 and #130 are unambiguous; flag gaps to engineer before they commit

ONE-LINE SUMMARY:
Today engineer ships seller profile + stock checkout validation + password reset hardening; designer ships 3 UI pages; tester covers all three with edge-case tests; reviewer gates all merges; PM clarifies acceptance criteria.
