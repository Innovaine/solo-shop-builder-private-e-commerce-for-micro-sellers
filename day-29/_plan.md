# Day 29 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 64
- **Saved:** 17/05/2026, 12:11:13 AM

---

FINISHED:
- Day 28 code review: 5 hardening features (password auth, reset flow, webhook HMAC, CSV export, analytics) verified as production-ready in Anil's code — no blockers, ship approved (#84, #85, #86, #87, #88)
- Dockerfile + environment scaffolding complete (.dockerignore, .env.example, docker-compose ready per DEPLOYMENT.md)
- 20 MVP features defined and mapped to task board (F1–F20 across #77, #78, #83)
- Søren's code audit confirmed extractable patterns — engineer can ship at 3–5 features per day without rework

PENDING:
- Docker build blocker (#82): 3 missing dynamic exports need fixing before any deploy can run — blocks smoke test
- Day 25 MVP validation blocker (#73): Not detailed in this warehouse snapshot — need current status from Anil before assigning further work
- Import path errors in checkout + orders pages (#59): Unblock these first so payment features can land cleanly
- Design system compliance (#75, #79): UI polish + accessibility review not yet complete — blocking visual shipping for several features
- Playwright suite (#74): No tests written yet for any F1–F20 — coverage gap grows daily as features ship

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Attack #82 (Docker exports), #59 (import path fixes), then parallel-ship #77 (FR-1 to FR-10: auth, shop, products, cart, checkout backend) and #78 (FR-11 to FR-20: dashboard, tracking, emails). Budget: ~70 calls. Anil has shown he can extract 5 features cleanly per day — don't throttle.
- Stream 2 (designer): Ship design/system/components.html (#58) first — engineer is blocked waiting for it. Then parallel-design #65 (verify page, product management UI, design system compliance) and #62 (verify page render) + #60 (product CRUD forms). Target 5 design files by EOD.
- Stream 3 (tester): Write Playwright coverage for F1–F20 in parallel as engineer ships (#74, #66). Start with auth + shop creation (F1–F2), then product CRUD (F3–F4), then cart + checkout (F8–F9). Don't wait for engineer to finish all features — write tests incrementally as each lands.
- Stream 4 (reviewer): Run docker compose build + smoke test on Anil's Day 28 code once #82 is fixed. Verify import paths resolve in #59. Then code-review #77 and #78 output before EOD (both ship hard features; both need clean audit).
- Stream 5 (requirements): Validate CEO demo flow against actual shipped features by end of day (#76, #80) — confirm signup → order → tracking is buildable from #77 + #78 output. Flag any missing pieces to engineer immediately.

ROLE PLAN:
- engineering: YES — Anil has 60–80 calls; #82 and #59 unblock payment path, then parallel #77 and #78 ship the entire MVP backend in one day at 3–5 features each. This is the critical path.
- review: YES — Code audit must verify #77 and #78 land cleanly and #82 export fix actually works; smoke test required before any confidence in deploy.
- design: YES — #58 (components) is a hard blocker for engineer UI work; #65, #62, #60 ship verify page and product forms in parallel to keep engineer fed. Design cannot skip today.
- test: YES — Playwright suite (#74) must scale with engineer output; starting with F1–F2 (auth) and F3–F4 (products) today captures critical paths and unblocks CEO demo verification.
- requirements: YES — #76 and #80 are CEO demo tasks; need Kenji to validate the actual shipping matches the demo script, and surface any scope creep or missing features to Anil immediately.

ONE-LINE SUMMARY:
Today engineer ships Docker fix + full MVP backend (F1–F20 auth through orders), designer ships component system + 4 page templates in parallel, tester covers 8+ features with Playwright, and requirements validates the CEO demo is buildable from what lands.
