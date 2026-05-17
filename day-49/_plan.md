# Day 49 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 103
- **Saved:** 17/05/2026, 3:30:10 PM

---

FINISHED:
- Day 48 code review verified 4 Stage 1 hardening features shipped and working: password auth (bcrypt 12), password reset (1hr tokens), product variants with inventory validation, shop branding endpoints + storefront display
- Build passing, containers healthy, database migrated, health check live
- Core MVP scope (F1–F12) functionally complete per warehouse state; 50/60 tasks closed
- Deployed and testable at current host

PENDING:
- Host name / DNS for stable testing URL (#142) — blocks customer-facing QA and demo credibility
- Order CSV export (#140) — seller accounting need, not critical to MVP but high-priority open
- Design mockups for password reset, seller profile, shop branding UI (#133) — needed to match implemented backend endpoints
- Seller profile endpoints (#131) and inventory stock validation (#130) — backend features ready to code, waiting on design approval for profile page
- Playwright test suite for product CRUD, category filter, email verify (#66) — no regression coverage yet for F3, F7, F1
- CEO demo script + end-to-end flow walk-through (#76) — founder visibility into what actually ships

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #140 (order CSV export — 2-3 hours), #131 (seller profile endpoints — 3-4 hours), #130 (inventory stock validation with atomic checkout — 4-5 hours). These are all backend, all unblocked by design, all reduce seller friction in daily operations. Anil takes all three in parallel; Kenji supports if needed.
- Stream 2 (designer): Ship #133 mockups in one batch — password reset page, seller profile editor, shop branding customizer. Match existing design patterns from storefront. Mobile-responsive. These unblock #131 and #130 for frontend implementation next cycle. Chiara owns.
- Stream 3 (tester): Write Playwright coverage for #66 (product CRUD, category filter, email verify) against live deployment. Then write regression tests for inventory checkout (#130) and profile update flow (#131) as engineer ships. Priya executes; test-first approach.
- Stream 4 (reviewer): Verify CSV export output format and order atomicity (#140), seller profile access control and data validation (#131), inventory stock decrement in transaction (#130). Søren runs final code review end-of-day before merge.
- Stream 5 (requirements): Confirm #142 host name is provisioned and DNS resolves by EOD — this unblocks demo and customer testing. Kenji owns; escalate if infrastructure delay.

ROLE PLAN:
- requirements: YES — host provisioning (#142) is a gate for testing credibility; someone must track it to completion today
- design_qa: NO — design output exists (#133 is in-flight); QA bandwidth better spent on test writing
- design: YES — #133 is the design blocker; shipping mockups today unblocks profile + branding frontend work tomorrow
- engineering: YES — three parallel backend tasks (#140, #131, #130) fit the 60–80 tool-call budget and all reduce seller friction; no design dependency
- review: YES — code review on all three engineer super tasks must happen end-of-day to unblock merge
- test: YES — regression suite for existing features (#66) + new feature coverage (#130, #131) keep quality signal live as scope grows

ONE-LINE SUMMARY:
Today the team ships order CSV export, seller profile endpoints, and inventory validation (engineer) in parallel with password-reset/profile/branding UI mockups (designer) and end-to-end Playwright regression tests (tester), while unblocking stable host DNS for demo.
