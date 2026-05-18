# Day 63 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 126
- **Saved:** 18/05/2026, 6:48:57 PM

---

# SOLO SHOP BUILDER — DAY 63 BRIEF

## FINISHED
- Seller signup (magic link auth) — F1 shipped
- Shop creation (name, slug, basic info) — F2 shipped
- Product CRUD (create, read, update, delete) — F3 shipped
- Product image upload to S3 with CDN serving — F4 shipped
- Public shop storefront (product list + detail pages) — F5 shipped
- Category assignment (dropdown during product creation) — F6 shipped
- Product search/filter by category on storefront — F7 shipped
- Shopping cart (browser session storage) — F8 shipped
- Stripe Checkout integration (hosted checkout flow) — F9 shipped
- Order creation from Stripe webhook (payment_intent.succeeded) — F10 shipped
- Seller order dashboard (table, all orders, no filtering) — F11 shipped
- Order status updates (pending → paid → in-progress → shipped) — F12 shipped
- 43 additional features shipped (features 13–55 listed in task board as completed)
- Deployed live URL that accepts real orders

## PENDING
- #183: FR-14 customer order tracking page (no auth required) — Anil in progress, needs test coverage + verification
- #182: FR-32 CSV import error handling (validation + partial import) — Anil in progress, needs QA
- #181: FR-29 product CSV export (streaming, 1000+ products) — Anil in progress, needs perf test
- #180: FR-27 seller analytics dashboard (revenue, orders, top 5 products) — Anil in progress, needs design review
- #179: FR-34 order filtering (date range + status dropdown) — Anil in progress, needs connectivity check (date API, filter logic)

## TODAY'S WORK STREAMS

**Stream 1 (engineer — Anil):**
Push all 5 in-progress tasks to completion: finish FR-14 (customer tracking page) + FR-32 (CSV error handling) + FR-29 (CSV export streaming) + FR-27 (analytics) + FR-34 (order filtering). Test each against live shop data; don't wait for design review to land code.

**Stream 2 (designer — Chiara):**
Ship high-fidelity mockups for: (1) customer order tracking page (FR-14), (2) seller analytics dashboard (FR-27), (3) CSV import/export UI (FR-29/FR-32). Mockups should show error states, empty states, and 3+ product counts. Reference /design/pages/ directory.

**Stream 3 (tester — Priya):**
Write Playwright tests for: (1) customer can view tracking without login (FR-14), (2) seller can filter orders by date range and status (FR-34), (3) CSV export downloads + streaming large product list (FR-29), (4) analytics dashboard loads revenue correctly from orders (FR-27). Tests run against live shop.

**Stream 4 (reviewer — Søren):**
Code review all 5 PRs as they land. Verify: Stripe webhook idempotency (no duplicate orders), CSV streaming doesn't load entire file into memory, analytics queries use indexed fields, order filter UI matches designer mockups.

**Stream 5 (connectivity QA — Zainab):**
Verify date filter API endpoints (FR-34) return correct order subsets, CSV export endpoint handles >1000 products without timeout, analytics aggregation queries are optimized. Run load test on order filtering.

**Stream 6 (task verifier — Mehrdad):**
Verify completed tasks (#179–#183) against product spec. Check: customer tracking page is truly no-auth, CSV export doesn't break on special chars in product names, analytics shows correct top 5 products.

**Stream 7 (design QA — Gopal):**
Fidelity check: customer tracking page matches storefront visual language, analytics dashboard uses consistent color/spacing with seller dashboard, CSV UI doesn't introduce new button styles.

**Stream 8 (PM — Kenji):**
Write one-line ship notes for each completed task; flag if any task (esp. #182, #184) blocks next sprint work.

## ROLE PLAN
- **engineering: YES** — 5 in-progress super tasks need dev completion + live testing; Anil is hot, don't pause momentum
- **review: YES** — 5 PRs landing today need same-day review to unblock merge; bottleneck risk is high
- **design: YES** — FR-14, FR-27, FR-29/32 require UI mockups; designer ships in parallel, engineer doesn't wait for Figma
- **connectivity_qa: YES** — order filter, CSV export, and analytics APIs are untested at scale; need route verification + load baseline
- **test: YES** — all 5 shipped features need Playwright coverage before they ship to paying users; test in parallel with dev
- **task_verifier: YES** — board has 55 completed tasks; verifier must confirm each meets spec, no technical debt buried
- **design_qa: YES** — fidelity risk on 3 new UI surfaces; QA spot-checks against existing storefront language
- **requirements: YES** — PM writes ship notes + flags dependencies for next sprint (post-MVP feature planning)

## ONE-LINE SUMMARY
Today the team ships FR-14, FR-27, FR-29, FR-32, and FR-34 in parallel across eng/design/test/review/QA — aiming for 5 features live by EOD.
