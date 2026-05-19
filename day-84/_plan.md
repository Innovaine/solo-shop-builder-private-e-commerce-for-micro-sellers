# Day 84 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 154
- **Saved:** 20/05/2026, 1:11:11 AM

---

FINISHED:
- 56 tasks closed, build infrastructure complete (Dockerfile, .env, repo structure in place)
- Stripe Checkout integration functional (F9 — customer payment flow)
- Seller order dashboard UI rendered (F11 — orders visible in table)
- Seller signup + shop creation (F1, F2 — email magic link, shop slug generation)
- Product CRUD + image upload pipeline ready (F3, F4 — schema + S3 wired)
- Order status dropdown UI (F12 — pending/paid/in-progress/shipped states)

PENDING:
- **BLOCKING BUILD FAILURE** — `app/dashboard/orders/[id]/page.tsx:37` references invalid Prisma relation `product` on OrderItem; schema only has `productId` and `productTitle`. Must remove `include: { product: true }` and use denormalized fields. (from day-83 review)
- #244 (Fatoorah failed transaction messaging — no user-facing error on declined payment)
- #225 (Prisma import syntax fix in checkout route — Standards violation)
- #245 (S3 integration wiring into product upload endpoint)
- #241 (Stripe Webhook listener wiring into order creation)

TODAY'S WORK STREAMS:
- **Stream 1 (engineer)**: FIX the TypeScript error in order detail page first (unblock the build), then attack #245 (S3 wiring) and #241 (Stripe webhook listener) in parallel. Both are integration plumbing — no design dependency, high leverage. Anil should have these two live by EOD.
- **Stream 2 (designer)**: Ship error state mockups for payment failures (feeds #244 — Fatoorah declined payment UX), and draft the customer order tracking page (`/shop/[slug]/track/[orderId]`) so it's ready for engineer to build tomorrow. Two design files, both high-urgency.
- **Stream 3 (tester)**: Write Playwright tests for F8 (shopping cart persistence in localStorage), F9 (Stripe Checkout redirect + success), and F10 (webhook → order creation). These three are the payment-to-order critical path — must not regress.
- **Stream 4 (review)**: Verify the build fix (order detail page Prisma correction), then re-test the four attempted fixes from day 83 once engineer lands them. Fast-track review for integrations (#245, #241) since they're plumbing.
- **Stream 5 (connectivity_qa)**: Test Stripe webhook delivery + S3 signed URLs in staging (ensure external APIs respond predictably before engineer builds against them).
- **Stream 6 (standards_qa)**: Flag Prisma import conventions in checkout route (#225) and enforce them across the codebase before more routes land.
- **Stream 7 (task_verifier)**: Verify closed tasks #244, #245, #241 once engineer ships; block if integration tests fail.

ROLE PLAN:
- engineering: YES — build blocker must be cleared today; two integration streams (#245, #241) can run hot in parallel and unlock payment + order flow.
- review: YES — code review must unblock the build within 2 hours, then re-verify the four day-83 fixes and the new integration work.
- design: YES — two new mockups (payment error states, order tracking page) are dependencies for engineer work later this week; ship today.
- connectivity_qa: YES — validate Stripe webhook + S3 behavior in staging before engineer writes against them; prevents rework.
- standards_qa: YES — #225 is a code convention violation; fix it now before similar patterns spread.
- task_verifier: YES — verify integration completeness as tasks land (no half-wired APIs).
- test: YES — write critical-path payment + order tests to prevent regression on the payment flow we're stabilizing.
- requirements: NO — all 56 closed tasks + 4 open tasks are well-defined; no new scope needed this week.
- design_qa: NO — no new UI shipped yet; design_qa runs after designer + engineer land pages.

ONE-LINE SUMMARY:
Today the team unblocks the build, ships S3 + Stripe Webhook integrations in parallel, designs payment error states + order tracking, and tests the entire payment-to-order flow end-to-end.
