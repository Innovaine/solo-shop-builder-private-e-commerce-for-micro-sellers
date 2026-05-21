# Day 116 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 195
- **Saved:** 21/05/2026, 7:44:11 PM

---

# DAY 116 BRIEFING — Solo Shop Builder

## FINISHED:
- 58 tasks closed; live app stable at www.soloshopbox.com (confirmed day 115)
- Core MVP features shipped: seller signup, shop creation, product CRUD, S3 image uploads, public storefront, category filters, cart (localStorage), Stripe Checkout, webhook order creation, seller dashboard, order status tracking
- Docker + deployment pipeline in place (Dockerfile, DEPLOYMENT.md, .env.example)
- No code review blockers identified day 115

## PENDING:
- #339: Dashboard revenue/AOV display hardcoded to USD only — needs currency abstraction or multi-currency support decision
- #338: Form tag nesting error in `/dashboard/products/new/page.tsx` — 29 TS errors blocking clean build
- Unanswered: which languages/currencies do we support in v1.0? (affects #339 scope)

## TODAY'S WORK STREAMS:

**Stream 1 (engineer):** Fix #338 (form nesting + TS errors in new product page) and #339 (USD hardcode in revenue display). If currency decision is "USD-only for MVP," #339 becomes a documentation fix; if multi-currency, scope to a single fallback currency + note for v1.1. Reference F3 (product CRUD) and F11 (order dashboard). 2–3 hours max per task.

**Stream 2 (designer):** No new pages required to close #338 or #339. Designer ships visual polish: (a) confirm new product form renders correctly after #338 lands, (b) check dashboard revenue card aligns with any currency label changes from #339, (c) audit product detail page (F5) for any missing error states or image fallback designs. Reference design/pages/shop-detail.html and design/pages/dashboard-orders.html if they exist.

**Stream 3 (tester):** Write Playwright tests for product creation flow (F3: add product with image, verify saved state) and order dashboard load (F11: seller sees all orders, can update status). Include edge cases: form submission with missing fields (#338 fix), revenue display with $0 orders (#339 context). Tests should run in CI post-deploy.

**Stream 4 (reviewer):** Verify #338 and #339 PRs: check TS errors fully resolved, confirm revenue display renders without runtime errors, verify no regression in Stripe webhook flow (F10). Approve merged code to staging.

**Stream 5 (task_verifier):** Close #338 and #339 once code lands and tests pass.

**Stream 6 (connectivity_qa):** No new routes or auth changes in today's scope; confirm existing Stripe webhook endpoint (`/api/webhook/stripe` or equivalent) still fires correctly post-#338 deploy.

**Stream 7 (design_qa):** Spot-check new product form (post-#338) and dashboard (post-#339) for pixel accuracy and responsive behavior at mobile + tablet widths.

**Stream 8 (standards_qa):** Enforce TS strict mode on any new files touched by #338; confirm #339 currency logic follows existing naming conventions (e.g., `formatCurrency()` vs `formatUSD()`).

**Stream 9 (requirements):** Hold; no new feature scope today. If #339 uncovers a multi-currency decision needed, PM queues it for day 117 refinement (not in scope for MVP per spec).

## ROLE PLAN:
- engineering: YES — two concrete bugs to close; unblocks clean build and dashboard credibility
- review: YES — both PRs need sign-off before merge
- design: YES — validate form and dashboard rendering post-fixes; no new comps needed
- design_qa: YES — fidelity check on form + dashboard after engineer ships
- connectivity_qa: YES — confirm Stripe webhook still fires post-deploy
- test: YES — product creation and order dashboard need coverage before we call MVP "done"
- task_verifier: YES — close #338 and #339 once verified
- standards_qa: YES — TS strict mode on new code
- requirements: NO — no feature scope changes; PM silent today

## ONE-LINE SUMMARY:
Today the team ships #338 (form fix) and #339 (currency display), validates both in design + tests, and confirms Stripe webhook still fires — unblocking a clean build.
