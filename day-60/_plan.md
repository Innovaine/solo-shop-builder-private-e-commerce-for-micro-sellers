# Day 60 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 119
- **Saved:** 18/05/2026, 3:38:08 PM

---

FINISHED:
- 57 tasks closed (board shows 57/60 complete across MVP scope)
- Core MVP infrastructure live: Dockerfile, deployment pipeline (DEPLOYMENT.md), environment config (Stripe integration, S3 wired)
- Seller signup + shop creation (F1, F2) — magic link auth flow + slug generation working
- Product CRUD + S3 image upload (F3, F4) — full product lifecycle in dashboard
- Public storefront (F5) + category filtering (F6, F7) — customer-facing product listing live
- Shopping cart in localStorage (F8) + Stripe Checkout integration (F9) — payment flow end-to-end
- Order webhook ingestion + seller order dashboard (F10, F11) — orders persisting, visible to sellers
- Order status workflow (F12) — seller can mark pending → paid → shipped

PENDING:
- #173 (FR-24): Inventory atomic validation on checkout — task open, not started
- #172 (FR-21): Password authentication (signup + login options) — task open, not started
- #143 (FR-32): Product CSV import (bulk upload) — task open, not started
- Code review from day 59 failed mid-review (Anthropic API credit issue) — no reviewer feedback captured yet; unknown if blocking bugs exist in last shipment

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #173 (inventory checks block oversold checkouts), #172 (password auth as alternative to magic link), and #143 (CSV bulk import to unblock sellers with 50+ SKUs). These are the final three MVP blockers; all are independent and can run in parallel. Reference task board for acceptance criteria.
- Stream 2 (designer): Ship buyer checkout confirmation page (POST-Stripe redirect), seller CSV import UI (upload modal + preview table), and password signup/login pages. Three UI surfaces needed to close out the three engineer tasks; design files go to design/pages/checkout-confirmation.html, design/pages/csv-import.html, design/pages/password-auth.html.
- Stream 3 (tester): Write Playwright tests for inventory validation (attempt checkout with out-of-stock item, assert error), password login flow (signup with password, logout, login with stored credentials, assert session), and CSV import happy path (upload 10-row CSV, assert all products created with correct metadata). Tests live in test/ alongside existing suite.
- Stream 4 (reviewer): Verify engineer's day 60 code passes connectivity (all new routes return 200/400 appropriately, no orphaned promises), catches SQL/auth edge cases, and doesn't break existing order flow. Re-run the interrupted day 59 review on full changeset.
- Stream 5 (requirements): Confirm CSV schema (column headers, required fields, max file size) and inventory rules (shared pool across orders vs per-SKU) with Anil before engineer starts; one 30-min sync, not a doc rabbit hole.

ROLE PLAN:
- engineering: YES — Three independent backend features remain (inventory, auth, CSV); Anil can parallelize all three without blocking each other.
- review: YES — Day 59 review incomplete; Søren must verify code quality before shipping to production, especially on auth (SQL injection vectors).
- design: YES — Three new UI surfaces required to ship FR-21, FR-24, FR-32; Chiara ships mockups same day so engineer doesn't wait.
- test: YES — All three features need Playwright coverage before merge; Priya writes tests in parallel with engineering.
- connectivity_qa: NO — Routes + auth already proven; reserve Zainab for day 61 integration testing if bugs surface.
- design_qa: NO — Storefront + dashboard fidelity locked; no new design debt visible.
- requirements: YES — One 30-min call to lock CSV schema + inventory semantics, then done.

ONE-LINE SUMMARY:
Today the team ships inventory validation, password auth, and CSV bulk import in parallel — closing MVP and hitting "real seller can operate here" on day 60.
