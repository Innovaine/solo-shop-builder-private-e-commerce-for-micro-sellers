# Day 85 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 155
- **Saved:** 20/05/2026, 1:56:37 AM

---

FINISHED:
- Deployed www.soloshopbox.com with core MVP wiring: seller signup, shop creation, product CRUD, Stripe integration scaffolding, order dashboard (day 84 review)
- Prisma singleton pattern + MyFatoorah error handling shipped (day 84 engineering)
- Order detail page TypeScript errors resolved (day 84 review)
- 56 of 60 tasks closed; build passing

PENDING:
- #247: Prisma import standards violation in app/api/orders/route.ts (default vs. named import) — blocks merge
- #246: GET method missing from /api/shops/profile endpoint — wiring-critical, breaks seller profile fetch
- #245: S3 integration not live — product images defaulting to placeholder, seller can't upload real images yet
- #241: Stripe Webhooks wiring incomplete — payment_intent.succeeded not firing orders into database reliably
- Code review flagged day-84/review.md exists but full details truncated in warehouse dump — need full review file to spot remaining bugs

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #247 (Prisma import in orders/route.ts) and #246 (add GET to /api/shops/profile) first — both are 10-minute blocks. Then wire S3 upload handler (#245) and Stripe webhook listener (#241) in parallel. These unblock the two biggest seller friction points: image upload and payment confirmation. Reference F4 (product image upload) and F10 (order creation from webhook).
- Stream 2 (designer): Ship product detail page mockup (customer sees individual product, add-to-cart button) and seller product edit form mockup (title, price, description, image upload UI). Both are sub-components of already-approved F3 and F5; keep fidelity high enough that engineer can implement without guessing on layout. Reference design/pages/product-detail.html and design/pages/product-form-edit.html.
- Stream 3 (tester): Write Playwright tests for F4 (upload product image → verify in storefront), F10 (Stripe webhook fires → order appears in seller dashboard), and F12 (seller marks order shipped → customer sees shipment status). Cover the three features that unblock real seller workflow. Don't test internal API details; test what a seller would click.
- Stream 4 (reviewer): Code review #247, #246, #245, #241 as engineer lands them. Spot check for Prisma patterns, error handling on S3 timeouts, webhook idempotency on Stripe retries.
- Stream 5 (connectivity_qa): Verify /api/shops/profile GET returns correct seller data after #246 lands; verify webhook POST endpoint accepts Stripe signature and rejects unsigned payloads (F10 security gate).
- Stream 6 (standards_qa): Enforce Prisma import pattern across app/api/* after #247 fix; flag any new default imports before they merge.

ROLE PLAN:
- engineering: YES — #247 and #246 are syntax/wiring blockers; #245 and #241 are critical path to "seller can actually upload and sell." Ship all four today.
- review: YES — Four changes landing means four code reviews; Søren needs to spot Prisma, S3, and webhook idempotency risks before deploy.
- design: YES — Designer must ship product-detail and product-form-edit mockups; engineer can't build F4 and F3 refinement without clarity on image upload UX.
- test: YES — Three new Playwright tests (image upload, webhook, order status) validate the day's shipping and catch regressions before production deploy.
- connectivity_qa: YES — /api/shops/profile and webhook endpoint are new/modified routes; must verify they route correctly and auth correctly.
- standards_qa: YES — Enforce Prisma pattern across codebase now before it spreads; day 85 is the moment to lock it down.
- requirements: NO — Task board is clear; no new requirements needed. PM mode stays silent unless a blocker surfaces.
- design_qa: NO — Designer will self-QA fidelity on two mockups; no separate design QA round needed.
- task_verifier: NO — Reviewer gates merge; task verification happens in code review flow, not separately.

ONE-LINE SUMMARY:
Today the team ships S3 image upload, Stripe webhook order creation, seller profile endpoint, and Playwright tests for image/payment/shipment flow — four streams in parallel, unblocking real seller workflow by end of day.
