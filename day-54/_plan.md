# Day 54 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 112
- **Saved:** 18/05/2026, 7:33:10 AM

---

FINISHED:
- Docker build succeeds, app deploys cleanly (verified 2026-05-18T03:51:05)
- FR-152 (shop pause toggle), FR-153 (product draft toggle), FR-154 (order history), FR-155 (bulk status update) shipped and code-reviewed
- Cart checkout bug (#158) fixed
- 56 of 60 task board items closed; ready to attack remaining 4 open features

PENDING:
- #144 (FR-37: email template editor) — high priority, unassigned
- #143 (FR-32: CSV product import) — high priority, unassigned
- #131 (FR-25: seller profile model + endpoints) — high priority, unassigned
- #130 (FR-24: inventory tracking + stock validation) — high priority, unassigned

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #144 (FR-37 email template editor with merge tags + XSS sanitization), #143 (FR-32 CSV import with validation), and #130 (FR-24 inventory tracking with stock atomicity). These are pure backend + database work; parallelize across endpoints. Leave #131 (seller profile) for day 55 if capacity runs short — it's lower risk than the other three.
- Stream 2 (designer): Ship /dashboard/email-template editor page (FR-37), /dashboard/products/import page (FR-32), and inventory field UI on product create/edit (FR-24). All three have clear specs in requirements.md; design can move fast here.
- Stream 3 (tester): Write Playwright tests for FR-37 (template save + merge tag rendering + test email send), FR-32 (CSV parse + validation + error summary), and FR-24 (stock display on storefront, checkout rejection when out of stock, stock decrement post-payment).
- Stream 4 (reviewer): Verify #144, #143, #130 code compiles, migrations are safe, endpoints follow auth + validation patterns, and Docker build succeeds before shipping.
- Stream 5 (requirements): Kenji — flag any ambiguity in FR-37 (merge tag whitelist), FR-32 (CSV column order flexibility?), or FR-24 (fractional stock allowed?) before engineer starts. One sync call, max 15 min.

ROLE PLAN:
- requirements: YES — Kenji clarifies merge tag scope, CSV flexibility, inventory decimals before engineer writes
- design_qa: YES — Gopal visually validates email template editor, CSV import, and inventory UI against brand + usability patterns
- connectivity_qa: YES — Zainab tests all new endpoints (template save/fetch, CSV upload endpoint, inventory GET/PUT) for auth, rate limits, and error handling
- design: YES — Chiara ships three dashboard pages (email-template, products/import, product create/edit inventory field)
- engineering: YES — Anil ships FR-37, FR-32, FR-24 in parallel; three separate PRs or one PR with three commits, both work
- review: YES — Søren verifies all three features compile, migrations are backward-compatible, and app starts clean on day 54
- test: YES — Priya writes e2e tests covering all three FRs; tests run post-merge before deploy

ONE-LINE SUMMARY:
Today the team ships email templates (FR-37), CSV product import (FR-32), and inventory tracking (FR-24) in three parallel streams, closing 3 of 4 remaining open tasks and leaving Solo Shop Builder one feature away from a complete MVP feature set.
