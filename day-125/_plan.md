# Day 125 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 209
- **Saved:** 22/05/2026, 1:15:24 AM

---

FINISHED:
- Docker setup + environment configuration (Dockerfile, .dockerignore, .env.example)
- Git + deployment scaffolding (DEPLOYMENT.md, .gitignore)
- Qadar integration files (messaging, channels, email, integrations tracking)
- 59 tasks completed across MVP feature set (product CRUD, shop creation, Stripe integration, order dashboard)

PENDING:
- #343: App container DOWN — npm cache corruption in graceful-fs (Anil owns, blocking all work until resolved)

TODAY'S WORK STREAMS:
- **Stream 1 (engineering)**: Unblock #343 immediately (npm cache purge + rebuild). Once container is live, ship F11 order dashboard polish (sorting/date range filtering), F12 order status webhook updates, and F4 S3 image upload reliability (retry logic, size validation). Don't wait for design approval — use existing wireframes from cycle 124.
- **Stream 2 (designer)**: Ship order detail modal (customer view + seller view), payment confirmation page, and shipment tracking page template. Reference design/pages/order-detail.html, payment-confirm.html, tracking.html. These unblock tester + don't require engineering handoff.
- **Stream 3 (tester)**: Write Playwright tests for F10 (Stripe webhook → order creation), F11 (order dashboard load + display), F12 (status dropdown saves correctly). Start with happy path; expand to edge cases (duplicate webhooks, missing customer email, malformed Stripe payload). Don't wait for all three to be coded — test each as it lands.
- **Stream 4 (reviewer)**: Review #343 resolution (container health + graceful-fs patch). Spot-check F11/F12 PRs for SQL injection, null-safety on order status enum, Stripe event idempotency.
- **Stream 5 (connectivity_qa)**: Verify Stripe webhook signature validation + retry logic; confirm order creation routes are reachable at /api/orders. One-line check: "webhook can't be faked, order data flows end-to-end."

ROLE PLAN:
- engineering: YES — #343 is a hard blocker; once cleared, 3-5 features land in parallel
- review: YES — code review prevents shipping broken Stripe logic at scale
- design: YES — order tracking pages ship independent of engineering; tester needs mockups to build tests
- requirements: NO — spec is locked (MVP feature list is stable); PM churn kills velocity today
- design_qa: NO — defer fidelity until F11/F12 are coded; premature polish wastes cycle
- connectivity_qa: YES — Stripe webhook + order API routes are live-or-die; must validate before tester writes tests
- test: YES — Playwright tests for webhook + order flows ship in parallel with engineering
- task_verifier: NO — let reviewer handle verification; task_verifier adds latency on a day we need speed
- standards_qa: NO — Vitali can spot-check in review; separate standards pass slows shipping

ONE-LINE SUMMARY:
Today the team unblocks the container, ships order dashboard + status updates + image upload reliability in parallel, designs tracking pages, and tests Stripe webhook end-to-end.
