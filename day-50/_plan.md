# Day 50 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 108
- **Saved:** 18/05/2026, 3:59:21 AM

---

FINISHED:
- Day 49 Prisma migration resolved, deployment verified, app health checks pass (port 3000 live)
- MVP backend foundation (F1–F10): auth, shop creation, product CRUD, cart, Stripe webhook integration — 52/60 tasks closed
- Design system fix (text-slateBlue → text-slate-blue) landed
- Database schema stable, ready for feature builds

PENDING:
- #144 (FR-37): Email template editor — high priority, unstarted
- #143 (FR-32): CSV product import — high priority, unstarted
- #131 (FR-25): Seller profile endpoints — high priority, unstarted
- #130 (FR-24): Inventory tracking (stock count + checkout validation) — high priority, unstarted
- #106: Re-deploy day 29 features (F31–F40: profile, branding, email, billing, analytics) — unclear status from warehouse
- #76: CEO demo (end-to-end walk-through) — blocked until #77 ships
- #66: Playwright tests for product CRUD, category filter, email verify — no test coverage yet for open tasks

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Attack #144 (email template CRUD + merge tag injection), #143 (CSV import parser + validation), and #130 (inventory tracking with stock decrement on Stripe webhook). These three unblock seller workflow completeness and require zero design iteration. Start with #130 (blocks checkout), then #144 (order notifications), then #143 (bulk workflow).
- Stream 2 (designer): Ship /dashboard/email-template page (template editor UI, merge tag reference, test email button) and /dashboard/products/import page (file upload, validation feedback, success/error summary). Both pages are form-heavy, low-fidelity acceptable today.
- Stream 3 (tester): Write Playwright suites for FR-37 (email template save/send), FR-32 (CSV parse/validate/create), FR-24 (inventory display, checkout rejection on out-of-stock, stock decrement after payment). Focus on unhappy paths (malformed CSV, oversell race condition, invalid merge tags).
- Stream 4 (reviewer): Verify #130, #144, #143 before merge; confirm Stripe webhook atomicity for stock decrement; check XSS sanitization on email template body.
- Stream 5 (requirements): Confirm acceptance criteria for #130, #144, #143 are locked; flag any missing edge cases (e.g., what happens if CSV has 500 rows and 10 are invalid—return partial success or reject entire batch?).

ROLE PLAN:
- engineering: YES — Four high-priority backend tasks (inventory, email template, CSV import, profile) are queued and ready to parallelize; engineer has 60–80 tool calls available and day 49 proved the schema is stable.
- review: YES — All four features touch sensitive paths (payment, XSS, file parsing); code review must gate each before merge.
- design: YES — Two new seller dashboard pages (email template editor, CSV import UI) ship today; both are form-driven and require UX decisions on error states and merge tag picker.
- test: YES — Open tasks have zero test coverage; Playwright must write suites for stock validation, email template injection, CSV edge cases before engineer marks done.
- requirements: YES — Acceptance criteria on #130, #143, #144 need final clarity on edge cases (partial CSV fail, race condition handling, sanitization rules) before engineering commits.
- design_qa: NO — Design is shipping low-fidelity forms, not high-polish UI; QA pass not required until later.

ONE-LINE SUMMARY:
Today the team ships inventory tracking (FR-24), email template editor (FR-37), and CSV product import (FR-32) in parallel, unblocking seller order notifications and bulk workflows by day 51.
