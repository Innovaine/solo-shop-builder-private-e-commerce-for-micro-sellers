# Day 33 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 70
- **Saved:** 17/05/2026, 2:25:00 AM

---

FINISHED:
- Docker build system (Dockerfile, .dockerignore) + environment scaffolding (.env.example)
- Project structure + metadata tracking (.qadar files, _meta.json)
- API routes scaffolding (account/password, analytics endpoints started)
- README + DEPLOYMENT.md (infrastructure docs exist)
- Day 29 features partially deployed (F31–F40: profile, branding, email, billing, analytics code exists but #99 blocker prevents verification)

PENDING:
- #99: CRITICAL — Day 29 build broken (import paths + FormField props) — blocks re-deployment and testing of F31–F40
- #106: Day 29 features unverified post-deployment — design + functionality need QA before features count as shipped
- MVP feature completion gaps — #83 shows F1–F20 claimed but warehouse shows only fragments (no full product CRUD, no checkout flow, no order dashboard visible in code)
- Password auth flow untested — #100, #101, #102 (password signup/login, reset, webhook signature verification) in progress but no test coverage yet
- Playwright test suite missing — #74 lists requirement but no test files visible in warehouse

TODAY'S WORK STREAMS:

- **Stream 1 (engineering):** Fix #99 (build blocker — import paths, FormField props) immediately, then ship #100 (password auth signup/login), #102 (webhook signature verification), and #104 (CSV export). These unblock #106 re-deployment and give password auth a real foundation. Reference: app/api/account/password/route.ts already exists — extend it.

- **Stream 2 (designer):** Ship UI for #100 (password auth pages: login, signup, forgot-password form), #101 (reset flow confirmation), and verify design-system compliance on existing dashboard pages from day 29 (#79, #75). Reference: design/pages/ should include auth-flow variants + responsive dashboard checkpoints at 320px, 768px, 1440px.

- **Stream 3 (tester):** Write Playwright tests for #100 (password auth F21), #102 (webhook signature F23), #104 (CSV export F25), and smoke-test the #106 re-deployment (F31–F40 end-to-end: profile → branding → email → billing → analytics). Tests should verify actual seller workflows, not unit coverage.

- **Stream 4 (reviewer):** Verify #99 fix compiles + runs in Docker, sign off #100 password auth logic (no plaintext storage, proper hashing), verify #102 webhook HMAC validation is correct (Stripe signature spec), spot-check #106 post-deploy (design fidelity, no broken links, orders flow works).

- **Requirements:** Hold — no new feature requests until #99 is fixed and #106 passes QA. If #99 takes >2 hours, escalate.

ROLE PLAN:
- engineering: YES — #99 is a hard blocker; shipping #100, #102, #104 in parallel unblocks password auth, webhooks, and seller CSV workflows (3 critical features before week 5).
- review: YES — #99 + #100 + #102 need verification before they're trusted in production; #106 re-deploy needs sign-off.
- design: YES — Password auth UI (#100, #101) is user-facing + required for F21; #106 post-deploy needs design QA to confirm day 29 features render correctly.
- design_qa: YES — Spot-check #106 deployment UI fidelity (profile, branding, email, billing, analytics pages) against spec before shipping.
- requirements: NO — Backlog is clear; no discovery needed until blockers clear.

ONE-LINE SUMMARY:
Today the team fixes the build blocker (#99), ships password auth (#100–#102) + CSV export (#104), deploys day 29 features (#106), and tests all three in parallel — unblocking week 5 scaling.
