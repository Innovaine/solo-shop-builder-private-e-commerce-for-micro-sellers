# Day 131 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 216
- **Saved:** 22/05/2026, 5:20:18 AM

---

FINISHED:
- Day 130 code review passed; SortDropdown template string fixed (#361), password auth/reset (FR-21, FR-22) verified working, Docker build clean, deployment live at soloshopbox.com
- 54 of 60 tasks closed; MVP regression testing (F1–F12) in flight with Priya
- Design system health baseline established at 87/100 fidelity (#354)

PENDING:
- #350: MVP Regression Testing — Priya needs to complete full end-to-end flow (signup → login → shop → products → checkout → orders) and file blockers if found
- #364, #363, #362: Four orphaned pages + three files with broken template strings in shop navigation — wiring debt blocking clean user flows
- Password reset flow (FR-21, FR-22) marked done in code review but needs live integration test to confirm email delivery works end-to-end in production

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Attack the three wiring tickets (#364, #363, #362) in parallel — remove or fix orphaned page reachability, incomplete template literals in ProductDetailClient and SortDropdown, broken router.push in navigation. These are blocking clean checkout flow and add zero customer friction once done. Then pair with tester to verify each fix doesn't regress cart or order creation.
- Stream 2 (designer): Ship 3–5 pages: verify fidelity on checkout confirmation page (post-Stripe), seller order dashboard (F11 — order table layout), and product detail page mobile responsiveness. These touch customer-facing critical paths and are currently untested for visual completeness.
- Stream 3 (tester): Write and run Playwright tests covering F8 (cart persistence), F9 (Stripe Checkout redirect), F10 (webhook → order creation), F11 (seller dashboard load), F12 (status dropdown update). Run Priya's regression test in parallel; if it fails, file blockers immediately so engineer can triage.
- Stream 4 (connectivity_qa): Verify Stripe webhook reachability in production, confirm email magic link delivery works end-to-end, test cart/checkout API calls don't 404 or time out under load. This unblocks confidence in live payment flow.
- Stream 5 (review): Verify engineer's wiring fixes don't introduce TypeScript errors or broken imports; check that no dead code remains after orphaned page removal.

ROLE PLAN:
- engineering: YES — wiring debt is blocking live checkout UX; three small template fixes compound to restore user flow clarity and reduce support friction.
- review: YES — code review must verify no regressions from template literal fixes and confirm Docker build stays clean after file cleanup.
- design: YES — checkout confirmation, seller dashboard, and mobile product detail are MVPs' most-used surfaces and haven't had fidelity sign-off yet.
- test: YES — Priya's regression test is the first real signal of whether full buyer flow works; parallel Playwright tests for F8–F12 catch API and webhook gaps before live customers hit them.
- connectivity_qa: YES — Stripe webhook and email delivery are the two most likely production failure points; early verification saves a crisis call at 2 AM.
- design_qa: NO — design system baseline already established at 87/100; defer fidelity audit to day 132 once new pages land.
- task_verifier: NO — eng + review handle verification inline today; no backlog sign-off needed.
- standards_qa: NO — TypeScript and Docker are already clean from day 130; skip linting pass unless review surfaces a new pattern violation.
- requirements: NO — product spec is locked; no new scope creep this cycle.

ONE-LINE SUMMARY:
Today the team fixes three wiring breaks in parallel while tester validates full buyer flow and designer ships checkout + dashboard surfaces, unblocking live payment confidence.
