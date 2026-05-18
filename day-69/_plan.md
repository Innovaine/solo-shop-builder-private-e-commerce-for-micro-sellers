# Day 69 — Plan: Solo Shop Builder — Private E-commerce for Micro-Sellers

- **By:** Fatima (Planner)
- **Cycle:** 133
- **Saved:** 18/05/2026, 8:53:25 PM

---

# SOLO SHOP BUILDER — DAY 69 BRIEF

## FINISHED:
- Project scaffolding: Dockerfile, .env.example, root config files in place
- Auth skeleton: account/delete/route.ts endpoint exists
- Repository structure ready for feature builds

## PENDING:
- No tasks on board yet — team has baseline infra but zero features shipped to production
- No deployment evidence — unclear if the Dockerfile actually produces a running instance
- No test suite — zero Playwright tests exist

## TODAY'S WORK STREAMS:

**Stream 1 (engineering):** Build F1 (email magic link signup) + F2 (shop creation) + F3 (product CRUD) in parallel. These three unlock everything downstream. Start with auth flow (magic link via email), shop row creation, product schema + endpoints. Ship a running instance to staging by EOD.

**Stream 2 (design):** Ship mockups for seller signup page, shop creation form, product listing dashboard, product add/edit form. Five pages total. These unblock engineering QA and give the team something to visually validate against by afternoon.

**Stream 3 (tester):** Write Playwright tests for F1 (email signup flow), F2 (shop creation form submission), F3 (product create + read). Tests should replicate actual seller workflow: sign up, create shop, add first product. Don't wait for all engineering to finish — write tests as routes land and deploy to staging.

**Stream 4 (reviewer):** Verify that F1, F2, F3 routes are connected (auth → shop creation → product endpoints), that magic link actually sends + validates, that Stripe keys are NOT hardcoded, that product image upload path exists even if S3 isn't wired yet.

**Stream 5 (PM/requirements):** Confirm F1–F3 task definitions on board with acceptance criteria. Lock in: what counts as "signup works"? (Email sent + link valid + session created.) What counts as "shop created"? (Row in DB + slug unique + seller can edit it.) Move ambiguity off the team's plate.

## ROLE PLAN:
- **engineering:** YES — F1/F2/F3 are the foundation; everything else stacks on auth + shop + products. Three parallel endpoints = three-feature day is realistic at this stage.
- **review:** YES — First code hitting main needs verification: no hardcoded secrets, auth actually gates endpoints, routes connect to correct DB tables.
- **design:** YES — Seller-facing mockups (signup, shop creation, product CRUD) are blockers for engineering QA and for any customer preview. Five pages ship fastest in parallel.
- **test:** YES — Playwright tests for signup + shop + product flows run against staging as features land. Don't batch testing at the end.
- **requirements:** YES — F1/F2/F3 need crisp acceptance criteria on the board right now. "Magic link works" is too vague; "seller receives email within 60s, link valid for 24h, clicking it creates session" is actionable.
- **design_qa:** YES — Fidelity check: does the running signup page match the design mockup? Catches misalignment before it becomes a rework.
- **connectivity_qa:** YES — Auth flow (magic link email + session validation) and product routes need route connectivity + webhook plumbing verification. F1 especially.
- **task_verifier:** YES — As each of F1/F2/F3 completes, verify against the acceptance criteria before it's marked done.

## ONE-LINE SUMMARY:
Today the team ships email signup (F1), shop creation (F2), and product CRUD (F3) in parallel—design pages, backend routes, tests, and verification running simultaneously to unblock the storefront stack.
