# Day 102 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 178
- **Saved:** 20/05/2026, 10:39:48 PM

---

FINISHED:
- Product CRUD, shop storefront, categories, cart, Stripe integration, order creation from webhook, seller dashboard, order status tracking (50 tasks closed; F1–F12 core MVP features implemented)
- Docker setup, deployment pipeline, magic link auth, S3 image upload, Stripe webhook handler
- Day 101 code review completed; warehouse state captured

PENDING:
- #297: Shop page header/product section redesign and sorting — UI fidelity issue, not blocking functionality
- #296: Order receipt download on success page — nice-to-have, not blocking MVP
- #295: Success page redirect loop (goes to login instead of shop) — CRITICAL FLOW BUG
- #294: Emoji removal + multi-image display on product detail — incomplete image handling
- #293: Multi-image upload for products — backend schema/API may exist but frontend incomplete
- #292: MyFatoorah payment integration (card/Apple Pay/Google Pay/KNET) — new payment method, not Stripe
- #291: Email validation in checkout — may be implicit but needs explicit enforcement
- #290: Currency-aware payment routing (KWD → MyFatoorah, USD → Stripe) — conditional logic not wired
- #289: lib/db.ts vs src/lib/db.ts duplication — standards debt, causes confusion
- #288: MyFatoorah callback signature verification missing from GitHub — code exists in warehouse but not committed

TODAY'S WORK STREAMS:
- Stream 1 (engineer): Fix #295 success-page redirect (critical UX blocker), then ship #291 email validation in checkout, then implement #290 currency-aware payment routing logic so MyFatoorah and Stripe can coexist. These three unblock sellers in KWD markets and prevent checkout friction.
- Stream 2 (designer): Ship mockups for #297 (shop header redesign + product grid layout), #296 (receipt download UI on success page), and #294 (multi-image carousel on product detail). These improve storefront fidelity and UX velocity.
- Stream 3 (tester): Write Playwright tests for F9 (Stripe Checkout redirect), F10 (webhook order creation), F12 (order status dropdown), plus new tests for #295 redirect behavior, #291 email validation, and #290 currency routing.
- Stream 4 (reviewer): Verify #295 fix (critical path), then spot-check #289 and #288 (wiring debt) — consolidate db.ts implementations and commit MyFatoorah verification to GitHub.
- Stream 5 (standards_qa): Resolve #289 (db.ts duplication) and #288 (missing commits) — enforce single source of truth for database and payment callbacks before next cycle.

ROLE PLAN:
- engineering: YES — 10 open tasks and 3 critical paths (#295, #290, #291) need shipping; Anil has capacity to tackle multi-image, payment routing, and redirect logic in parallel.
- review: YES — code review from day 101 is done; day 102 will need verification of critical fixes (#295 first) and wiring cleanup (#289, #288).
- design: YES — Five open tasks (#297, #296, #294, #293, #292) have design components; shop redesign and checkout UI need mockups before engineering polishes.
- connectivity_qa: YES — MyFatoorah integration (#292, #290) introduces new payment API; routes, webhook signature verification, and currency routing need validation.
- test: YES — Playwright coverage for Stripe and webhook flows exists but not for MyFatoorah callbacks or currency routing; new tests required for #290/#292.
- task_verifier: YES — 10 open tasks need proof of completion; #295 is critical UX fix and must be verified live before deployment.
- requirements: NO — product spec is locked and tasks are clear from board; PM approval not blocking execution today.
- design_qa: NO — design fidelity checks can follow design handoff; not blocking engineering start.
- standards_qa: YES — #289 and #288 are standards debt that create confusion in parallel work; one engineer should consolidate db.ts and commit MyFatoorah verification today.

ONE-LINE SUMMARY:
Today the team ships critical redirect fix (#295), adds email + currency routing logic (#291, #290), redesigns shop header (#297), adds receipt UI (#296), and cleans up wiring debt (#289, #288) — five work streams in parallel.
