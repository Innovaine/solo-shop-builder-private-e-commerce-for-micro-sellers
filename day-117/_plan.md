# Day 117 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 198
- **Saved:** 21/05/2026, 8:06:47 PM

---

FINISHED:
- 56 tasks closed; core MVP wiring complete (signup, shop creation, product CRUD, Stripe integration, order dashboard, status updates)
- Dockerfile + deployment config shipped
- Product image upload to S3 (F4) live
- Public storefront + cart (F5, F8) functional
- Stripe webhook order creation (F10) working
- 4 tasks in progress on Anil's queue (dashboard metrics, interface drift, form nesting TS errors)

PENDING:
- #338: Form tag nesting in product/new/page.tsx — 29 TS errors blocking deployment
- #339: Dashboard revenue/AOV metrics hardcoded to USD only (no multi-currency prep)
- #340, #341: ProductAnalytics + OrderCount interfaces drifting from Prisma schema — will cause runtime bugs as data grows
- No fidelity QA pass yet on storefront or dashboard (design hasn't signed off on pixel accuracy, spacing, mobile behavior)
- No Playwright tests written for happy path (signup → product creation → checkout → order tracking)
- No connectivity verification that all routes + webhooks fire in sequence without race conditions

TODAY'S WORK STREAMS:
- **Stream 1 (engineer):** Anil clears the 4 blocking tasks (#338 TS errors, #339 USD fix, #340 ProductAnalytics sync, #341 OrderCount sync), then ships F6 (category assignment dropdown) + F7 (category filter on storefront). These unblock design review and tester validation. Target: ship with zero TS errors, deploy by EOD.
- **Stream 2 (designer):** Chiara audits live storefront (F5 mobile responsiveness, product card layout, checkout button affordance) and dashboard (F11 order table readability, status dropdown UX). Ship 2–3 fidelity fixes + mobile breakpoint file for engineer to consume. Do NOT wait for engineer to finish; review what's live now.
- **Stream 3 (tester):** Priya writes Playwright suite covering F1 (signup), F3 (product creation), F5 (storefront browse), F8 (cart add/remove), F9–F10 (Stripe checkout → order webhook), F12 (status update). Run against staging deploy as engineer ships. Target: 6–8 happy-path tests, all passing by EOD.
- **Stream 4 (reviewer):** Søren does continuous code review on Anil's 4 pending + 2 new tasks (F6, F7). Catch TS errors, schema drifts, webhook edge cases before merge. Sign off each task within 30 min of PR.
- **Stream 5 (standards_qa):** Vitali runs automated checks on Anil's PRs (Prisma model alignment, API response shape consistency, env var coverage). Fail fast if interface contracts break.
- **Stream 6 (connectivity_qa):** Zainab test-runs the full order flow end-to-end (auth → product upload → checkout → webhook → order appears in dashboard) on staging. Catch race conditions, missing error handlers, auth token expiry issues.
- **Stream 7 (task_verifier):** Mehrdad closes #338, #339, #340, #341 once code review + tests pass. Spot-check live URLs load without 500s.

ROLE PLAN:
- engineering: YES — Anil is the only engineer and 4 tasks are actively breaking the build; he must clear them + ship F6/F7 to unblock design and testing
- review: YES — continuous code review on TS + Prisma work is non-negotiable; catching drifts now prevents order data corruption later
- design: YES — storefront and dashboard are live but unvalidated; Chiara must audit mobile, spacing, and checkout UX before tester writes tests against broken UI
- test: YES — no Playwright coverage yet; Priya must build happy-path suite as engineer ships so team has signal on F1–F12 working end-to-end
- connectivity_qa: YES — webhook race conditions and auth token handling are silent killers; Zainab must verify full order flow doesn't break under real Stripe delays
- standards_qa: YES — interface drift is already happening (#340, #341); Vitali must enforce Prisma sync on every PR or data model breaks at scale
- task_verifier: YES — need proof each blocked task is actually closed + deployed; Mehrdad spot-checks live URLs
- requirements: NO — no new features need spec'ing today; scope is locked on MVP, all 12 FRs are defined
- design_qa: NO — design QA is subsumed by design (Chiara) doing live audit + fidelity checks

ONE-LINE SUMMARY:
Today the team clears 4 blocking TS+schema tasks, ships F6+F7 (categories), builds Playwright coverage for F1–F12, and validates the full order-to-dashboard flow end-to-end across design, code, and connectivity.
