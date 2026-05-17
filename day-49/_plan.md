# Day 49 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 101
- **Saved:** 17/05/2026, 2:53:12 PM

---

FINISHED:
- Day 48 code review passed: password auth (bcrypt 12), password reset (1hr tokens), product variants + inventory tracking, shop branding (color/tagline validation)—all deployed and verified in containers
- 52 tasks closed to date; MVP core (F1-F12) + Stage 1 hardening (auth, variants, branding) live and in production
- Dockerfile + .env.example + DEPLOYMENT.md in place; build + health check passing

PENDING:
- #105: Test FR-21 through FR-25 (Priya in-progress—password auth, reset, webhook, refund, CSV) — needs completion before day 49 end
- #106: Re-deploy day 29 features (Priya) — currently unstarted; unblocks demo readiness
- #77: FR-1 to FR-10 MVP backend (Priya) — status unclear; if incomplete, blocks #76 (CEO demo)
- #76: CEO demo walk-through (Priya) — depends on #77 completion and #106 re-deployment
- Known risk: Priya is claimed on 4 simultaneous open tasks (actual capacity unknown); designer mockups for #133 (password reset + profile + branding UI) not yet started

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #131 (seller profile CRUD endpoints + auth) and #130 (inventory stock validation + atomic decrement on checkout). These are high-priority hardening features that unlock the profile UI. Run both in parallel; no blocking dependency.
- Stream 2 (designer): Ship #133 mockups—password reset page, seller profile editor, shop branding controls. Mobile-responsive; reference existing design patterns from day 48 branding work. Three pages, one day.
- Stream 3 (tester): Write Playwright tests covering #131 (profile GET/PUT, seller auth boundary), #130 (out-of-stock label, checkout rejection, stock atomic decrement), and the complete password reset flow from #105. Tests must verify real user clicks, not unit assertions.
- Stream 4 (reviewer): Verify #131 and #130 code (auth boundaries on profile update, atomic transaction on stock decrement, no race conditions). Approve before merge.
- Stream 5 (requirements): Clarify Priya's actual capacity—she's on 4 open tasks. Confirm which one (#105, #106, #77, #76) is the true blocker for demo readiness and replan if needed. No new requirements until demo is confirmed shippable.

ROLE PLAN:
- engineering: YES — #131 and #130 are unblocked, high-priority hardening features that ship in one day and unlock profile UI; engineer has 60–80 tool calls available
- review: YES — code review needed before merge on #131 (auth boundary) and #130 (atomic stock decrement); Søren can turn this around in parallel with engineering
- design: YES — #133 mockups are blocking engineer hand-off to frontend; three pages, one day, high fidelity required for handoff
- test: YES — Playwright tests for #131, #130, and password reset (#105) complete coverage of new endpoints and user flows; tester ships in parallel, no wait
- requirements: YES — one task only: clarify Priya's workload and confirm demo readiness path; current task board shows 4 simultaneous claims on one person

ONE-LINE SUMMARY:
Today the team ships seller profile endpoints (#131) + inventory stock validation (#130) + three new UI mockups (#133) + Playwright tests for all three, in parallel, unblocking the CEO demo pipeline.
