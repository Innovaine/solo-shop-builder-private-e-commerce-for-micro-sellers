# Day 78 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 142
- **Saved:** 19/05/2026, 3:14:36 PM

---

FINISHED:
- Prisma singleton pattern (lib/db.ts) — prevents connection pool exhaustion on CSV imports
- MyFatoorah payment callback fix — standardized paymentId field matching between checkout and callback phases
- Health check passing at https://www.soloshopbox.com/api/health — build deployed, day 77 ship verdict ✅
- 59 tasks closed to date; product is live and taking transactions

PENDING:
- #224: app/api/checkout/route.ts:9 — Prisma import syntax fix (blocker on standards, not functional)
- Seller CSV bulk-product upload — referenced in lib/db.ts but no UI or route yet
- Order filtering/date-range dashboard — spec calls for unfiltered view in F11, but real sellers will need this by paying-customer milestone (week 12)
- Customer shipment tracking page — F12 marks order "shipped" but no public tracking URL for buyers yet
- Seller analytics dashboard — mentioned in vision but not in MVP spec; defer unless customer asks

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship F13–F15 in parallel: (1) seller bulk CSV product upload route + S3 integration, (2) public shipment tracking page (customer views order status via magic link), (3) fix #224 import syntax + add standards-qa pass. Three features, one engineer, parallel execution—CSV upload and tracking page don't block each other. Reference: F3 (CRUD exists), F10 (webhook order creation exists), F12 (status updates exist).
- Stream 2 (designer): Ship 3 pages in parallel: (1) seller bulk upload UI (drag-drop or paste CSV), (2) customer tracking page (minimal—order #, items, status, shipment info), (3) seller dashboard polish (reorder columns, add sort by date/status). Don't wait for engineer—drop Figma files to /design/pages/ and engineer builds to spec.
- Stream 3 (tester): Write Playwright tests covering F13 (CSV upload happy path + malformed CSV rejection), F14 (customer tracking page loads + shows correct order), F15 (dashboard column reorder). Tests reference actual seller and customer workflows, not unit edge cases.
- Stream 4 (reviewer): Verify #224 fix ships cleanly, then sign off on engineer's three features before end of day. Code review SLA: 2 hours max turnaround per stream.
- Stream 5 (PM/requirements): Kenji—confirm seller CSV schema (which fields: title, price, description, image URL, category?) and customer tracking data needs before designer starts UI. 10-min call, block nothing.
- Stream 6 (standards_qa): Vitali—spot-check import syntax across api/ folder after #224 lands; enforce one linting rule consistently this week, don't add new ones mid-cycle.

ROLE PLAN:
- engineering: YES — 59 tasks closed; team has momentum; three parallel features (CSV, tracking, dashboard) are concrete next steps with clear acceptance criteria and no cross-blocking.
- review: YES — day 77 ship landed cleanly; reviewer owns the gating function; #224 + engineer output needs sign-off before deployment.
- design: YES — MVP spec calls for F13 (bulk upload UI), F14 (tracking page), F15 (dashboard UX); designer ships files in parallel with engineering, not after.
- test: YES — three new features need Playwright coverage; tests write to actual seller/customer workflows, not mock edge cases.
- task_verifier: YES — Mehrdad verifies completed tasks against acceptance criteria before they're marked done; prevents rework.
- requirements: YES — Kenji clarifies CSV schema and tracking page data model (5-min decision) so designer doesn't guess.
- standards_qa: YES — Vitali enforces linting on #224 and checks import patterns across api/ to catch future syntax drift.
- connectivity_qa: NO — no new auth, routes, or integration changes today; only when F13/F14 routes are built and need end-to-end validation (tomorrow or day 80).
- design_qa: NO — shipping design files; fidelity check happens after engineer builds, not before.

ONE-LINE SUMMARY:
Today the team ships seller bulk CSV product upload, public customer shipment tracking page, and dashboard polish—three features in parallel while #224 syntax fix clears standards gate.
