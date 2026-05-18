# Day 56 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 114
- **Saved:** 18/05/2026, 12:05:52 PM

---

FINISHED:
- Baseline shop platform deployed live at https://www.soloshopbox.com (health check + homepage + orders page rendering, no runtime errors)
- 56 of 60 feature tasks completed through day 55 (FR-1 through FR-23 + additional infrastructure)
- Docker build + deploy pipeline stable; Stripe webhook integration + order creation working; seller auth via magic link confirmed
- Orders dashboard renders correctly after day 28 commit restore; critical TypeScript build blocker fixed

PENDING:
- FR-37 (email template editor for order confirmations) — open task #144, assigned Anil
- FR-32 (product CSV import for bulk upload) — open task #143, unassigned
- FR-25 (seller profile model + endpoints) — open task #131, assigned Anil
- FR-24 (inventory tracking with stock validation at checkout) — open task #130, assigned Kenji + Anil
- Day 54's advanced features (FR-156/157/158) were lost in broken commit; need re-implementation
- No design QA pass on current orders/checkout flow since last rebuild

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship FR-24 (inventory model + checkout validation) and FR-32 (CSV import parser + bulk product endpoint) in parallel—both unlock seller efficiency at scale. Anil tackles FR-24 (database schema + Stripe line-item logic); second engineer or Kenji preps CSV parser logic + test fixtures. Both land before EOD so tester can validate against real product upload workflows.
- Stream 2 (designer): Ship storefront product detail page mockup (missing from current UI—customers need to see full image + description before adding to cart) and seller settings/profile page (supports FR-25 profile endpoints). Both tie directly to what engineer is shipping and need live for tester to validate checkout-to-order flow.
- Stream 3 (tester): Write Playwright tests for FR-24 (stock count validation: add item, reduce inventory, verify checkout blocks oversell) and FR-32 (CSV upload: parse 10-row file, verify products appear on storefront, verify image fields map correctly). Both are blocker tests—inventory bugs kill revenue, CSV corruption kills seller trust.
- Stream 4 (reviewer): Verify engineer's FR-24 + FR-32 branches before merge (schema safety, CSV injection risk, Stripe metadata correctness). Smoke test on staging: upload 5-product CSV, buy out of stock item, confirm validation blocks checkout.
- Stream 5 (PM/requirements): Kenji clarifies acceptance criteria for FR-25 (which profile fields are MVP vs. nice-to-have) so designer doesn't overscope; also confirms CSV import field mapping (which Shopify columns do we support?) before engineer locks schema.

ROLE PLAN:
- engineering: YES — FR-24 and FR-32 are the next two revenue-blocking features; engineer has 60-80 calls capacity; both land in parallel today.
- review: YES — merged code needs verification before deploy to avoid another day-28 restore incident; CSV import especially needs security check.
- design: YES — product detail page and seller profile UI are currently missing; without mockups, engineer builds blind and tester can't validate customer journey.
- design_qa: NO — design QA review happens after design ships, not before; allocate for day 57.
- connectivity_qa: YES — FR-24 touches Stripe line-item logic and inventory webhooks; FR-32 involves file upload route; both need auth + API route verification before test writes Playwright.
- test: YES — FR-24 and FR-32 are high-risk features (data integrity + revenue logic); Playwright coverage required before these hit production.
- requirements: YES — FR-25 scope creep is real; PM must lock field list so designer doesn't ship 8 fields when 3 are MVP.

ONE-LINE SUMMARY:
Today the team ships inventory tracking (FR-24), bulk product CSV import (FR-32), and seller profile UI (FR-25) in parallel—engineer + designer + tester attacking three revenue-blocking features simultaneously while reviewer gates for security and PM locks scope.
