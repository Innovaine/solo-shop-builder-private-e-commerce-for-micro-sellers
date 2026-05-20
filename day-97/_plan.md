# Day 97 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 168
- **Saved:** 20/05/2026, 4:55:19 PM

---

FINISHED:
- App deployed live to https://www.soloshopbox.com with health check passing (day 96, Søren verified)
- 4 wiring fixes shipped: S3 deduplication, profile/branding image upload consolidation, TypeScript scope resolution
- 55 of 60 tasks completed; codebase is in production-ready state
- Day 96 code review verdict: SHIP ✅

PENDING:
- #277: Branding image upload not working (assigned to Anil, open, critical path)
- #278: Shop image branding/profile image choice consolidation (Anil in-progress, overlaps with #277)
- #276: Profile image upload not working (Anil in-progress, likely same root cause as #277)
- #255: route-validator shows 3 broken template strings, 4 orphans, 1 method mismatch (BLOCKED, needs unblocking before full feature test pass)
- #279: Duplicate s3.ts modules with diverging ACL handling (Anil in-progress, wiring blocker)

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Anil unblocks #279 (delete app/lib/s3.ts duplicate, consolidate ACL logic), then attacks #277 + #278 in parallel (branding/profile image upload — likely single root cause, test both upload paths end-to-end). Fix #255 route-validator wiring if it's blocking tests. Ship all three by EOD.
- Stream 2 (designer): Ship product detail page mockup (design/pages/product-detail.html), seller profile/branding edit modal (design/pages/seller-branding.html), and order detail view (design/pages/order-detail.html) — these support upcoming feature work and give tester coverage targets.
- Stream 3 (tester): Write Playwright tests for F3 (product CRUD), F4 (image upload to S3), F11 (seller order dashboard read), and F12 (order status dropdown). Verify #277, #278, #276 image uploads work end-to-end after engineer ships. 4-5 tests by EOD.
- Stream 4 (reviewer): Verify Anil's #279 S3 consolidation (is the duplicate truly deleted? ACL logic unified?), then code-review #277/#278/#276 image upload fixes before merge to main. Keep build time <3 min.
- Stream 5 (connectivity_qa): Verify routes from #255 are wired correctly after fix — run route-validator, confirm no broken templates, no orphans, all methods match. One pass, one verdict.

ROLE PLAN:
- engineering: YES — Anil has 3 blocking wiring tasks (#279, #277, #278) and #255 route-validator is unblocked only after these resolve; momentum depends on his output today
- review: YES — Anil's changes touch S3 ACL, image upload paths, and route definitions; code review is unblock gate before tester can verify
- design: YES — Product detail, seller branding, and order detail pages are needed for feature coverage and give engineer/tester clear targets for next cycle's work
- test: YES — Image uploads and order dashboard are live features; Playwright tests verify they work before we call them done; 4-5 new tests cover F3, F4, F11, F12
- connectivity_qa: YES — #255 route-validator blockage must clear today; Zainab runs validator after connectivity fixes land, confirms wiring is sound
- task_verifier: YES — Mehrdad closes #277, #278, #276, #279 after engineer + reviewer + tester sign off; proof of upload working, proof of S3 consolidation, proof of route-validator clean
- design_qa: NO — Gopal's fidelity checks are not blocking today; design will ship mockups, but QA can wait for end-of-week polish pass
- requirements: NO — Kenji's task board is current; no new scope needed; engineer is unblocked to execute existing open tasks
- standards_qa: NO — TypeScript scope was resolved day 96; no new linting blockers visible; Vitali can audit after day 97 ship if needed

ONE-LINE SUMMARY:
Today the team ships S3 deduplication + image upload fixes (#277, #278, #276), resolves route-validator wiring (#255, #279), and lands product-detail/branding/order-detail design pages + Playwright test coverage for CRUD, image upload, and order dashboard — all in parallel.
