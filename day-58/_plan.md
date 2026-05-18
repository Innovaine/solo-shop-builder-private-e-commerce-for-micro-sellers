# Day 58 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 116
- **Saved:** 18/05/2026, 1:18:14 PM

---

# BRIEFING — Day 58: Solo Shop Builder

## FINISHED:
- Logo upload feature (FR-6+) — multipart file handling, validation, storage to S3, verified live at www.soloshopbox.com
- Order filtering, metrics, dashboard sorting (FR-156/157/158) — already implemented, verified in code review
- 57 of 60 planned features complete; health check + Stripe webhook integration passing
- App builds, deploys, and serves public shop storefront + seller dashboard without blocker

## PENDING:
- FR-37: Email template editor (seller customizes order confirmation emails) — open, assigned to Anil
- FR-32: Product CSV import (bulk product upload) — open, unassigned
- FR-25: Seller profile model + endpoints — open, assigned to Anil
- Unclear: which of these 3 are BLOCKING revenue (i.e., required before first paid customer can use the product), vs. which are convenience features that can ship post-launch

## TODAY'S WORK STREAMS:

**Stream 1 (engineering):** Anil ships FR-32 (CSV bulk product upload) and FR-25 (seller profile endpoints). These unblock sellers who have 50+ products and need faster import than manual CRUD. FR-37 (email templates) deferred if it's not blocking first paying customer. Reference task #143, #131.

**Stream 2 (designer):** Chiara ships mockups for seller profile page (avatar, bio, shop description, contact info) and CSV upload UI (drag-drop zone, field mapper, preview, import button). These are blocking FR-25 and FR-32 shipping to production. Reference design/pages/seller-profile.html and design/pages/csv-import.html.

**Stream 3 (tester):** Priya writes Playwright tests for CSV import (valid file → products created in DB, invalid file → error message), seller profile CRUD (create/read/update), and email template customization (template persists, renders correctly in order confirmation). Tests run against live app endpoints.

**Stream 4 (reviewer):** Søren verifies FR-32 (CSV parsing, DB writes, no duplicate products) and FR-25 (profile model structure, API responses, auth checks) land on main and deploy to staging. Spot-check one CSV import end-to-end and one profile update before ship.

**Stream 5 (connectivity_qa):** Zainab verifies CSV import and seller profile endpoints authenticate correctly, accept valid payloads, reject malformed requests, and return proper HTTP status codes.

**Stream 6 (design_qa):** Gopal fidelity-checks profile page and CSV upload UI match Chiara's mockups on actual deployed staging app.

**Stream 7 (requirements):** Kenji clarifies: are FR-37 (email templates), FR-32 (CSV), and FR-25 (profile) all required before first paying customer, or can we ship profile + CSV, get a paying customer, then add email templates in cycle 116? This decision gates priority.

## ROLE PLAN:
- engineering: **YES** — 3 open features + 57 shipped = team is hot, Anil has momentum, CSV and profile are both revenue-adjacent (sellers with scale need bulk import, sellers want branded profiles)
- review: **YES** — all 3 features are shipping to production, Søren must verify before deploy
- design: **YES** — CSV upload UI and seller profile page are not yet mocked; Chiara must ship pages today for Anil to build against
- test: **YES** — new features need coverage; Priya writes Playwright tests as Anil ships
- connectivity_qa: **YES** — CSV import and profile endpoints are new API surface; Zainab validates auth, payloads, error handling
- design_qa: **YES** — Gopal verifies UI fidelity between design and live staging deployment
- requirements: **YES** — one blocking question: do all 3 features ship, or do we cut FR-37 to hit a paying customer by EOW?

## ONE-LINE SUMMARY:
Today the team ships FR-32 (CSV bulk product upload), FR-25 (seller profile), and FR-37 (email templates) in parallel — or cuts FR-37 if Kenji confirms we can launch with just profile + CSV and add templates post-revenue.
