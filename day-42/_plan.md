# Day 42 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 91
- **Saved:** 17/05/2026, 8:03:42 AM

---

FINISHED:
- Dockerfile + deployment scaffolding (day 29–41 work) — project can be containerized and pushed
- Auth skeleton: magic link signup flow drafted in app/api/account/password/route.ts
- .qadar JSON metadata files — integration + channel + email logs exist (no manual status tracking needed)
- 47 of 60 tasks completed; 12 open, 1 in-progress, 0 blocked
- README.md + DEPLOYMENT.md exist (deployment path is known)

PENDING:
- #59: Import path corrections in checkout + orders pages (blocks payment features) — Anil must fix first
- #106: Re-deploy day 29 features (F31-F40: profile, branding, email, billing, analytics) — currently undeployed, unclear if these are in-scope for MVP or stage-bloat
- #105 (in-progress): FR-21–FR-25 tests (password auth, reset, webhook, refund, CSV) — these are BEYOND MVP scope; Priya should pause and redirect to F1–F20
- No Playwright test suite exists yet (#74, #66 open) — zero coverage on the critical path (signup → shop → product → checkout → order)
- Product image upload handler (#61) incomplete — blocks F4, which blocks storefront demo
- No CEO demo walk-through has been executed (#80, #76 open) — unknown if the 20 MVP features actually chain together end-to-end

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix import paths in #59 (5 min), then ship #61 (product image upload handler → S3) and #60 (product CRUD forms). These unblock the storefront. Reference F3, F4 in product-spec.md. Parallel: Anil also implements #64 (category filter UI on product list) — three features, three hours max.
- Stream 2 (designer): Ship mockups for product upload form (F3), product detail page (F5), and category filter UI (F7). These are the storefronts + seller-facing forms. No high fidelity needed; wireframe + component layout sufficient. Three files: design/pages/product-form.html, design/pages/product-detail.html, design/pages/category-filter.html.
- Stream 3 (tester): Write Playwright tests for F3 (product CRUD), F4 (image upload success/fail), F7 (category filter works). Do NOT test F21–F25 (those are out of scope). Cover the happy path: seller adds product with image, customer sees it filtered. Reference #66, #74.
- Stream 4 (reviewer): Verify #59 import fixes compile. Verify #61 S3 upload endpoint returns signed URL or file path. Verify #60 forms POST to correct endpoints. Spot-check test coverage in #66 Playwright suite.
- Stream 5 (requirements/PM): Clarify scope of #106 (F31-F40). Those features (billing, analytics, branding) are not MVP — they are Stage 1 scope. Block #106 and redirect Priya to focus #77, #78, #80 (the core 20 MVP features) instead. Confirm with leadership: are we shipping 20 features by end of week, or pivoting to "core 12 + branding + billing"?

ROLE PLAN:
- engineering: YES — three open CRUD + upload tasks block storefront. Anil can ship them in parallel today.
- review: YES — import fixes + S3 handler + form endpoints need quick verification before Priya tests them.
- design: YES — product form, detail page, and filter UI are not shipped yet; designer needs to deliver wireframes today so engineer isn't blocked.
- test: YES — no Playwright suite exists; Priya must cover F3, F4, F7 by day 42 end to prove the storefronts work.
- requirements: YES — #106 is stage-bloat; someone must kill it or clarify why it's in MVP this week.

ONE-LINE SUMMARY:
Today Anil ships product CRUD + image upload + category filter (3 features), Chiara ships product form + detail + filter wireframes, Priya writes tests for all three, Søren verifies imports + S3 endpoint, and Kenji clarifies whether F31-F40 are in this cycle or next.
