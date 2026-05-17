# Day 40 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 86
- **Saved:** 17/05/2026, 4:58:53 AM

---

FINISHED:
- Docker setup + environment configuration (Dockerfile, .env.example, deployment scaffolding ready)
- 41 tasks closed across auth, product, checkout, and order flows
- API routes stubbed: account/password, analytics
- Project structure initialized with Next.js app router

PENDING:
- #121: Magic link flow broken after verification — blocks seller signup path
- #82: Docker build missing 3 dynamic exports — blocks local dev and CI/CD
- #106: Day 29 features (F31-F40) not re-deployed after cycle reset — branding, email, billing, analytics missing from live URL
- #83: MVP feature completeness unverified — 20 features claimed but no end-to-end confirmation yet
- #59: Import path errors in checkout + orders — payment flow may be broken
- #80: CEO demo signup→order→tracking flow not validated live
- Test suite for F1–F20 not yet written (task #74 open)

TODAY'S WORK STREAMS:
- Stream 1 (engineering): Fix #82 (Docker dynamic exports), unblock #121 (magic link verification), then attack #59 (import paths in checkout/orders). These three are hard blockers — once cleared, engineer should ship #63 (category dropdown) + #64 (category filter) + #61 (image upload API) in parallel. Reference: F3, F4, F6, F7 from spec.
- Stream 2 (designer): Ship #65 (verify page + product management UI + design system components) — this unblocks engineer on #60 (product CRUD forms) and #47 (product list UI). Designer should also prepare storefront category filter mockup for #64.
- Stream 3 (tester): Write Playwright tests for #77 (FR-1 to FR-10 backend: auth, shop, products, cart, checkout, orders) and #78 (FR-11 to FR-20 seller dashboard + tracking + emails). Cover the happy path: signup → magic link → shop creation → product add → checkout → order status update. Reference product-spec F1–F12.
- Stream 4 (reviewer): Verify #82 deploys cleanly, confirm #121 magic link works end-to-end after fix, spot-check #59 import paths in payment routes. Then review #60, #63, #64, #61 as they land.
- Stream 5 (requirements): Confirm F1–F20 MVP scope matches board tasks — no scope creep into F21+ (password auth, webhooks, refunds) until MVP ships live with paying seller.

ROLE PLAN:
- engineering: YES — Three hard blockers (#82, #121, #59) must unblock before payload features land; engineer has 60–80 tool calls today, enough for 3–5 features in parallel once blockers clear.
- review: YES — Blockers need code verification before proceeding; payment flow (#59) especially critical for checkout path.
- design: YES — #65 unblocks #60 and #47; designer ships verify page + product CRUD mockups + storefront category filter today, runs in parallel with engineering.
- test: YES — Tester writes Playwright suite for F1–F20 against engineer's shipped code same day; we have zero test coverage and need validation before CEO demo (#76, #80).
- requirements: YES — Scope check: F21+ (password reset, webhooks, refunds) are open tasks (#105) but should NOT ship until F1–F20 MVP validates with a real seller live; PM confirms priorities with founder.
- design_qa: YES — Fidelity check on #65 designs against product spec before engineer builds #60, #47.

ONE-LINE SUMMARY:
Today the team unblocks Docker + magic link + payment imports, then ships category UI + product forms + image upload API + test suite in parallel, targeting a live, testable MVP by day 41.
