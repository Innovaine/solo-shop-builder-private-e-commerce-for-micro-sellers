# Day 32 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 69
- **Saved:** 17/05/2026, 2:12:20 AM

---

FINISHED:
- Day 31 build clean: Tailwind color class fixes (slateBlue → slate-blue) applied across branding, email-template, profile pages; landing page + dashboard render correctly; containers running, health checks pass.
- Code review complete: binary production-ready, design fidelity baseline 65/100, target 80/100 by end of this week.

PENDING:
- #99: Day 29 build blocker (import paths + FormField props) — critical, must be resolved before day 32 work lands.
- #106: Re-deploy day 29 features (F31-F40: profile, branding, email, billing, analytics) — these features exist in code but are not yet live in production.
- Day 29 feature set (F31-F40) is coded but untested in staging; design fidelity on these pages not yet verified.
- MVP core features (F1-F20) task board status unclear — #83 shows "complete and test" but warehouse files don't show full feature implementation; clarify what's actually shipped vs. what's still open code.

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Unblock #99 immediately (import paths + FormField props fix), then ship #100–#102 in parallel: FR-21 password auth (signup + login), FR-22 password reset, FR-23 webhook signature verification. These unblock payment + seller identity flow. Reference: app/api/account/password/route.ts exists; extend to include reset + webhook handlers.
- Stream 2 (designer): Ship responsive verification page (#62), product management UI (#65), and storefront category filter UI (#64) — these are F1, F6, F7 from MVP spec and are blocking upstream tests. Use design system components to maintain 80/100 fidelity. Reference: designs/pages/verify.html, product-crud.html, category-filter.html.
- Stream 3 (tester): Write Playwright tests for F1–F10 (signup, shop, products, cart, checkout, orders) per task #74 — run these against engineer's password auth + webhook work (#100–#102) to verify end-to-end flow. Tests should match real user clicks, not unit assertions.
- Stream 4 (review): Verify #99 fix compiles, then spot-check #100–#102 for security (webhook signature, password hashing, reset token expiry). Approve production deployment of day 29 features (#106) once tests pass.
- Stream 5 (requirements): Clarify with Anil: which of F1–F40 are actually shipped in code vs. on task board only? Unblock ambiguity on #83 + #95 status so we don't re-build what exists.

ROLE PLAN:
- engineering: YES — #99 blocker is critical path; shipping password auth (#100–#102) unblocks payment identity and seller-side order flow.
- design: YES — responsive MVP pages (#62, #64, #65) are blocking Playwright test coverage and must ship today to keep testing pace.
- design_qa: YES — fidelity baseline is 65/100; day 32 design work must hit 80/100 minimum before design sign-off, verify via Gopal's checklist.
- review: YES — security review of password + webhook code is non-negotiable before production; also verify day 29 feature re-deploy is safe.
- requirements: YES — resolve F1–F40 ambiguity so engineering doesn't waste cycles on duplicate work or missing scope.

ONE-LINE SUMMARY:
Today the team unblocks the build (#99), ships password auth + webhook verification in parallel (#100–#102), designs responsive MVP pages (#62, #64, #65), and tests end-to-end signup-to-order flow to verify seller + customer identity and payment are solid.
