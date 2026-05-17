# Day 37 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 82
- **Saved:** 17/05/2026, 4:22:41 AM

---

FINISHED:
- Dockerfile + Docker infrastructure (.dockerignore, DEPLOYMENT.md) — project can containerize
- Initial API routes scaffolded (account/password, analytics) — backend structure exists
- Environment config (.env.example, .qadar-env.json) — deployment ready
- 40 of 60 task board items closed — momentum is real, but last 20 are the critical path (auth, products, cart, checkout, orders, dashboard, tests)

PENDING:
- #82: Docker build blocker — 3 missing dynamic exports unresolved, blocks local dev and staging deploys
- #59: Import path errors in checkout + orders pages — unblock payment flow
- #118, #117: Anil's urgent fixes (unspecified in board, assume UI/styling or deployment blocker)
- #105: Priya's FR-21–FR-25 tests (password auth, webhook, refund, CSV) — lower priority than MVP validation
- Playwright test suite (#74) — zero test coverage on 20 MVP features, no safety net before customer demo

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #82 (Docker blocker) first—30 min max. Then ship #77 (FR-1 to FR-10 backend: auth, shop CRUD, products API, cart logic, Stripe webhook integration). Parallel: #59 (import path fixes). Target: three working API endpoints by end of day.
- Stream 2 (designer): Ship #65 (verify page + product management UI + design system components). Parallel: UI kit for #60 (product forms), #63 (category dropdown), #64 (filter UI). All in Figma; hand to engineer by EOD. Target: five pages/components.
- Stream 3 (tester): Write #74 (Playwright suite for F1–F20: signup flow, product CRUD, category filter, cart add/remove, checkout redirect, order creation from webhook). Don't wait for engineer; mock API responses. Run tests against staging. Target: 20+ passing tests covering happy path + one sad path per feature.
- Stream 4 (reviewer): Verify #77, #59, #82 before merge to main. Check Docker build succeeds after #82. Spot-check Stripe webhook parsing in #77 (high-risk code).
- Stream 5 (PM / requirements): Unblock Anil's #118, #117 immediately (what are the urgent fixes?). Confirm #80 (CEO DEMO verification flow) dependencies are clear. Confirm Stripe test keys are in .env.example.

ROLE PLAN:
- engineering: YES — Docker blocker (#82) and backend critical path (#77) must ship to unblock everything else; Anil's urgent fixes need to be identified and tackled first.
- review: YES — checkout/payment code (#77, #59) is high-risk and must not deploy broken; Docker fix needs verification.
- design: YES — #65 is the last blocking design task for MVP; product forms and category UI are ready to ship and need mockups before engineer builds them.
- test: YES — zero Playwright coverage on 20 features is a liability; tester must write #74 in parallel, not wait for engineer to finish building.
- requirements: YES — Anil's urgent fixes (#118, #117) are unspecified on the board; PM must clarify scope immediately so they don't become day-long rabbit holes.
- design_qa: YES — once #65 lands, design QA verifies fidelity against specs and flags regressions before engineer implements.

ONE-LINE SUMMARY:
Today the team ships Docker fix + full MVP backend (auth/shop/products/cart/orders), design UI kit for four critical pages, and Playwright test suite for all 20 features in parallel—unblocking CEO demo by EOD.
