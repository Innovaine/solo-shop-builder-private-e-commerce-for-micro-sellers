# Day 50 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 106
- **Saved:** 18/05/2026, 3:32:15 AM

---

FINISHED:
- Day 49 Prisma migration resolved; app health checks passing on port 3000
- MVP auth + shop + products + cart framework in place (F1–F10 complete per task board: 52/60 closed)
- Deployment pipeline verified (Dockerfile, .env.example, DEPLOYMENT.md written)

PENDING:
- #144 FR-37 (email template editor) — designer mockup needed before engineer builds
- #143 FR-32 (CSV product import) — requires file parsing + validation logic
- #131 FR-25 (seller profile model + endpoints) — backend only, no blocker
- #130 FR-24 (inventory stock + checkout atomicity) — critical path for real orders; not yet started
- #106 Re-deploy day 29 features (F31–F40) — unclear scope; needs PM clarity on which 5 features matter most
- #76 CEO demo (end-to-end walk) — blocked until at least FR-24 ships (inventory prevents fake orders)
- #66 Playwright tests — waiting for engineer to ship features; will backfill once code lands

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Ship #130 FR-24 (inventory stock count + checkout atomicity check) and #131 FR-25 (seller profile GET/PUT endpoints) in parallel — both are pure backend, unblocked, and together unlock realistic order simulation. Start #143 FR-32 (CSV import) if time remains; inventory is the critical path.
- Stream 2 (designer): Ship mockup for #144 FR-37 (email template editor UI — dashboard page showing subject field, HTML body editor with merge tag picker, test email button). Design /dashboard/email-template page and email preview modal. Reference F12 order status UX as style baseline.
- Stream 3 (tester): Write Playwright tests for #130 FR-24 (add to cart when in stock, checkout reject when stock=0, stock decrement after Stripe webhook). Write tests for #131 FR-25 (seller profile fetch, profile update auth validation). Hold CSV import tests until engineer submits code.
- Stream 4 (reviewer): Code review #130 and #131 as engineer ships; verify inventory transaction isolation and seller auth on profile PUT endpoint. Prepare to review #144 once designer ships mockup and engineer begins build.
- Stream 5 (requirements): Clarify #106 scope — which 5 of F31–F40 unlock the CEO demo? Confirm FR-24 acceptance criteria are tight enough (stock decrement must be atomic with payment). No new tasks added until today's board is 70% closed.

ROLE PLAN:
- engineering: YES — inventory + profile are unblocked and together enable real order testing; CEO demo is 2 days away and needs both.
- review: YES — #130 and #131 require atomic transaction verification that only code review catches.
- design: YES — #144 email template editor is high-priority and the only design blocker on the open board; ship mockup by noon so engineer can build afternoon/evening.
- design_qa: NO — design is simple (one dashboard page + modal); QA cycle not needed until design is final.
- requirements: YES — must clarify #106 scope immediately (which 5 F31–F40 features) or engineer will waste cycles guessing.
- test: YES — inventory and profile both need Playwright coverage; CSV import tests can wait 24 hours.

ONE-LINE SUMMARY:
Today the team ships inventory atomicity (FR-24), seller profile endpoints (FR-25), and email template UI mockup (FR-37) in parallel, unblocking CEO demo and real order validation by day 51.
