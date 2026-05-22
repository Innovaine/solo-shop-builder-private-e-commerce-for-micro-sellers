# Day 130 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 215
- **Saved:** 22/05/2026, 4:43:01 AM

---

FINISHED:
- Signup flow live: `/auth/signup` page wired to API, homepage CTA connected, seller can receive magic link (Day 129 code review SHIP verdict)
- TypeScript compilation passing, dashboard table CSS polished
- 56 of 60 tasks closed; 3 features (FR-21, FR-22) in active build (Anil); regression test suite running (Priya on #350)
- App builds, runs, and deploys cleanly — ready for seller validation

PENDING:
- #350: Regression test suite (Priya) — signup → login → shop → products → checkout → orders — blocks Stage 1 launch confidence
- #349, #348: Password auth features (FR-21, FR-22) — Anil mid-implementation; needed before first seller can set persistent login
- #354: Design system health check (87/100 fidelity) — not yet assigned; small win but unblocks next page batch

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Anil finishes FR-21 (password hash storage + validation) and FR-22 (password reset email + token flow) in parallel; unblock #349, #348 so Priya can validate both in regression suite. Both ship by EOD to clear password auth debt before Stage 1 seller onboarding.
- Stream 2 (designer): Ship design for F13 (seller dashboard order filters: date range + status) and F14 (customer order tracking page with shipment timeline); these unblock next engineering batch and keep design ahead of build queue. Reference design/pages/ paths when ready.
- Stream 3 (tester): Priya completes #350 regression (F1–F12 end-to-end: signup, product creation, checkout, order creation, status update); add test coverage for FR-21 and FR-22 as Anil lands them. Tests must cover actual seller + customer click paths, not unit assertions.
- Stream 4 (reviewer): Søren reviews FR-21 and FR-22 commits as they land; verify password reset email delivery and token expiry logic work in deployed environment (not localhost).
- Stream 5 (design_qa): Gopal spot-check #354 design system baseline (87/100) — confirm button states, form field spacing, color contrast; close #354 if baseline is solid, unblock next batch.
- Stream 6 (connectivity_qa): Zainab verify auth routes (signup, login, password reset) work end-to-end; test magic link delivery and Stripe webhook resilience under load.
- Stream 7 (task_verifier): Mehrdad sign off on #350 (regression), #349, #348 as they close; confirm sellers can actually use password reset flow before Stage 1 launch.

ROLE PLAN:
- engineering: YES — FR-21 and FR-22 are critical blockers for Stage 1; Anil must finish both to unblock seller validation and Stage 2 roadmap.
- review: YES — Password auth security (token expiry, hash strength) must be checked before it hits production; Søren verifies commits land safely.
- design: YES — F13 (order filters) and F14 (customer tracking) are next engineer blockers; designer ships mockups today so build doesn't stall mid-week.
- design_qa: YES — #354 design system baseline needs sign-off to prevent design debt cascading into next batch.
- connectivity_qa: YES — Auth routes (signup, login, reset) are mission-critical; Zainab tests email delivery and webhook reliability at scale.
- test: YES — Priya's regression suite (#350) unblocks Stage 1 confidence; must add password auth test coverage as FR-21, FR-22 land.
- task_verifier: YES — Mehrdad closes #350, #349, #348 only when sellers actually sign up and reset passwords successfully; proof required.
- standards_qa: NO — No active TypeScript or code-convention debt; Vitali not needed today.
- requirements: NO — No new scope discovery needed; Kenji stands by if design/test surface blockers mid-day.

ONE-LINE SUMMARY:
Today the team ships FR-21 (password auth), FR-22 (password reset), closes regression test suite (#350), designs order filters + customer tracking (F13, F14), and signs off on design system baseline — four parallel work streams unblocking Stage 1 seller onboarding.
