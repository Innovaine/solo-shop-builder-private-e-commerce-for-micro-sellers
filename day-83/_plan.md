# Day 83 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 153
- **Saved:** 20/05/2026, 12:18:39 AM

---

FINISHED:
- Shop CRUD, product CRUD, S3 image upload, public storefront with category filtering (F1–F7 complete)
- Stripe Checkout integration + webhook listener (F9–F10 complete)
- Seller order dashboard with status dropdown (F11–F12 complete)
- 54 tasks closed; Dockerfile + deployment pipeline ready
- .env.example, README, DEPLOYMENT.md present (infra scaffolding done)

PENDING:
- #243: Myfatoorah payment docs out of sync — blocks alternative payment method (Anil/Zainab/Vitali own this)
- #225: Prisma import syntax error in checkout/route.ts — breaks build
- #242: Hand-rolled Product interface in dashboard/products/page.tsx still live instead of Prisma schema import
- #241: Stripe webhook wiring incomplete — payment_intent events may not persist to orders table reliably
- #240: Refund endpoint returns 500 on auth failure instead of 401 — security debt
- #239: Orders detail route /dashboard/orders/[id] missing — "View" button on order table 404s

TODAY'S WORK STREAMS:
- **Stream 1 (engineering):** Fix Prisma import syntax (#225), wire Stripe webhooks fully (#241), build missing /dashboard/orders/[id] detail route (#239). These unblock customer order tracking and seller refund workflows. Ship in this order: syntax fix → webhook → detail page.
- **Stream 2 (designer):** Finalize order detail page mockup (customer tracking view + seller refund UI), refund modal, order history filter mockup. Seller needs to see order history by date range next week; ship the frame today.
- **Stream 3 (tester):** Write Playwright tests covering F10 (webhook creates order), F11 (order dashboard loads), F12 (status dropdown updates). Test refund endpoint 401 behavior. Validate all three engineer deliverables ship without regression.
- **Stream 4 (standards_qa):** Sweep #242 (Product interface), #225 (Prisma import), refund endpoint error handling (#240). Enforce consistent Prisma usage across routes before merging.
- **Stream 5 (connectivity_qa):** Verify Stripe webhook routing, test auth failure cases in refund endpoint, confirm /dashboard/orders/[id] routes to correct seller only (no cross-tenant access).

ROLE PLAN:
- engineering: YES — 6 open tasks, 3 are blocking critical paths (Stripe wiring, detail route, syntax errors); engineer must clear these to unblock next features.
- review: YES — 3 PRs incoming (Prisma fixes, webhook wiring, detail route); code review gates deploy.
- design: YES — Order detail page + refund UI mockups ship today; seller needs visual spec before engineering builds detail page next.
- connectivity_qa: YES — Stripe webhook routing and auth boundaries must be tested before production; cross-tenant order access is a security gate.
- standards_qa: YES — Prisma import debt (#242, #225) is accumulating; fix now before codebase becomes inconsistent.
- test: YES — Webhook, dashboard, and refund flows need Playwright coverage; tester writes tests in parallel as engineer ships.
- task_verifier: YES — Six open tasks need proof of completion; verifier closes them as they land.
- requirements: NO — Spec is locked (MVP scope clear); no new feature discovery needed today.
- design_qa: NO — Fidelity issues are minor at this stage; ship fast, refine next cycle.

ONE-LINE SUMMARY:
Today the team ships Prisma syntax fixes + complete Stripe webhook routing + order detail page in parallel, unblocking customer order tracking and seller refund workflows.
