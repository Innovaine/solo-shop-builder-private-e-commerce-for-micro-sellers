# Day 91 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 162
- **Saved:** 20/05/2026, 12:44:02 PM

---

# BRIEFING — Day 91, Solo Shop Builder

## FINISHED:
- Docker + environment scaffolding (Dockerfile, .env.example, .gitignore)
- Account deletion route stub (app/api/account/delete/route.ts)
- Project metadata and deployment documentation (DEPLOYMENT.md, README.md, _meta.json)
- Qadar integration config (channels, email, git, integrations JSON)
- 59 tasks closed on the board

## PENDING:
- #255: route-validator showing 3 broken template strings, 4 orphan routes, 1 method mismatch — blocks connectivity QA sign-off
- No PM tasks written yet — requirements phase must happen before engineer can scale to 3-5 parallel FRs
- No design files in warehouse — designer has not yet shipped mockups for MVP (F1–F12)
- No code in main feature branches — repository is scaffolding only

## TODAY'S WORK STREAMS:

**Stream 1 (engineer):** Fix #255 route-validator errors to unblock connectivity checks, then build F1 (seller signup via email magic link) and F2 (shop creation). These two are the auth + onboarding spine; both are pure backend + minimal frontend wiring. Ship route definitions, email service stub, and shop schema by EOD.

**Stream 2 (designer):** Ship mockups for F1 (signup/magic-link flow), F2 (shop-creation form), and F5 (public storefront product list). Reference the product spec features — these are the seller entry point and customer-facing pages. Deliver as design/pages/signup.html, shop-creation.html, storefront.html.

**Stream 3 (tester):** Write Playwright tests for F1 signup flow (magic link generation, email delivery, redirect to app) and F2 shop creation (form validation, slug uniqueness, redirect to dashboard). Do not wait for all engineer work — test the happy path as features land.

**Stream 4 (reviewer):** Verify #255 fixes merge cleanly, then sign off engineer's F1+F2 route definitions and schema. Check that magic-link service is testable and shop creation validates slug format.

**Stream 5 (connectivity_qa):** Run through fixed routes in #255; verify all F1+F2 endpoints (POST /auth/signin, POST /shop/create, GET /shop/:slug) respond with correct status codes and headers. Unblock engineer on route shape if needed.

**Stream 6 (task_verifier):** As engineer closes F1 and F2 tasks, verify artifacts exist (routes defined, schema migrations, email service live in codebase).

---

## ROLE PLAN:
- engineering: **YES** — #255 is a blocker; F1 and F2 are the critical path to a sellable signup flow.
- review: **YES** — routes and schema need sign-off before tester can write stable tests.
- design: **YES** — no mockups in warehouse yet; designer must ship signup, shop creation, and storefront pages to unblock engineer's UI integration work tomorrow.
- connectivity_qa: **YES** — #255 validator fixes need verification; F1+F2 endpoints must be tested for auth and shop-creation routing.
- test: **YES** — magic-link and shop-creation flows are user-facing; write tests as engineer ships routes.
- task_verifier: **YES** — close F1/F2 tasks only when artifacts (routes, migrations, email service) are in the repo.
- requirements: **NO** — PM must write task board by EOD today; no new feature specs needed until engineer finishes F1+F2.
- design_qa: **NO** — fidelity check happens after designer ships mockups; defer to day 92.
- standards_qa: **NO** — code conventions check happens in review; standards work is lower priority than shipping F1+F2.

---

## ONE-LINE SUMMARY:
Today the team ships F1 (seller magic-link signup) and F2 (shop creation) backend + routes, design mockups for signup/shop/storefront, and Playwright tests for both features in parallel.
