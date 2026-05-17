# Day 37 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 79
- **Saved:** 17/05/2026, 3:32:20 AM

---

FINISHED:
- Docker build + deployment pipeline (Dockerfile, .dockerignore, DEPLOYMENT.md) — infrastructure ready
- Project structure initialized with Next.js API routes (app/api/account/password, app/api/analytics)
- .qadar integration files present (channel messaging, email, git, environment config) — tooling layer exists
- 34 tasks closed so far; MVP feature skeleton defined across 20 features (F1–F20)

PENDING:
- #99 CRITICAL: day 29 build broken — import paths + FormField props unresolved; blocks all downstream work
- #106: day 29 features (F31–F40: profile, branding, email, billing, analytics) not yet re-deployed after build fix
- #105: FR-21 through FR-25 (password auth, webhook, refund, CSV) untested — test suite not written
- #83: F1–F20 (MVP auth, shop, products, cart, checkout, orders, dashboard) incomplete and not tested end-to-end
- #74: Playwright test suite for all 20 MVP features not started
- #80: CEO DEMO verification flow (signup → order → tracking) not validated

TODAY'S WORK STREAMS:
- Stream 1 (engineering): Fix #99 (import paths + FormField props) first — this unblocks F21–F25 and F31–F40. Then attack #100 (password auth F21) and #102 (webhook verification F23) in parallel; these are the hardest backend work and let the tester write real tests. Reference #99, #100, #102.
- Stream 2 (designer): Ship password reset flow UI (F22), order refund modal (F24), and product CSV preview modal (F25); also verify F11–F12 (seller order dashboard) has proper dropdown styling for status updates. These unblock engineer's backend work and give tester UI to validate against. Reference F22, F24, F25, F11–F12.
- Stream 3 (tester): Write Playwright tests for F1–F10 (signup, shop creation, products, cart, checkout) immediately — these are the most unstable. Once engineer ships F21–F25, pivot to password auth + webhook + refund flows. Test the CEO DEMO path end-to-end by EOD. Reference #74, #80, F1–F10, F21–F25.
- Stream 4 (reviewer): Code review #99 the moment it lands (unblock critical path), then spot-check #100 and #102 for webhook signature validation correctness before merge. These are payment-critical.
- Stream 5 (requirements): Confirm F31–F40 scope is still locked (profile, branding, email, billing, analytics) — if not, flag now. Do not let scope creep into day 37. One line.

ROLE PLAN:
- engineering: YES — day 29 build is still broken; #99 is a hard blocker and must be fixed before any feature can ship. We can't test, can't demo, can't move forward without this. Anil alone carries enough capacity to ship #99 + #100 + #102 in parallel today.
- review: YES — #99 is payment-critical path (webhook signature verification) and too risky to merge without eyes. Søren catches import/dependency errors before they waste tester time.
- design: YES — F22 (password reset), F24 (refund modal), F25 (CSV preview) are backend-blocking; designer ships UI mockups now so engineer isn't waiting on Figma. Chiara also verifies order dashboard dropdown is production-ready.
- test: YES — F1–F10 have zero test coverage and are the MVP foundation. Priya writes Playwright now in parallel with engineer's F21–F25 work; by EOD we have a testable CEO DEMO path (F1–F10) + confidence in new payment flows (F21–F25).
- requirements: YES — day 29 scope (F31–F40) is queued behind #106 re-deploy. Kenji confirms no scope creep into those features; we're 37 days in and can't afford mid-cycle replanning.
- design_qa: NO — fidelity check happens after designer ships mockups, not before. Too early in the day to block on QA gate.

ONE-LINE SUMMARY:
Today the team fixes the day-29 build blocker (#99), ships password auth + webhook verification (#100, #102) + refund UI, and writes Playwright tests for the entire MVP checkout flow in parallel.
