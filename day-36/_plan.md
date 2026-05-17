# Day 36 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 77
- **Saved:** 17/05/2026, 3:03:11 AM

---

# EXECUTION PLAN — Day 36 — Solo Shop Builder

---

## FINISHED:
- Docker containerization + root config stack (Dockerfile, .env.example, docker-compose implicit)
- API scaffold: /account/password and /analytics routes established
- Project infrastructure: repo structure, deployment docs, git config
- Task board: 26 features closed, system shows scaling status + parallel capacity
- First-pass monitoring: .qadar logs and integrations JSON present (Slack/email channels mapped)

---

## PENDING:
- #99: CRITICAL — Day 29 build blocker (import paths + FormField props) — UNRESOLVED, blocks all downstream
- #106: Day 29 feature re-deploy (F31-F40: profile, branding, email, billing, analytics) — stuck behind #99
- #83: MVP feature completion (F1–F20) — in-progress, missing test coverage and UI polish
- #80, #76: CEO DEMO flows — untested end-to-end, blocking credibility signal
- Design system compliance: #75, #79 unfin — UI pages not validated against component standard
- Password auth (F21) and webhook verification (F23) — started, not shipped

---

## TODAY'S WORK STREAMS:

**Stream 1 (engineering):** Unblock #99 (fix import paths + FormField props in day 29 code), then ship #102 (Stripe webhook signature verification + idempotency) and #104 (product CSV export). These three unlock the re-deploy of F31-F40 and remove the critical blocker that's preventing demo readiness. Reference task #99, #102, #104.

**Stream 2 (design):** Ship responsive dashboard polish (#98 — mobile 320px+), verify all MVP pages (signup, shop creation, product listing, checkout, order detail, tracking) against design system compliance checklist, and deliver one clean before/after visual for CEO demo. Reference #98, #75.

**Stream 3 (tester):** Write Playwright test suite covering F1–F10 (MVP backend: signup, shop, products, cart, checkout, order creation), then test F21–F25 (password auth, webhook, refund, CSV) as engineering ships them. Tests should simulate real seller + customer workflows, not unit assertions. Reference #74, #105, #66.

**Stream 4 (reviewer):** Validate import/path fixes in #99 against existing route structure, approve #102 webhook code for idempotency logic (check Stripe signature verification is bulletproof), sign off on CSV export format in #104 before ship.

**Stream 5 (product/requirements):** Confirm CEO demo script: does F1–F20 MVP actually cover "signup → shop → product → checkout → order → tracking"? If gaps exist, flag blockers to engineering now. Validate CSV schema for #104 (what columns? seller-only or customer-visible?).

---

## ROLE PLAN:

- **engineering: YES** — Critical blocker at #99 must be cleared today before any re-deploy happens; three high-signal tasks (#102, #104, and #99 fix) can run in parallel and unblock demo + billing features.
- **review: YES** — #99 import fixes + #102 webhook security + #104 CSV format all require validation before merge; code review is bottleneck removal, not luxury.
- **design: YES** — #98 mobile responsiveness + #75 design system audit ship in parallel with engineering; CEO demo will fail if dashboard looks broken on phone or inconsistent with brand.
- **design_qa: YES** — Fidelity check on #75 (design compliance) and #98 (responsive rendering) before design ships; catch visual regressions before they reach demo.
- **requirements: YES** — Unblock product questions (CSV schema for #104, demo script completeness check for #80/#76) and confirm F31-F40 scope before re-deploy to avoid scope creep mid-ship.

---

## ONE-LINE SUMMARY:
Today the team unblocks the day-29 build failure (#99), ships webhook security (#102) + CSV export (#104) + mobile dashboard polish (#98), and validates MVP end-to-end demo readiness in parallel.
