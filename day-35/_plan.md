# Day 35 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 76
- **Saved:** 17/05/2026, 2:57:29 AM

---

FINISHED:
- Docker containerization (Dockerfile, .dockerignore, root structure) — ready to deploy
- Environment config scaffolding (.env.example, _meta.json)
- API route stubs (account/password, analytics endpoints exist but not implemented)
- Project initialized with Next.js + TypeScript stack; README and DEPLOYMENT.md written

PENDING:
- #99: Day 29 build blocker (import paths + FormField props) — **CRITICAL, blocks all feature work**
- #82: Docker build missing 3 dynamic exports — blocks containerized deployment
- #83: FR-1 to FR-20 (all 20 MVP features) — incomplete; signup, shop, products, cart, checkout, orders, dashboard, tracking all partially or unstarted
- #106: Re-deploy day 29 features (F31-F40: profile, branding, email, billing, analytics) — features written but not deployed after build fix
- #115: All pages look bad — design system not applied across UI
- #74: Playwright test suite for F1–F20 — zero test coverage for MVP flow

TODAY'S WORK STREAMS:
- Stream 1 (engineering): **FIRST**: Fix #99 (import paths + FormField props) and #82 (Docker exports) — these unblock everything. **THEN**: Ship FR-1 & FR-2 (seller signup + email magic link, shop creation) and FR-3 & FR-4 (product CRUD + S3 image upload). Attack #77 and #83 in parallel; seller auth and product backend are the foundation for everything else. Anil has 60–80 tool calls; use them.
- Stream 2 (designer): Ship signup page (#62, verify page UI), product management page (#65), and storefront product list + detail pages (FR-5 layout). Apply design system components from #79 to all three; unblock Anil's frontend binding. Chiara designs in parallel with backend work so frontend can start day 36 without wait.
- Stream 3 (tester): Write Playwright tests for FR-1 (signup + magic link), FR-2 (shop creation), FR-3 (product CRUD), FR-4 (image upload), FR-5 (storefront). Cover the happy path and one failure case per feature (#74 scope). Tests ship as features land so Anil can verify in browser before code review.
- Stream 4 (reviewer): Verify the build fix (#99, #82) — if import paths and Docker exports are wrong, entire deploy fails and day is wasted. Then spot-check the first 2–3 shipped backend features (FR-1, FR-2) for auth token flow, database writes, and Stripe integration setup. Søren approves the "can this actually deploy" questions first.
- Stream 5 (product/PM): Kenji writes acceptance criteria for FR-1 through FR-5 if not already in spec (magic link flow, shop slug validation, image size limits, storefront pagination). One paragraph per feature, live by 10am. Gopal flags any UI that can't render on 320px (responsive blocker #98 relevant but lower priority).

ROLE PLAN:
- engineering: YES — #99 and #82 are critical blockers; Anil must fix them before shipping features. After unblocked, FR-1–FR-5 (auth, shop, products, images, storefront) are the foundation. 60–80 tool calls means 3–5 features ship today if engineering is focused.
- review: YES — Build fix and early features need verification; Søren catches deploy-blocking mistakes fast so day is not wasted on untested refactors.
- design: YES — Signup, product management, storefront pages must be designed in parallel with backend so frontend can bind without waiting. Chiara ships 5–10 design files today; Anil doesn't thread-block on design.
- requirements: YES — Kenji writes acceptance criteria for FR-1–FR-5 (magic link validation, shop slug rules, product image constraints, storefront layout). Unblocks design and test clarity.
- design_qa: YES — Gopal verifies all pages render at 320px minimum width; #98 (mobile responsiveness) is parallel work, not a blocker, but catches regressions early.

ONE-LINE SUMMARY:
Today the team unblocks the build (#99, #82), then ships FR-1–FR-5 (seller auth, shop creation, product CRUD, image upload, storefront) in parallel — design, backend, and tests all moving at the same time.
