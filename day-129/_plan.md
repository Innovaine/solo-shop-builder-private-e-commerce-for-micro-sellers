# Day 129 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 213
- **Saved:** 22/05/2026, 3:15:57 AM

---

FINISHED:
- 49 tasks closed (per task board snapshot)
- MVP core flows wired: signup → login → shop creation → product CRUD → storefront → cart → Stripe Checkout → order dashboard
- Deployed state stable from day 127; day 128 review confirmed no regressions
- Design system baseline at 87/100 fidelity (task #354)
- Auth foundation laid: magic link signup (F1) working; password auth (FR-21) + reset (FR-22) in progress

PENDING:
- #349 (FR-22 password reset) — in progress, Anil; blocks Stage 1 completion
- #348 (FR-21 password auth) — in progress, Anil; blocks Stage 1 completion
- #350 (MVP regression test suite) — in progress, Priya; must pass before we declare MVP stable
- #355 (auth pages 404 errors) — open; critical blocker if signup/login URLs are broken
- #356 (homepage branding/CTA missing) — open; impacts first impression
- #357 (console errors on critical pages) — open; noise in production logs
- #358 (ProductAnalytics DTO consolidation) — open; technical debt, low urgency
- #352 (CSS dashboard polish) — open; nice-to-have after critical fixes
- #353 (Stage 1 design specs for password flows) — open; Chiara should start this NOW to unblock Anil's FR-21/FR-22 implementation

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Anil kills #355 + #357 (auth 404s + console errors) first — these are showstoppers blocking real user testing. Then shift to finishing #348 + #349 (FR-21/FR-22 password auth + reset) using #353 design specs as they land from Chiara. Reference F1, F2 auth flows in product-spec.md.
- Stream 2 (designer): Chiara ships #353 (password auth + reset flow mockups + interaction specs) immediately — this unblocks Anil's critical path. Also ship homepage redesign (#356 branding/CTA) in parallel since it's a single-page fix.
- Stream 3 (tester): Priya completes #350 (MVP regression test suite covering F1–F12 in product-spec.md), then writes new Playwright tests for FR-21 + FR-22 password flows as Anil ships them. Tests should cover: signup flow, password creation, reset email + link validation, login with password.
- Stream 4 (reviewer): Søren spot-checks #355 + #357 hot-fixes for production safety, then reviews #348 + #349 password auth PRs for security (hash algorithm, token expiry, email validation). Verify #356 + #353 design handoff clarity.
- Stream 5 (connectivity QA): Zainab validates auth routes after #355 fix — ensure signup/login endpoints return 200, forms render, Stripe webhook still fires. Check #349 email delivery (reset tokens hitting inbox).
- Stream 6 (task verifier): Mehrdad closes #355, #357, #356 once Anil + Chiara ship; verifies #350 test pass rate before signing off on MVP stability.
- Stream 7 (standards QA): Vitali spot-checks #348 + #349 for password hashing convention (bcrypt salt rounds, env variable for token TTL), DTO naming in #358 if Anil has cycles.
- Stream 8 (design QA): Gopal audits #353 mockups + #356 homepage against 87/100 baseline — fidelity lock before Anil codes.

ROLE PLAN:
- engineering: YES — Anil is the critical path; #355 + #357 are production blockers, #348 + #349 unblock Stage 1 completion and paying customer validation.
- review: YES — password auth (FR-21/FR-22) needs security review before shipping; hot-fixes (#355/#357) need verification for production safety.
- design: YES — Chiara's #353 specs are blocking Anil's auth work; #356 homepage is a quick win that unlocks first-time-user impression testing.
- connectivity_qa: YES — after #355 auth fix, Zainab must verify routes are live and Stripe webhooks still fire; #349 email delivery is non-negotiable.
- task_verifier: YES — Mehrdad closes completed tasks and gates #350 regression test pass rate before we call MVP stable.
- design_qa: YES — Gopal locks #353 + #356 fidelity before Anil codes, preventing rework.
- test: YES — Priya finishes #350 regression suite, then writes new tests for FR-21/FR-22 password flows in parallel with Anil's implementation.
- standards_qa: YES — Vitali enforces bcrypt + token conventions on #348 + #349; spot-checks #358 if capacity exists.
- requirements: NO — task board is clear; no new discovery needed. PM cycle resets tomorrow.

ONE-LINE SUMMARY:
Today Anil kills auth blockers (#355/#357), ships password auth (#348/#349) against Chiara's design specs (#353), Priya completes MVP regression tests (#350), and Zainab validates routes post-fix — four parallel streams unlocking Stage 1 stability and first-customer onboarding by EOD.
