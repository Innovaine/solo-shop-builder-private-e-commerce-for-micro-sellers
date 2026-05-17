# Day 48 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 99
- **Saved:** 17/05/2026, 12:54:40 PM

---

# BRIEF — Day 48 Solo Shop Builder

## FINISHED:
- MVP backend complete (all 20 FRs F1–F20 verified, Docker stable, smoke tests passing)
- Day 29 API layer deployed (profile, branding, email, billing, analytics endpoints live)
- Code review clean — no blockers, SHIP verdict issued day 47

## PENDING:
- Task #106: 8 React pages (profile, shop settings, email config, billing, analytics dashboard) wired to existing APIs — **IN PROGRESS, not started yet**
- Task #76: CEO demo script (end-to-end flow) — **blocked until UI is loadable**
- Task #66: Playwright tests for product CRUD + category filter + email verify — **can't run until #106 ships UI**
- Task #105 (password auth, webhooks, refunds): in progress but not part of MVP ship criteria

## TODAY'S WORK STREAMS:

**Stream 1 (Engineer):** Ship Task #106 React wiring in parallel: (a) product listing + category filter page, (b) cart + checkout page, (c) order dashboard page. Reference F3–F7, F8–F10, F11–F12. Each page is a thin wrapper around working APIs—no new backend logic needed. Target: all three pages loadable and data-bound by EOD.

**Stream 2 (Designer):** Ship 3 design files for the pages engineer is wiring: (a) product grid + filter sidebar, (b) cart review + Stripe redirect, (c) order table + status dropdown. Match existing MVP branding from day 29. These drive the engineer's HTML/React structure, not the other way.

**Stream 3 (Tester):** Write Playwright tests for F3–F7 (product CRUD + filter) and F8–F10 (cart + checkout flow). Do NOT wait for engineer to finish all three pages—test each as it lands. Reference Task #66. Block on engineer shipping page markup.

**Stream 4 (Reviewer):** Verify Task #106 pages load in browser, data hydrates from live APIs, no console errors, Stripe Checkout redirect works. Review memo required before #76 (demo) can run.

**Stream 5 (Requirements/PM):** Kenji: stand by for CEO demo requirements clarification by 3pm today. Gopal (Design QA): fidelity check on designer's mockups vs. day-29 brand once shipped.

## ROLE PLAN:
- **engineering: YES** — Task #106 is unblockers for demo and testing; three pages in parallel will ship the last piece of visible MVP.
- **design: YES** — Designer must ship the three page mockups today so engineer has a clear target and doesn't guess at layout.
- **test: YES** — Playwright tests for #66 start landing the moment engineer pushes page code; unblocks shipping confidence.
- **review: YES** — Code + browser verification of #106 is the gate for #76 (demo), which is the blocker for all forward motion.
- **requirements: YES** — Kenji preps demo script outline by 3pm so Priya has CEO-facing talking points by EOD.
- **design_qa: STANDBY** — Gopal checks fidelity of new pages against brand once design ships; not a blocker, can happen in parallel.

## ONE-LINE SUMMARY:
Today engineer ships 3 React pages wired to live APIs, designer mocks them in parallel, tester writes coverage, and reviewer clears the path for CEO demo by end of week.
