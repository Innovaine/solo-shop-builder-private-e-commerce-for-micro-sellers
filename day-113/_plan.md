# Day 113 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 191
- **Saved:** 21/05/2026, 5:27:23 PM

---

FINISHED:
- 54 of 60 tasks closed; Solo Shop Builder MVP is functionally complete (signup, product CRUD, shop storefront, cart, Stripe integration, order dashboard, status updates all deployed and live)
- Dockerfile + DEPLOYMENT.md + .env.example indicate production-ready infrastructure
- Seller and customer user flows have shipped end-to-end (magic link signup → product creation → public shop → checkout → order tracking)

PENDING:
- #323: Draft products still showing in storefront (blocks real seller workflow — sellers need to hide unpublished inventory)
- #321: Product creation currency hardcoded to USD (blocks multi-currency sellers, affects checkout)
- #320: Dashboard product page also USD-only (same root cause as #321, in-progress)
- #319: Orders CSV export broken (blocks seller analytics/accounting workflow)
- #327 + #326: 4 orphaned routes + 4 broken router links (technical debt, creates dead-end URLs for customers/sellers)

TODAY'S WORK STREAMS:
- Stream 1 (engineering): Attack #323, #321, #320 in parallel — draft product visibility is blocking real seller testing, and currency hardcoding breaks the product for any seller outside US. After those 3, fix #319 (CSV export) so sellers can actually move data out. Anil has proven velocity; parallelize these, don't serialize.
- Stream 2 (designer): Ship mobile responsive refinement for /shop/[slug] storefront and /dashboard/orders pages — we have 54 tasks done but haven't validated that sellers on tablets/phones can actually manage their shop. Design checkout flow confirmation modal (pre-Stripe redirect) so customers see what they're buying. 2-3 pages.
- Stream 3 (tester): Write Playwright tests for draft product visibility (F6 variation), multi-currency product creation (F3 USD→[currency] path), CSV export success path (F11 extension). Cover the 3 currency + visibility blocks Anil ships. Priya validates both happy path + edge cases (empty orders, single-item export).
- Stream 4 (reviewer): Verify #323, #321, #320 closed by code inspection + live URL test (does a draft product actually hide? does currency persist?). Spot-check the orphaned routes (#327) so we know if they're safe to delete. Søren clears blocker debt today.
- Stream 5 (connectivity_qa): Verify Stripe webhook handling still fires correctly after currency changes (F10 contract). Test that CSV export hits the right database query without N+1 issues. One tight pass; Zainab confirms the integration boundaries hold.

ROLE PLAN:
- engineering: YES — 5 open blockers on the board, all code-only, Anil can parallelize and ship 3-4 today
- review: YES — blockers need fast verification to unblock next test/QA cycle; Søren catches regressions before they hit staging
- design: YES — storefront + dashboard haven't been validated on mobile; checkout confirmation UX improves conversion and reduces support burden
- connectivity_qa: YES — currency change touches Stripe webhook contract and database queries; one verification pass prevents silent breakage
- test: YES — 3 new paths (draft visibility, currency, CSV) must have coverage before they touch production; Priya writes tests same day engineer ships
- task_verifier: YES — closes opened tasks #323, #321, #320 with proof (screenshot/URL); Mehrdad confirms each one is genuinely solved
- design_qa: NO — fidelity is already high on shipped pages; effort goes to mobile responsiveness (design stream) + connectivity verification (QA stream)
- standards_qa: NO — currency refactor and draft filtering don't need style audit; review + connectivity QA catch real bugs faster
- requirements: NO — task board is clear and unambiguous; no new discovery needed today

ONE-LINE SUMMARY:
Today the team ships draft product visibility, currency fix, and CSV export in parallel while design hardens mobile UX and connectivity QA validates Stripe + database integrity.
